/* eslint-env node */

/**
 * Report discrepancies between the JSDoc comments and the TypeScript declarations.
 *
 * The JSDoc JSON export is written to a temporary directory and removed again. Classes,
 * members, parameters, return values and types in typescript/phaser.d.ts,
 * typescript/pixi.d.ts and typescript/p2.d.ts are compared with it and the findings are
 * printed. Nothing in the repository is written.
 *
 * Usage: node scripts/check-tsdocs.js [--public-only]
 *
 * With --public-only, JSDoc members and functions marked private or protected are ignored.
 */
'use strict';

var childProcess = require('child_process');
var fs = require('fs');
var os = require('os');
var path = require('path');
var ts = require('typescript');

var root = path.resolve(__dirname, '..');
var jsdocBin = path.join(root, 'node_modules', '.bin', 'jsdoc');
var jsdocConfFile = path.join(root, 'tasks', 'jsdocexportjson-conf.json');
var jsdocTemplate = path.join(root, 'resources', 'jsdoc Export JSON', 'template');
var declarationFiles = [ 'typescript/phaser.d.ts', 'typescript/pixi.d.ts', 'typescript/p2.d.ts' ];

var categories = [
    { id: 'missing-class', title: 'Classes in JSDoc but not in TypeScript' },
    { id: 'undocumented-class', title: 'Classes in TypeScript but not in JSDoc' },
    { id: 'missing-member', title: 'Members in JSDoc but not in TypeScript' },
    { id: 'undocumented-member', title: 'Members in TypeScript but not in JSDoc' },
    { id: 'kind-mismatch', title: 'Property in one source, method in the other' },
    { id: 'visibility', title: 'Visibility differs (private in one source, public in the other)' },
    { id: 'parameter-count', title: 'Parameter count differs' },
    { id: 'parameter-name', title: 'Parameter name differs' },
    { id: 'parameter-optional', title: 'Parameter optionality differs' },
    { id: 'parameter-type', title: 'Parameter type differs' },
    { id: 'member-type', title: 'Member type differs' },
    { id: 'return-type', title: 'Return type differs' },
    { id: 'missing-return', title: 'TypeScript has a return type, JSDoc has no @return' },
    { id: 'underscore-public', title: 'Public JSDoc names starting with "_"' }
];

var findings = [];

// Set by the --public-only flag. JSDoc members and functions marked private or protected are then ignored.
var publicOnly = process.argv.slice(2).indexOf('--public-only') !== -1;

function isPublicJsdoc (item)
{
    return item.access !== 'private' && item.access !== 'protected';
}

function visibleJsdoc (jsClass)
{
    if (!publicOnly)
    {
        return jsClass;
    }

    return {
        name: jsClass.name,
        constructor: jsClass.constructor,
        members: (jsClass.members || []).filter(isPublicJsdoc),
        functions: (jsClass.functions || []).filter(isPublicJsdoc)
    };
}

function report (category, loc, subject, message)
{
    findings.push({ category: category, loc: loc, subject: subject, message: message });
}

function locOf (entry)
{
    return entry.file + ':' + entry.line;
}

function isPublic (entry)
{
    return !entry.isPrivate;
}

function isTopLevelParam (param)
{
    // JSDoc lists nested options as "options.name"; TypeScript declares them inside the object type.
    return String(param.name || '').indexOf('.') === -1;
}

function publicEntries (map, name)
{
    return (map[name] || []).filter(isPublic);
}

/* JSDoc export */

function generateJsdocJson (tmpDir)
{
    var conf = JSON.parse(fs.readFileSync(jsdocConfFile, 'utf8'));
    var confFile = path.join(tmpDir, 'jsdoc-conf.json');
    var outFile = path.join(tmpDir, 'docs.json');
    var result;

    conf.opts.destination = tmpDir;
    conf.opts.template = jsdocTemplate;
    fs.writeFileSync(confFile, JSON.stringify(conf), 'utf8');

    result = childProcess.spawnSync(process.execPath, [ jsdocBin, '-c', confFile ], { cwd: root, encoding: 'utf8' });

    if (result.status !== 0 || !fs.existsSync(outFile))
    {
        throw new Error('JSDoc export failed.\n' + (result.stderr || ''));
    }

    return JSON.parse(fs.readFileSync(outFile, 'utf8'));
}

