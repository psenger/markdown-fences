import path from 'path';
import fs from 'fs';
import toc from 'markdown-toc';
import jsdoc2md from 'jsdoc-to-markdown';

const fsp = fs.promises;

/**
 * @module @psenger/markdown-fences
 */

/**
 * Read the file contents of a Markdown file into a string
 *
 * @param {String} file - The fully qualified input file refer to `path.join` and `__dirname`
 * @return {Promise<string>}
 */
const readContents = async (file) => fsp.readFile(file, { encoding: 'utf8', flag: 'r' });

/**
 * Write the given contents ( Markdown as a string ) to the given file.
 *
 * @param {String} file - The fully qualified output file refer to `path.join` and `__dirname`
 * @param {String} content - the content to write to the file.
 * @param {Object} [options={encoding:'utf-8'}] - optional options passed to `fs#writeFile`
 * @return {Promise<void>}
 */
const writeContents = async (file, content, options = { encoding: 'utf-8' }) => fsp.writeFile(file, content, options);

/**
 * Insert JavaScript Documentation into these fences.
 *
 * Warning: this code uses an old version of {@link https://github.com/jsdoc/jsdoc|jsdoc} throw
 * several other APIS. And it will not support any
 *
 * @param {String} markdownContent - The WHOLE read me file, or file that has the TOC Fence in it.
 * @param {String[]} files - Any array of fully qualified source files and may include ** globs
 * @param [jsDocOptions] - Optional options passed to jsdoc-to-markdown render command see {@link https://github.com/jsdoc2md/jsdoc-to-markdown/blob/master/docs/API.md|jsdoc-to-markdown}
 * @param [jsDocOptions.heading-depth] - The initial heading depth, default 2. For example, with a value of 2 the top-level markdown headings look like "## The heading".
 * @param [jsDocOptions.module-index-format] - default `table`, options are: `none`, `grouped`, `table`, or `dl`
 * @param [jsDocOptions.global-index-format] -  default `table`, options are: `none`, `grouped`, `table`, or `dl`
 * @param [jsDocOptions.property-list-format] -  default `table`, options are: `list`, or `table`
 * @param [jsDocOptions.member-index-format] -  default `grouped`, options are: `grouped`, or `list`
 * @return {Promise<String>} - The processed content.
 * @example
 * File must have these meta Tags to insert the javascript docs in markdown format
 *   <!--START_SECTION:jsdoc-->
 *   <!--END_SECTION:jsdoc-->
 */
const injectJsDoc = async (markdownContent, files, jsDocOptions) => {
  const START_COMMENT_FENCE = '<!--START_SECTION:jsdoc-->';
  const END_COMMENT_FENCE = '<!--END_SECTION:jsdoc-->';
  const listRegExp = new RegExp(
    `${START_COMMENT_FENCE}[\\s\\S]+${END_COMMENT_FENCE}`
  );
  const defaultConfig = {
    'heading-depth': 2,
    'module-index-format': 'table',
    'global-index-format': 'table',
    'property-list-format': 'table',
    'member-index-format': 'grouped'
  };
  const docs = await jsdoc2md.render({
    ...defaultConfig,
    ...jsDocOptions,
    files
  });
  return markdownContent.replace(listRegExp, START_COMMENT_FENCE + '\n' + '## API\n\n' + docs + '\n' + END_COMMENT_FENCE)
};

/**
 * Inject a file into the meta tag location.
 *
 * @param {String} markdownContent - The whole markdown content of a file, that has the TOC Fence in it.
 * @param {String} baseDir - The base directory for all the fenced files.
 * @param {Object} [options={log:false,baseDir: null}] - An option
 * @param {Boolean} [options.log=false] - Log flag
 * @return {Promise<String>} - The processed content.
 * @example
 * File must have these meta Tags to insert the `tutorial.md` file.
 *   <!--START_SECTION:tutorial.md-->
 *   <!--END_SECTION:tutorial.md-->
 */
