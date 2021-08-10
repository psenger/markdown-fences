const {join} = require('path');
const tmp = require('tmp');

const {
  readContents,
  writeContents,
  injectJsDoc,
  injectFileFencePosts,
  injectToc,
  generateMarkDownFile
} = require('./index');

const cp = ( src, dest ) => require("fs").copyFileSync(src, dest);
const rm = (src) => require('fs').unlinkSync(src);

describe('@pseger/markdown-fences', () => {
  describe('#readContents', () => {
    it('should fail when the required parameter is undefined', async () => {
      expect.assertions(1);
      return expect(()=>readContents()).rejects.toThrow();
    })
    it('should fail when the required parameter is null', async () => {
      expect.assertions(1);
      return expect(()=>readContents(null)).rejects.toThrow();
    })
    it('should fail when the required parameter is missing', async () => {
      expect.assertions(1);
      return expect(()=>readContents('booboo.mac.goo')).rejects.toThrow();
    })
    it('should read the file sample.md from the test harness directory', async () => {
      expect.assertions(1);
      const results = await readContents(join(__dirname,'__test_harness__','sample.md'));
      return expect(results).toMatchSnapshot();
    })
  })
  describe('#writeContents', () => {
    it('should fail when the required parameter is undefined', async () => {
      expect.assertions(1);
      return expect(()=>writeContents()).rejects.toThrow();
    })
    it('should fail when the required parameter is null', async () => {
      expect.assertions(1);
      return expect(()=>writeContents(null, null)).rejects.toThrow();
    })
    it('should just work reading and writting', async () => {
      expect.assertions(1);
      const tmpobj = tmp.fileSync();
      const file = tmpobj.name;
      await writeContents( file, 'hello')
      const results = await readContents(file);
      expect(results).toMatchInlineSnapshot('"hello"');
      tmpobj.removeCallback();
    })
  })
  describe('#injectJsDoc', ()=>{
    it('should skip the block',async ()=>{
      expect.assertions(1);
      const readMe = `# Start

<!--START_SECTION:deep1/deep2/insert.md-->
<!--END_SECTION:deep1/deep2/insert.md-->

## End`
      let results =  await injectJsDoc(readMe, [ join(__dirname,'__test_harness__','foo.js') ])
      expect(results).toMatchSnapshot();
    })
    it('replace the tags',async ()=>{
      expect.assertions(1);
      const readMe = `# Start

<!--START_SECTION:jsdoc-->
<!--END_SECTION:jsdoc-->

## End`
      let results =  await injectJsDoc(readMe, [ join(__dirname,'__test_harness__','foo.js') ])
      expect(results).toMatchSnapshot();
    })
  })
  describe('injectToc',() => {
    it('should skip the block',async ()=>{
      expect.assertions(1);
      const readMe = `# Start

<!--START_SECTION:blaablaa-->
<!--END_SECTION:blaablaa-->

## Level 2-A

### Level 3-A

### Level 3-B

### Level 3-C

## Level 2-B

### Level 3-A

#### Level 4-A

#### Level 4-B

### Level 3-C

## Level 2-C

`
      let results =  await injectToc(readMe)
      expect(results).toMatchSnapshot();
    })
    it('replace the tags',async ()=>{
      expect.assertions(1);
      const readMe = `# Start

<!--START_SECTION:toc-->
<!--END_SECTION:toc-->

## Level 2-A

### Level 3-A

### Level 3-B

### Level 3-C

## Level 2-B

### Level 3-A

#### Level 4-A

#### Level 4-B

### Level 3-C

## Level 2-C

`
      let results =  await injectToc(readMe)
      expect(results).toMatchSnapshot();
    })
  });
  describe('#injectFileFencePosts',()=>{
    it('Testing full directory',async () => {
      const buildDynamicReadMe = (file) => `# Start

<!--START_SECTION:file:${file}-->
<!--END_SECTION:file:${file}-->

## End
`
      const tmpobj = tmp.dirSync();
      const tempDirectoryAndFileLocation = join( tmpobj.name, 'sample.md');
      cp( join( __dirname,'__test_harness__','sample.md'), tempDirectoryAndFileLocation )
      const results = await injectFileFencePosts(buildDynamicReadMe('sample.md'), tmpobj.name, {log:false})
      expect(results).toMatchSnapshot();
      rm( tempDirectoryAndFileLocation )
      tmpobj.removeCallback();
    })
    it('Testing failed directory',async () => {
      const buildDynamicReadMe = (file) => `# Start

<!--START_SECTION:file:${file}-->
<!--END_SECTION:file:${file}-->

## End
`
      const tmpobj = tmp.dirSync();
      const results = await injectFileFencePosts(buildDynamicReadMe('sample.md'), tmpobj.name, {log:true})
      expect(results).toMatchSnapshot();
      tmpobj.removeCallback();
    })
  })
  describe('generateMarkDownFile',()=>{
    it('full integration test',async ()=>{
      const tmpobj = tmp.dirSync();
      await generateMarkDownFile(
        join( __dirname, '__test_harness__', 'generateMarkDownFile', '.README.md' ),
        join( tmpobj.name, 'README.md' ),
        join( __dirname, '__test_harness__', 'generateMarkDownFile' ),
        [ join( __dirname, '__test_harness__', 'foo.js') ]
      )
      const results = await readContents( join( tmpobj.name, 'README.md' ) );
      expect(results).toMatchSnapshot();
      rm( join( tmpobj.name, 'README.md' ) )
      tmpobj.removeCallback();
    })
  })
})