function removeTempDir (dir)
{
    fs.readdirSync(dir).forEach(function (name)
    {
        fs.unlinkSync(path.join(dir, name));
    });

    fs.rmdirSync(dir);
}

function exportJsdoc ()
{
    var tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'phaser-check-tsdocs-'));

    try
    {
        return generateJsdocJson(tmpDir);
    }
    finally
    {
        removeTempDir(tmpDir);
    }
}

/* TypeScript declarations */

function lineOf (ctx, node)
{
    return ctx.sourceFile.getLineAndCharacterFromPosition(node.getStart()).line;
}

function typeText (typeNode)
{
    return typeNode ? typeNode.getText() : null;
}

function baseTypeName (node)
{
    var clauses = node.heritageClauses || [];

    for (var i = 0; i < clauses.length; i++)
    {
        if (clauses[i].token === ts.SyntaxKind.ExtendsKeyword && clauses[i].types.length > 0)
        {
            return clauses[i].types[0].getText().replace(/<[\s\S]*$/, '').replace(/^p2\./, 'Phaser.Physics.P2.');
        }
    }

    return null;
}

function paramsOf (decl)
{
    return (decl.parameters || []).map(function (p)
    {
        return {
            name: p.name.text,
            optional: !!p.questionToken || !!p.dotDotDotToken,
            rest: !!p.dotDotDotToken,
            type: typeText(p.type)
        };
    });
}

function addEntry (map, name, entry)
{
    map[name] = map[name] || [];
    map[name].push(entry);
}

function scanMembers (node, cls, ctx)
{
    node.members.forEach(function (member)
    {
        var isPrivate = !!(member.flags & ts.NodeFlags.Private);
        var line = lineOf(ctx, member);

        if (member.kind === ts.SyntaxKind.Property)
        {
            addEntry(cls.properties, member.name.text, { file: ctx.file, line: line, isPrivate: isPrivate, type: typeText(member.type) });
        }
        else if (member.kind === ts.SyntaxKind.Method)
        {
            addEntry(cls.methods, member.name.text, { file: ctx.file, line: line, isPrivate: isPrivate, params: paramsOf(member), returnType: typeText(member.type) });
        }
        else if (member.kind === ts.SyntaxKind.Constructor)
        {
            cls.constructors.push({ file: ctx.file, line: line, isPrivate: isPrivate, params: paramsOf(member) });
        }
    });
}

function visitDeclarations (node, prefix, onClass)
{
    if (node.kind === ts.SyntaxKind.ModuleDeclaration)
    {
        // Skip `declare module "name"` blocks; they have no named members.
        if (node.name.kind === ts.SyntaxKind.Identifier)
        {
            visitChildren(node, prefix.concat(node.name.text), onClass);
        }
    }
    else if (node.kind === ts.SyntaxKind.ClassDeclaration)
    {
        onClass(node, prefix.concat(node.name.text).join('.'));
    }
    else
    {
        visitChildren(node, prefix, onClass);
    }
}

function visitChildren (node, prefix, onClass)
{
    ts.forEachChild(node, function (child)
    {
        visitDeclarations(child, prefix, onClass);
    });
}

function collectTypeScriptClasses ()
{
    var compilerOptions = { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.AMD, noLib: true };
    var fileNames = declarationFiles.map(function (relFile)
    {
        return ts.normalizePath(path.join(root, relFile));
    });
    var program = ts.createProgram(fileNames, compilerOptions, ts.createCompilerHost(compilerOptions));
    var classes = Object.create(null);
    var list = [];

    declarationFiles.forEach(function (relFile)
    {
        var sourceFile = program.getSourceFile(ts.normalizePath(path.join(root, relFile)));

        if (!sourceFile)
        {
            throw new Error('Cannot read ' + relFile);
        }

        var ctx = { file: relFile, sourceFile: sourceFile };

        visitDeclarations(sourceFile, [], function (node, qualifiedName)
        {
            // Classes can be declared in more than one file; merge them by name.
            var name = qualifiedName.replace(/^p2\./, 'Phaser.Physics.P2.');
            var cls = classes[name];

            if (!cls)
            {
                cls = {
                    name: name,
                    file: relFile,
                    line: lineOf(ctx, node),
                    base: baseTypeName(node),
                    properties: Object.create(null),
                    methods: Object.create(null),
                    constructors: []
                };

                classes[name] = cls;
                list.push(cls);
            }

            scanMembers(node, cls, ctx);
        });
    });

    return { classes: classes, list: list };
}

