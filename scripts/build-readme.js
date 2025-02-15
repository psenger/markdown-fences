#!/usr/bin/env node

const { join } = require('path')
const { generateMarkDownFile } = require('../dist/index')
const toc = require('markdown-toc')
const { writeFileSync, readFileSync } = require('fs')

const run = async () => {
  await generateMarkDownFile(
    join(__dirname, '..', '.README.md'),
    join(__dirname, '..', 'README.md'),
    join(__dirname, '..'),
    [join(__dirname, '..', 'src', 'index.js')]
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