const injectFileFencePosts = async (markdownContent, baseDir, options = { log: false }) => {
  options.log = options.log || false;
  const logFileName = ({ log }) => function logFileName (fileName) {
    if (log) console.log('File name = ', fileName);
    return fileName
  };
  const START_LOAD_FILE_FENCE = (file = '(.*)') => `<!--START_SECTION:file:${file}-->`;
  const END_LOAD_FILE_FENCE = (file = '(.*)') => `<!--END_SECTION:file:${file}-->`;
  const loadFileRegExp = new RegExp(START_LOAD_FILE_FENCE(), 'g');
  const fileFencePostsRegExp = (file) => {
    return new RegExp(`${START_LOAD_FILE_FENCE(file)}[\\s\\S]+${END_LOAD_FILE_FENCE(file)}`)
  };
  const pathBuilder = (file) => path.join(baseDir, file);
  const files = [...markdownContent.matchAll(loadFileRegExp)]
    .reduce((acc, [, file]) => {
      acc.push(file);
      return acc
    }, [])
    .map(logFileName(options));
  const contentMap = await Promise.all(files.map(async (file) => {
    const fileName = pathBuilder(file);
    let content = '';
    try {
      content = await readContents(fileName);
    } catch (e) {
      if (e.message) {
        console.error(e.message);
      } else {
        console.error(e);
      }
    }
    return { file, content }
  }));
  const printContent = (content) => content !== '' ? `\n${content}\n` : '\n';
  return contentMap.reduce(
    (acc, { file, content }) =>
      acc.replace(
        fileFencePostsRegExp(file),
        START_LOAD_FILE_FENCE(file) +
        printContent(content) +
        END_LOAD_FILE_FENCE(file)
      ),
    markdownContent
  )
};

/**
 * Inject a file into the code fence section location with optional language highlighting.
 *
 * @param {String} markdownContent - The whole markdown content of a file, that has the Code Fence in it.
 * @param {String} baseDir - The base directory for all the fenced files.
 * @param {Object} [options={log:false}] - An option
 * @param {Boolean} [options.log=false] - Log flag
 * @return {Promise<String>} - The processed content.
 * @example
 * File must have these meta Tags to insert the file with optional language:
 *   <!--START_CODE_FENCE_SECTION:javascript:file:example.js-->
 *   <!--END_CODE_FENCE_SECTION:javascript:file:example.js-->
 *
 *   Or without language:
 *   <!--START_CODE_FENCE_SECTION:file:example.txt-->
 *   <!--END_CODE_FENCE_SECTION:file:example.txt-->
 */
const injectCodeFencePosts = async (markdownContent, baseDir, options = { log: false }) => {
  options.log = options.log || false;

  const logFileName = ({ log }) => function logFileName (fileName) {
    if (log) console.log('File name = ', fileName);
    return fileName
  };

  const START_CODE_FENCE_SECTION = (lang = '', file = '(.*)') => lang ? `<!--START_CODE_FENCE_SECTION:${lang}:file:${file}-->` : `<!--START_CODE_FENCE_SECTION:file:${file}-->`;

  const END_CODE_FENCE_SECTION = (lang = '', file = '(.*)') => lang ? `<!--END_CODE_FENCE_SECTION:${lang}:file:${file}-->` : `<!--END_CODE_FENCE_SECTION:file:${file}-->`;

  const loadFileRegExp = /<!--START_CODE_FENCE_SECTION:(?:([^:]+):)?file:([^>]+?)-->/g;

  const codeFencePostsRegExp = (lang, file) => {
    const pattern = lang
      ? `<!--START_CODE_FENCE_SECTION:${lang}:file:${file}-->[\\s\\S]+<!--END_CODE_FENCE_SECTION:${lang}:file:${file}-->`
      : `<!--START_CODE_FENCE_SECTION:file:${file}-->[\\s\\S]+<!--END_CODE_FENCE_SECTION:file:${file}-->`;
    return new RegExp(pattern)
  };

  const pathBuilder = (file) => path.join(baseDir, file);

  const files = [...markdownContent.matchAll(loadFileRegExp)]
    .reduce((acc, [, lang, file]) => {
      acc.push({ lang: lang || '', file });
      return acc
    }, [])
    .map(logFileName(options));

  const contentMap = await Promise.all(files.map(async ({ lang, file }) => {
    const fileName = pathBuilder(file);
    let content = '';
    try {
      content = await readContents(fileName);
    } catch (e) {
      if (e.message) {
        console.error(e.message);
      } else {
        console.error(e);
      }
    }
    return { lang, file, content }
  }));

  const printContent = ({
    lang,
    content
  }) => content !== '' ? `\n\`\`\`${lang || ''}\n${content}\n\`\`\`\n` : '\n';

  return contentMap.reduce(
    (acc, { lang, file, content }) =>
      acc.replace(
        codeFencePostsRegExp(lang, file),
        START_CODE_FENCE_SECTION(lang, file) +
        printContent({ lang, content }) +
        END_CODE_FENCE_SECTION(lang, file)
      ),
    markdownContent
  )
};