function findClass (classes, name)
{
    var candidates = [ name, 'Phaser.' + name, 'PIXI.' + name ];

    for (var i = 0; i < candidates.length; i++)
    {
        if (classes[candidates[i]])
        {
            return classes[candidates[i]];
        }
    }

    return null;
}

function ancestorsOf (cls, classes)
{
    var result = [];
    var current = cls;

    while (current.base && result.length < 20)
    {
        var base = findClass(classes, current.base);

        if (!base || result.indexOf(base) !== -1)
        {
            break;
        }

        result.push(base);
        current = base;
    }

    return result;
}

function hasAncestorMember (cls, name, classes)
{
    return ancestorsOf(cls, classes).some(function (ancestor)
    {
        return publicEntries(ancestor.properties, name).length > 0 || publicEntries(ancestor.methods, name).length > 0;
    });
}

/* Type comparison */

function jsdocTypeText (type)
{
    if (!type)
    {
        return null;
    }

    if (typeof type === 'string')
    {
        return type;
    }

    if (Array.isArray(type))
    {
        return type.join('|');
    }

    if (Array.isArray(type.names))
    {
        return type.names.join('|');
    }

    return null;
}

// Splits on `|` outside brackets, so function types such as `(a: number | string) => void` stay whole.
function splitUnion (text)
{
    var parts = [];
    var depth = 0;
    var start = 0;

    for (var i = 0; i < text.length; i++)
    {
        var c = text.charAt(i);

        if (c === '>' && i > 0 && text.charAt(i - 1) === '=')
        {
            continue;
        }

        if (c === '(' || c === '<' || c === '{' || c === '[')
        {
            depth++;
        }
        else if (c === ')' || c === '>' || c === '}' || c === ']')
        {
            depth--;
        }
        else if (c === '|' && depth === 0)
        {
            parts.push(text.slice(start, i));
            start = i + 1;
        }
    }

    parts.push(text.slice(start));

    return parts;
}

// Names that JSDoc and TypeScript use for the same type.
var typeAliases = {
    Number: 'number',
    integer: 'number',
    String: 'string',
    Boolean: 'boolean',
    WebGLContext: 'WebGLRenderingContext'
};

