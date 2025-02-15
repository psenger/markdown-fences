const fs = require('fs')
const {join} = require('path')
const { devDependencies, dependencies } = require('../package.json')
const checker = require('license-checker')

const thirdPartyNoticeFile = join(__dirname, '..', 'THIRD_PARTY_NOTICES.md')

/**
 * Sends a String of data to the Mac OSX Buffer, this is very helpful if
 * you are doing something in scratch pad and want to copy it somewhere.
 *
 * this beats Pipe-ing the output to pbcopy directly.
 *
 * @param {string} data - Required UTF-8 String to be copied to the buffer.
 *
 * @return {void}
 *
 * @example
 * pbcopy(JSON.stringify(data, null, 4))
 */
function pbcopy(data) {
  const proc = require('child_process').spawn('pbcopy', { env: { LC_CTYPE: 'UTF-8' } })
  proc.stdin.write(data)
  proc.stdin.end()
}

const devModulesDirectlyUsed = new Set([
  ...Object.keys(devDependencies)
])

const prodModulesDirectlyUsed = new Set([
  ...Object.keys(dependencies)
])

function findModules(dependenciesObj, devMod, prodMod) {
  const dependencies = { }
  const developmentDependencies = { }
  Object.entries(dependenciesObj).forEach(([key, value]) => {
    const moduleName = key.split('@')[0]
    if ( devMod.has(moduleName) ) {
      value.name = moduleName
      developmentDependencies[moduleName] = value
    }
  })
  Object.entries(dependenciesObj).forEach(([key, value]) => {
    const moduleName = key.split('@')[0]
    if ( prodMod.has(moduleName) ) {
      value.name = moduleName
      dependencies[moduleName] = value
    }
  })
  return {
    developmentDependencies: Object.values(developmentDependencies) || [],
    dependencies: Object.values(dependencies) || [],
  }
}
checker.init({
  start: join(__dirname, '..' ),
}, function(err, packages) {
  if (err) {
    console.error(err)
  } else {
    const results = findModules(
                                                    packages,
                                                    devModulesDirectlyUsed,
                                                    prodModulesDirectlyUsed)

    pbcopy(template(2,results))
    fs.writeFileSync(thirdPartyNoticeFile, template(1,results), {encoding: 'utf8'})
  }
});
const itemTemplate = ({name,repository,licenses}) =>`
- [${name}](${repository}) - ${licenses} License`
const template = (depth,{dependencies,developmentDependencies}) =>`
${'#'.repeat(depth)} Acknowledgments

This project directly uses the following open-source packages:

${'#'.repeat(depth)}# Dependencies
${dependencies.map(itemTemplate)}

${'#'.repeat(depth)}# Development Dependencies
${developmentDependencies.map(itemTemplate)}

`
