# Tomorrow

A modified [DocStrap](https://github.com/docstrap/docstrap) template for [JSDoc3](http://usejsdoc.org/).

## Command Line Example

```bash
jsdoc -c path/to/config.json -t path/to/tomorrow/template -R README.md -r .
```

- `-c` config file
- `-t` template directory
- `-R` README page
- `-r` recursive
- `.` target (current directory)

## Configuring the template

A [JSDoc configuration file](http://usejsdoc.org/about-configuring-jsdoc.html) with some [extra options](https://github.com/docstrap/docstrap#configuring-the-template).

Likely defaults:

```json
{
	"opts": {
		"debug"                 : false,
	},
	"templates": {
		"analytics"             : {
			"ua"                  : "",
			"domain"              : ""
		},
		"collapseSymbols"       : false,
		"copyright"             : "",
		"dateFormat"            : "",
		"footer"                : "",
		"includeDate"           : true,
		"inverseNav"            : false,
		"linenums"              : false,
		"navType"               : "vertical",
		"outputSourceFiles"     : true,
		"outputSourcePath"      : true,
		"search"                : false,
		"sort"                  : null,
		"systemName"            : "Documentation",
		"theme"                 : "phaser"
	}
}
```

## Syntax Highlighting

* bash
* CSS
* HTML/XML
* JavaScript
* JSON

## Customizing

```bash
bower install
npm install

# List tasks
grunt --help

# Watch and build CSS & JS
grunt watch

# Build CSS from LESS
grunt less

# Build bundle.js
grunt concat

# Build bundle.min.js
grunt uglify

# Build themes/phaser/…
grunt examples
```

### Contributors

*Huge* thanks to all contributors. If your name should be here, but isn't, please let us know

* [samme](https://github.com/samme)
* [marklagendijk](https://github.com/marklagendijk)
* [michaelward82](https://github.com/michaelward82)
* [kaustavdm](https://github.com/kaustavdm)
* [vmeurisse](https://github.com/vmeurisse)
* [bmathern](https://github.com/bmathern)
* [jrkim123us](https://github.com/jrkim123us)
* [shawke](https://github.com/shawke)
* [mar10](https://github.com/mar10)
* [mwcz](https://github.com/mwcz)
* [pocesar](https://github.com/pocesar)
* [hyperandroid](https://github.com/hyperandroid)
* [vmadman](https://github.com/vmadman)
* [whitelynx](https://github.com/whitelynx)
* [tswaters](https://github.com/tswaters)
* [lukeapage](https://github.com/lukeapage)
* [rcosnita](https://github.com/rcosnita)

# History

## 2.0.0

- Many changes

## 1.3.0

- Update dependencies and update CSS
- Fixed TOC labels for members
- Apply code highlighting to code blocks in markdown
- Added an option to disable search

## 1.2.1

- Update lunr dependency used for searching

## 1.2.0

- Add square brackets around optional parameters
- new option disablePackagePath option which if true makes docstrap not append the package and version to the out path
- allow version to be missing in package.json

## 1.1.4

- Remove the unreadable orange on pre/code tags and use a dark red. Remove white background as is readable on black or white.

## 1.1.3

- Get sort option from navOptions as per docs
- tweaks from bootswatch

## 1.1.2

- Allow example captions to contain markdown if configured in the markdown config `includeTags` section.
- Fixes full path used as source URL for projects with one source file
- Allow users to update the default template layout file

## 1.1.1

- Bootswatch update
- Add viewport meta tag to html for better mobile experience

## 1.1.0

- Added includeDate option

## 1.0.5

- Navigation to anchor links now works in IE (with some flicker)
- links to other pages now work (with some flicker in some browsers)

## 1.0.4

- Search results no longer erroneously included in side navbar
- Tutorials now get page titles consistent with everything else
- Improvements to the highlighted nav heading

## 1.0.3

- Drop-down shows a scrollbar when too big (regression in 1.0.1)

## 1.0.2

- Support older jsdoc by not looking in "interfaces"

## 1.0.1

- Tweak side nav and dropdowns to be the bootswatch style
- Make the documentation responsive

## 1.0.0

- Bump to follow semver (initial development is well and truly over)
- Corrected list of themes
- Added Search
- Remove highlightTutorialCode option - it didnt work

## 0.5.4

- Fix layout glitch on hte bottom of code samples
- Support for specifying the language for fenced code blocks in the normal way
- Fix the active item in some themes, which was missing a background
- Tables get marked as tables
- Dependency updates

## 0.5.3

- Removed duplicate headers
- Remove "Index" header
- re-fixed navigation
- removed some dubious features (now pr's that can be re-added with a little polishing)

## 0.5.2

- Major update. Amazing help from [tswaters](https://github.com/tswaters) to solve a bunch of little problems and a to bring the codebase up to Bootstrap3. Make sure you are running the latest version of JSDoc before using this build. Again huge, huge thanks to [tswaters](https://github.com/tswaters). Make sure you send him thanks or a tip!!!!!

##  0.4.15

- PR Issue #76
- PR Issue #77

##  0.4.14

- Issue #69

##  0.4.13

- Issue #68

##  0.4.11

- Pull Request #59

##  0.4.8

- Issue #58

##  0.4.7

- Issue #57

##  0.4.5

- Issue #55
- Issue #54
- Issue #52
- Issue #51
- Issue #50
- Issue #45
- Issue #44

##  0.4.3

- Issue #46
- Issue #46
- Issue #47

##  0.4.1-1

- Issue #44
- Update documentation
- Issue #43
- Issue #42
- Issue #34

##  0.4.0

- Issue #41
- Issue #40
- Issue #39
- Issue #36
- Issue #32

##  0.3.0

- Fixed navigation at page top
- Adds -d switch to example jsdoc command.
- Fixed typo in readme
- Improve search box positioning and styles
- Add dynamic quick search in TOC
- Fix for line numbers styling issue

##  0.2.0

- Added jump to source linenumers - still a problem scrolling with fixed header
- changed syntax highlighter to [sunlight](http://sunlightjs.com/)
- Modify incoming bootswatch files to make font calls without protocol.

##  0.1.0

- Initial release

# Notices

If you like DocStrap, be sure and check out these excellent projects and support them!

- [JSDoc3 is licensed under the Apache License](https://github.com/jsdoc3/jsdoc/blob/master/LICENSE.md)
- [So is Bootstrap](https://github.com/twitter/bootstrap/blob/master/LICENSE)
- [And Bootswatch](https://github.com/thomaspark/bootswatch/blob/gh-pages/LICENSE)
- [TOC is licensed under MIT](https://github.com/jgallen23/toc/blob/master/LICENSE)
- [Grunt is also MIT](https://github.com/gruntjs/grunt-cli/blob/master/LICENSE-MIT)
- DocStrap [is licensed under the MIT license.](https://github.com/docstrap/docstrap/blob/master/LICENSE.md)
- [Sunlight uses the WTFPL](http://sunlightjs.com/)

# License

DocStrap Copyright (c) 2012-2015 Terry Weiss & Contributors. All rights reserved.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