// Returns a canonical name for one member of a union, or null if the type cannot be compared reliably.
function canonicalPart (part)
{
    var s = part.replace(/^[?!]+/, '')
        .replace(/\b(Phaser\.Physics\.P2|p2)\./g, '')
        .replace(/\b(Phaser|PIXI)\./g, '');
    var match;

    if ((match = (/^(?:Array|array)\.?<(.+)>$/).exec(s)))
    {
        return match[1].indexOf('|') === -1 ? canonicalPart(match[1] + '[]') : null;
    }

    if ((match = (/^(.+)\[\]$/).exec(s)))
    {
        var inner = canonicalPart(match[1]);

        return inner === null ? null : inner + '[]';
    }

    if ((/=>/).test(s) || (/^function(\(|$)/i).test(s) || s === 'Function')
    {
        return 'Function';
    }

    if ([ '', '*', 'any', 'Any', 'Object', 'object', 'unknown', 'Array', 'array' ].indexOf(s) !== -1)
    {
        return null;
    }

    if ((/[|<>(){}[\]]/).test(s) || (/^typeof/).test(s))
    {
        return null;
    }

    return Object.prototype.hasOwnProperty.call(typeAliases, s) ? typeAliases[s] : s;
}

function canonicalType (text)
{
    if (text === null || text === undefined)
    {
        return null;
    }

    var parts = splitUnion(String(text).replace(/\s+/g, ''));
    var names = [];

    for (var i = 0; i < parts.length; i++)
    {
        var name = canonicalPart(parts[i]);

        if (name === null)
        {
            return null;
        }

        // Nullability is not a type mismatch, so `Texture|null` matches `Texture`.
        if (name === 'null' || name === 'undefined')
        {
            continue;
        }

        if (names.indexOf(name) === -1)
        {
            names.push(name);
        }
    }

    return names.sort().join('|');
}

// Returns false only when both types are known and differ.
function sameType (a, b)
{
    var ca = canonicalType(a);
    var cb = canonicalType(b);

    return ca === null || cb === null || ca === cb;
}

/* Comparison */

function pickOverload (entries, jsParams)
{
    var count = jsParams.filter(isTopLevelParam).length;

    for (var i = 0; i < entries.length; i++)
    {
        if (entries[i].params.length === count)
        {
            return entries[i];
        }
    }

    return entries[0];
}

function compareParameters (jsParams, tsParams, loc, subject)
{
    var documented = jsParams.filter(isTopLevelParam);
    var count = Math.min(documented.length, tsParams.length);

    if (documented.length !== tsParams.length)
    {
        report('parameter-count', loc, subject, 'JSDoc documents ' + documented.length + ' parameter(s), TS declares ' + tsParams.length);
    }

    for (var i = 0; i < count; i++)
    {
        var jp = documented[i];
        var tp = tsParams[i];
        var position = 'parameter ' + (i + 1) + ' "' + tp.name + '"';

        if (!tp.rest && jp.name !== tp.name)
        {
            report('parameter-name', loc, subject, 'parameter ' + (i + 1) + ': JSDoc "' + jp.name + '", TS "' + tp.name + '"');
        }

        if (typeof jp.optional === 'boolean' && jp.optional !== tp.optional)
        {
            report('parameter-optional', loc, subject, position + ': JSDoc ' + (jp.optional ? 'optional' : 'required') + ', TS ' + (tp.optional ? 'optional' : 'required'));
        }

        var jsType = jsdocTypeText(jp.type);
        var tsType = (tp.type && tp.rest) ? tp.type.replace(/\[\]$/, '') : tp.type;

        if (jsType && tsType && !sameType(jsType, tsType))
        {
            report('parameter-type', loc, subject, position + ': JSDoc "' + jsType + '", TS "' + tsType + '"');
        }
    }
}

function compareReturn (fn, overload, subject)
{
    var loc = locOf(overload);
    var tsReturn = overload.returnType;

    if (fn.returns)
    {
        var jsReturn = jsdocTypeText(fn.returns.type);

        if (jsReturn && tsReturn && !sameType(jsReturn, tsReturn))
        {
            report('return-type', loc, subject, 'JSDoc "' + jsReturn + '", TS "' + tsReturn + '"');
        }
    }
    else if (tsReturn && tsReturn !== 'void' && tsReturn !== 'any')
    {
        report('missing-return', loc, subject, 'TS returns "' + tsReturn + '", JSDoc has no @return');
    }
}

function compareDocumentedItem (item, cls, classes, isMethod)
{
    var subject = cls.name + '#' + item.name;
    var sameKind = publicEntries(isMethod ? cls.methods : cls.properties, item.name);
    var otherKind = publicEntries(isMethod ? cls.properties : cls.methods, item.name);
    var declared = (cls.properties[item.name] || []).concat(cls.methods[item.name] || []);

    if (item.access === 'private')
    {
        if (declared.some(isPublic))
        {
            report('visibility', locOf(declared.filter(isPublic)[0]), subject, 'JSDoc marks it private, TypeScript declares it public');
        }

        return;
    }

    if (sameKind.length === 0)
    {
        if (otherKind.length > 0)
        {
            report('kind-mismatch', locOf(otherKind[0]), subject, isMethod ? 'JSDoc documents a method, TypeScript declares a property' : 'JSDoc documents a property, TypeScript declares a method');
        }
        else if (!hasAncestorMember(cls, item.name, classes))
        {
            if (declared.length > 0)
            {
                report('visibility', locOf(declared[0]), subject, 'JSDoc documents it, TypeScript declares it private');
            }
            else
            {
                report('missing-member', null, subject, 'documented in JSDoc, not declared in TypeScript');
            }
        }

        return;
    }

    if (isMethod)
    {
        var overload = pickOverload(sameKind, item.parameters || []);

        compareParameters(item.parameters || [], overload.params, locOf(overload), subject);
        compareReturn(item, overload, subject);
    }
    else
    {
        var jsType = jsdocTypeText(item.type);
        var tsType = sameKind[0].type;

        if (jsType && tsType && !sameType(jsType, tsType))
        {
            report('member-type', locOf(sameKind[0]), subject, 'JSDoc "' + jsType + '", TS "' + tsType + '"');
        }
    }
}

function compareConstructor (jsClass, cls)
{
    var jsParams = (jsClass.constructor && jsClass.constructor.parameters) || [];
    var entries = cls.constructors.filter(isPublic);
    var overload = entries.length > 0 ? pickOverload(entries, jsParams) : null;

    compareParameters(jsParams, overload ? overload.params : [], overload ? locOf(overload) : locOf(cls), cls.name + '.constructor');
}

function compareClass (jsClass, cls, classes, documented)
{
    (jsClass.members || []).forEach(function (member)
    {
        compareDocumentedItem(member, cls, classes, false);
    });

    (jsClass.functions || []).forEach(function (fn)
    {
        compareDocumentedItem(fn, cls, classes, true);
    });

    compareConstructor(jsClass, cls);

    // A member documented on any class counts as documented, because mixins are documented once and copied into many classes.
    var seen = Object.create(null);

    Object.keys(cls.properties).concat(Object.keys(cls.methods)).forEach(function (name)
    {
        if (seen[name])
        {
            return;
        }

        seen[name] = true;

        var entries = publicEntries(cls.properties, name).concat(publicEntries(cls.methods, name));

        if (entries.length > 0 && !documented[name])
        {
            report('undocumented-member', locOf(entries[0]), cls.name + '#' + name, 'declared in TypeScript, not documented in JSDoc');
        }
    });
}

/* Underscore names */

// Names starting with `_` are usually meant to be private, so public JSDoc entries with that prefix are reported.
function checkUnderscoreNames (jsdoc)
{
    var seen = Object.create(null);

    (jsdoc.classes || []).forEach(function (jsClass)
    {
        var items = (jsClass.members || []).concat(jsClass.functions || []);

        items.filter(isPublicJsdoc).forEach(function (item)
        {
            var name = String(item.name || '');
            var subject = jsClass.name + '#' + name;

            if (name.charAt(0) === '_' && !seen[subject])
            {
                seen[subject] = true;
                report('underscore-public', null, subject, 'public in JSDoc, but the name starts with "_"');
            }
        });
    });
}

/* Output */

function printReport (jsdocCount, tsCount)
{
    console.log('Compared ' + jsdocCount + ' JSDoc classes with ' + tsCount + ' TypeScript classes (' + declarationFiles.join(', ') + ').');

    if (publicOnly)
    {
        console.log('Only public JSDoc members and functions were compared (--public-only).');
    }

    if (findings.length === 0)
    {
        console.log('No discrepancies found.');

        return;
    }

    console.log('');
    console.log('Summary');

    categories.forEach(function (category)
    {
        var count = findings.filter(function (f) { return f.category === category.id; }).length;

        if (count > 0)
        {
            console.log('  ' + count + '  ' + category.title);
        }
    });

    categories.forEach(function (category)
    {
        var items = findings.filter(function (f) { return f.category === category.id; });

        if (items.length === 0)
        {
            return;
        }

        items.sort(function (a, b)
        {
            return a.subject < b.subject ? -1 : (a.subject > b.subject ? 1 : 0);
        });

        console.log('');
        console.log(category.title + ' (' + items.length + ')');

        items.forEach(function (f)
        {
            console.log('  ' + (f.loc || 'JSDoc') + '  ' + f.subject + ': ' + f.message);
        });
    });
}

function main ()
{
    var jsdoc = exportJsdoc();
    var declared = collectTypeScriptClasses();
    var jsClasses = Object.create(null);
    var documented = Object.create(null);

    (jsdoc.classes || []).forEach(function (jsClass)
    {
        if (jsClasses[jsClass.name])
        {
            return;
        }

        var visible = visibleJsdoc(jsClass);

        jsClasses[jsClass.name] = visible;

        (visible.members || []).forEach(function (member)
        {
            documented[member.name] = true;
        });

        (visible.functions || []).forEach(function (fn)
        {
            documented[fn.name] = true;
        });
    });

    Object.keys(jsClasses).forEach(function (name)
    {
        var cls = declared.classes[name];

        if (cls)
        {
            compareClass(jsClasses[name], cls, declared.classes, documented);
        }
        else
        {
            report('missing-class', null, name, 'documented in JSDoc, not declared in TypeScript');
        }
    });

    declared.list.forEach(function (cls)
    {
        if (!jsClasses[cls.name])
        {
            report('undocumented-class', locOf(cls), cls.name, 'declared in TypeScript, not documented in JSDoc');
        }
    });

    checkUnderscoreNames(jsdoc);

    printReport(Object.keys(jsClasses).length, declared.list.length);
}

try
{
    main();
}
catch (err)
{
    console.error(err.message);
    process.exitCode = 1;
}
