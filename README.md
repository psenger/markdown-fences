# markdown-fences

> Markdown-fences provides a set of utilities that create assist in workflow related to building
> Markdown files, injecting content, table of contents, javascript documentation with metadata tags.

Features include:

1. readContents - an async read file.
2. writeContents - an async write file.
3. injectJsDoc - builds Markdown JSDocs and injects them into Markdown contents
4. injectFileFencePosts - scans ( one pass ) a Markdown file and injects another content into
   the position
5. injectToc - Scans a markdown and injects a Table of contents.
6. injectCodeFencePosts - scans ( one pass ) a Markdown file and injects another content into
   the position surrounded with GitHub Language highlighting.

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation Instructions](#installation-instructions)
- [API](#api)
  * [readContents](#readcontents)
    + [Parameters](#parameters)
  * [writeContents](#writecontents)
    + [Parameters](#parameters-1)
  * [injectJsDoc](#injectjsdoc)
    + [Parameters](#parameters-2)
    + [Examples](#examples)
  * [injectFileFencePosts](#injectfilefenceposts)
    + [Parameters](#parameters-3)
    + [Examples](#examples-1)
  * [injectCodeFencePosts](#injectcodefenceposts)
    + [Parameters](#parameters-4)
    + [Examples](#examples-2)
  * [injectToc](#injecttoc)
    + [Parameters](#parameters-5)
    + [Examples](#examples-3)
  * [generateMarkDownFile](#generatemarkdownfile)
    + [Parameters](#parameters-6)
- [Contributing](#contributing)
  * [Rules](#rules)
- [Deployment Steps](#deployment-steps)
- [License](#license)
- [This product uses the following Open Source libraries and is subject to their License](#this-product-uses-the-following-open-source-libraries-and-is-subject-to-their-license)
- [Acknowledgments](#acknowledgments)
  * [Dependencies](#dependencies)
  * [Development Dependencies](#development-dependencies)

## Installation Instructions

```bash
npm install @psenger/markdown-fences --save
```

or

```bash
yarn add @psenger/markdown-fences
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### readContents

Read the file contents of a Markdown file into a string

#### Parameters

*   `file` **[String][1]** The fully qualified input file refer to `path.join` and `__dirname`

Returns **[Promise][2]<[string][1]>**

### writeContents

Write the given contents ( Markdown as a string ) to the given file.

#### Parameters

*   `file` **[String][1]** The fully qualified output file refer to `path.join` and `__dirname`
*   `content` **[String][1]** the content to write to the file.
*   `options` **[Object][3]** optional options passed to `fs#writeFile` (optional, default `{encoding:'utf-8'}`)

Returns **[Promise][2]\<void>**

### injectJsDoc

Insert JavaScript Documentation into these fences.

#### Parameters

*   `markdownContent` **[String][1]** The WHOLE read me file, or file that has the TOC Fence in it.
*   `indexes` **[Array][4]<[String][1]>** the fully qualified source files.

#### Examples

File must have these meta Tags to insert the `tutorial.md` file.

```javascript
<!--START_SECTION:jsdoc-->
<!--END_SECTION:jsdoc-->
```

Returns **[Promise][2]<[String][1]>** The processed content.

### injectFileFencePosts

Inject a file into the meta tag location.

#### Parameters

*   `markdownContent` **[String][1]** The whole markdown content of a file, that has the TOC Fence in it.
*   `baseDir` **[String][1]** The base directory for all the fenced files.
*   `options` **[Object][3]** An option (optional, default `{log:false,baseDir:null}`)

    *   `options.log` **[Boolean][5]** Log flag (optional, default `false`)

#### Examples

File must have these meta Tags to insert the `tutorial.md` file.

```javascript
<!--START_SECTION:tutorial.md-->
<!--END_SECTION:tutorial.md-->
```

Returns **[Promise][2]<[String][1]>** The processed content.

### injectCodeFencePosts

Inject a file into the code fence section location with optional language highlighting.

#### Parameters

*   `markdownContent` **[String][1]** The whole markdown content of a file, that has the Code Fence in it.
*   `baseDir` **[String][1]** The base directory for all the fenced files.
*   `options` **[Object][3]** An option (optional, default `{log:false}`)

    *   `options.log` **[Boolean][5]** Log flag (optional, default `false`)

#### Examples

File must have these meta Tags to insert the file with optional language:

```javascript
<!--START_CODE_FENCE_SECTION:javascript:file:example.js-->
<!--END_CODE_FENCE_SECTION:javascript:file:example.js-->
```
Or without language:

```javascript
<!--START_CODE_FENCE_SECTION:file:example.txt-->
<!--END_CODE_FENCE_SECTION:file:example.txt-->
```

Returns **[Promise][2]<[String][1]>** The processed content.

### injectToc

Inject a Table of Contents

#### Parameters

*   `markdownContent` **[String][1]** The whole markdown file, or file that has the TOC Fence in it.

#### Examples

File must have these meta Tags to locate the TOC.

```javascript
<!--START_SECTION:toc-->
<!--END_SECTION:toc-->
```

Returns **[Promise][2]<[String][1]>** The processed content.

### generateMarkDownFile

Generate a Markdown File, processing all the fences.

#### Parameters

*   `markdownFile` **[String][1]** The file name of the base file with the fences in it.
*   `newMarkdownFile` **[String][1]?** The file name of the output file
*   `baseDir` **[String][1]** The directory path that all inserted files can be found
*   `indexes` **[Array][4]<[String][1]>** The JavaScript files to build the JS Doc from.
*   `options` **[Object][3]?** Options.

Returns **[Promise][2]\<void>**

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[4]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[5]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

## Contributing

Thanks for contributing! 😁 Here are some rules that will make your change to
markdown-fences fruitful.

### Rules

* Raise a ticket to the feature or bug can be discussed
* Pull requests are welcome, but must be accompanied by a ticket approved by the repo owner
* You are expected to add a unit test or two to cover the proposed changes.
* Please run the tests and make sure tests are all passing before submitting your pull request
* Do as the Romans do and stick with existing whitespace and formatting conventions (i.e., tabs instead of spaces, etc)
  * we have provided the following: `.editorconfig` and `.eslintrc`
  * Don't tamper with or change `.editorconfig` and `.eslintrc`
* Please consider adding an example under examples/ that demonstrates any new functionality

## Deployment Steps

**NOTE** I tried to make a `.REDME.md` and build it with tags but there are so many tags within
the code it doesn't work very well. I think going forward I think we should make `README.md` to
make individual parts.

These are notes for deploying to NPM. I used `npmrc` to manage my NPM identities
(`npm i npmrc -g` to install ). Then I created a new profile called `public` with
(`npmrc -c public`) and then switch to it with `npmrc public`.

* create a pull request from `dev` to `main`
* check out `main`
* `npm version patch -m "message here" or minor`
* `npm publish --access public`
* Then switch to `dev` branch
* And then merge `main` into `dev` and push `dev` to origin

## License

MIT License

Copyright (c) 2021 Philip A Senger

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

This product uses the following Open Source libraries and is subject to their License
------

* [documentation.js - ICS](https://github.com/documentationjs/documentation/blob/master/LICENSE)
* [markdown-toc - MIT](https://github.com/jonschlinkert/markdown-toc/blob/master/LICENSE)

## Acknowledgments

This project directly uses the following open-source packages:

### Dependencies

- [documentation](https://github.com/documentationjs/documentation) - ISC License,
- [markdown-toc](https://github.com/jonschlinkert/markdown-toc) - MIT License

### Development Dependencies

- [auto-changelog](https://github.com/CookPete/auto-changelog) - MIT License,
- [codecov](https://github.com/codecov/codecov-node) - MIT License,
- [eslint](https://github.com/eslint/eslint) - MIT License,
- [jest](https://github.com/jestjs/jest) - MIT License,
- [license-checker](https://github.com/davglass/license-checker) - BSD-3-Clause License,
- [rimraf](https://github.com/isaacs/rimraf) - ISC License,
- [rollup](https://github.com/rollup/rollup) - MIT License,
- [standard](https://github.com/standard/standard) - MIT License,
- [tmp](https://github.com/raszi/node-tmp) - MIT License

