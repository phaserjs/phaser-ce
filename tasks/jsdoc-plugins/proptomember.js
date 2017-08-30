/**
* Transform @property tags to @member tags if it looks like @property was incorrectly used.
* - That is, there is only one property and it has the same name as the member.
* The result is less-redundancy and better type exposure in the JSDoc output.
*
* If the member type is not assigned then the property type is used.
*
* A meld of the description are used; appending the property description if appropriate.
*
* This approach works for most cases in Phaser because JSDoc automatically determines the name if not specified in @name, @method, @member or @field.
*/

var path = require('path');

function looksLikeItMightContain (haystack, needle) {

    haystack = haystack || '';
    needle = needle || '';

    haystack = haystack.replace(/[^a-z]/gi, '').toLowerCase();
    needle = needle.replace(/[^a-z]/gi, '').toLowerCase();

    return haystack.indexOf(needle) > -1;

}

exports.handlers = {};
exports.handlers.newDoclet = function (e) {

    var doclet = e.doclet;
    var props = e.doclet.properties;

    if (doclet.kind === 'member' &&
        props && props.length === 1 &&
        props[0].name === doclet.name)
    {
        // "Duplicate"
        var prop = props[0];

        // Common!
        // console.log('Duplicate? %s', prop.name);
        //
        var name = doclet.longname || doclet.name;

        if (!doclet.type)
        {
            console.log('[%s] Copying type from @property', name);
            doclet.type = prop.type;
        }

        if (!doclet.description)
        {
            console.log('[%s] Copying description from @property (%s)', name);
            doclet.description = prop.description;
        }
        else if (prop.description && !looksLikeItMightContain(doclet.description, prop.description))
        {
            // Tack it on..
            console.log('[%s] Appending description from @property (%s)', name);
            doclet.description += " " + prop.description;
        }

        // And no more prop
        e.doclet.properties = null;
    }

};