/**
 * Inject a Table of Contents
 *
 * @param {String} markdownContent - The whole markdown file, or file that has the TOC Fence in it.
 * @return {Promise<String>} - The processed content.
 * @example
 * File must have these meta Tags to locate the TOC.
 *   <!--START_SECTION:toc-->
 *   <!--END_SECTION:toc-->
 */
const injectToc = async (markdownContent) => {
  const { content } = toc(markdownContent, {});
  const START_COMMENT_FENCE = '<!--START_SECTION:toc-->';
  const END_COMMENT_FENCE = '<!--END_SECTION:toc-->';
  const listRegExp = new RegExp(
    `${START_COMMENT_FENCE}[\\s\\S]+${END_COMMENT_FENCE}`
  );
  return markdownContent.replace(listRegExp, START_COMMENT_FENCE + '\n\n## Table of contents\n' + content + '\n\n' + END_COMMENT_FENCE)
};

const compose = (...fns) => args => fns.reduce((p, f) => p.then(f), Promise.resolve(args));

/**
 * Generate a Markdown File, processing all the fences.
 * @tutorial basic usage
 * @param {String} markdownFile - The file name of the base file with the fences in it.
 * @param {String} [newMarkdownFile] - The file name of the output file
 * @param {String} baseDir - The directory path that all inserted files can be found
 * @param {String[]} indexes - The JavaScript files to build the JS Doc from.
 * @param {Object} [options] - Options.
 * @return {Promise<void>}
 */
const generateMarkDownFile = async (markdownFile, newMarkdownFile, baseDir, indexes, options) => {
  const closureInjectFileFencePosts = (baseDir, options) => async (markdownContent) => injectFileFencePosts(markdownContent, baseDir, options);
  const closureInjectCodeFencePosts = (baseDir, options) => async (markdownContent) => injectCodeFencePosts(markdownContent, baseDir, options);
  const closureInjectJsDoc = (indexes, options) => async (markdownContent) => injectJsDoc(markdownContent, indexes, options);
  const closureWriteContents = (outFile) => async (markdownContent) => writeContents(outFile, markdownContent);
  return await compose(
    readContents,
    closureInjectJsDoc(indexes, options),
    closureInjectFileFencePosts(baseDir, options),
    closureInjectCodeFencePosts(baseDir, options),
    injectToc,
    closureWriteContents(newMarkdownFile)
  )(markdownFile)
};
module.exports = {
  readContents,
  writeContents,
  injectJsDoc,
  injectFileFencePosts,
  injectCodeFencePosts,
  injectToc,
  generateMarkDownFile
};
//# sourceMappingURL=index.mjs.map
