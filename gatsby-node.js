const incstr = require('incstr')

const localIds = {}

function getCssRules (rules) {
  const expectedTests = [
    '/\\.module\\.css$/',
    '/\\.css$/',
    '/\\.module\\.s(a|c)ss$/',
    '/\\.s(a|c)ss$/'
  ]

  return rules.filter(({ oneOf }) =>
    oneOf &&
    Array.isArray(oneOf) &&
    oneOf.every(({ test }) => expectedTests.includes(String(test)))
  )
}

function localIdent (resources, separator) {
  let localIdentName = ''

  for (let key in resources) {
    if (!localIds[key]) {
      localIds[key] = new Map()
      localIds[key].nextId = incstr.idGenerator({
        alphabet: 'bcdfghjklmnpqrstvwxyz'
      })
    }

    let localId = localIds[key].get(resources[key])

    if (localId === undefined) {
      localId = localIds[key].nextId()
      localIds[key].set(resources[key], localId)
    }

    localIdentName += `${separator}${localId}`
  }

  return localIdentName.slice(separator.length)
}

exports.onCreateWebpackConfig = (
  { actions, stage, getConfig },
  { develop = false, separator = '_' }
) => {
  if (!develop && stage.startsWith(`develop`)) return

  const config = getConfig()
  const rules = getCssRules(config.module.rules)

  for (let { oneOf } of rules) {
    for (let { use } of oneOf) {
      if (!use) continue
      for (let { options } of use) {
        if (!options || !options.localIdentName) continue
        options.getLocalIdent = (context, _, localName) => {
          const path = context.resourcePath
          return localIdent({ path, localName }, separator)
        }
      }
    }
  }

  actions.replaceWebpackConfig(config)
}
