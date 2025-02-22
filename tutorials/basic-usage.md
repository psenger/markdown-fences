
The general idea, of this module is to create a Workflow script that will build your documentation.

```javascript
const { join } = require('path')
const { generateMarkDownFile } = require('@psenger/markdown-fences')
const toc = require('markdown-toc')
const { writeFileSync, readFileSync } = require('fs')

const run = async () => {

  await generateMarkDownFile(
    join(__dirname, '..', '.README.md'),
    join(__dirname, '..', 'README.md'),
    join(__dirname, '..'),
    [join(__dirname, '..', 'src', '*.js')],
    {
      'heading-depth': 3
    }
  )
  let markdown = await readFileSync(join(__dirname, '..', 'README.md'))
  markdown = toc.insert(markdown.toString())
  await writeFileSync(
    join(__dirname, '..', 'README.md'),
    markdown,
    'utf8'
  )
}

run()
  .then(() => {
    process.exit(0)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

```
