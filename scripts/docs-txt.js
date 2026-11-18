/* eslint-env node */

/**
 * Write the full name of every class, function and member in out/docs.json to
 * out/docs.txt, one name per line, sorted and without duplicates.
 *
 * Classes are written as their name (e.g. Phaser.Sprite). Instance functions and
 * members are written as the class name, then '#', then the member name
 * (e.g. Phaser.Sprite#play). Static functions and members use '.' instead of '#'
 * (e.g. Phaser.Math.clamp). Inner functions and members are skipped.
 *
 * Requires out/docs.json, which is produced by the JSDoc JSON export.
 *
 * Usage: node scripts/docs-txt.js
 */
'use strict';

var fs = require('fs');
var path = require('path');

var root = path.resolve(__dirname, '..');
var inputFile = path.join(root, 'out', 'docs.json');
var outputFile = path.join(root, 'out', 'docs.txt');

var docs = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
var names = Object.create(null);

docs.classes.forEach(function (cls)
{
    names[cls.name] = true;

    [ cls.functions, cls.members ].forEach(function (items)
    {
        (items || []).forEach(function (item)
        {
            if (item.scope === 'inner')
            {
                return;
            }

            var separator = (item.scope === 'static') ? '.' : '#';

            names[cls.name + separator + item.name] = true;
        });
    });
});

var lines = Object.keys(names).sort();

fs.writeFileSync(outputFile, lines.join('\n') + '\n');

console.log('Wrote ' + lines.length + ' names to ' + path.relative(root, outputFile));
