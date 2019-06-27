const incstr = require('incstr')

const identMap = new Map()

function localIdent (resources, separator) {
  let ident = ''

  for (let key in resources) {
    let mappedIdents = identMap.get(key)

    if (mappedIdents === undefined) {
      mappedIdents = new Map()
      mappedIdents.nextId = incstr.idGenerator({
        alphabet: 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ' +
          (identMap.size ? '0123456789' : '')
      })
      identMap.set(key, mappedIdents)
    }

    let mappedIdent = mappedIdents.get(resources[key])

    if (mappedIdent === undefined) {
      mappedIdent = mappedIdents.nextId()
      mappedIdents.set(resources[key], mappedIdent)
    }

    ident += `${separator}${mappedIdent}`
  }

  return ident.slice(separator.length)
}

exports.onCreateWebpackConfig = (
  { actions, stage, getConfig },
  { develop = false, separator = '_' }
) => {
  if (!develop && stage.startsWith(`develop`)) return

  const config = getConfig()
  const rules = config.module.rules.filter(({ oneOf }) =>
    oneOf &&
    Array.isArray(oneOf) &&
    oneOf.every(({ test }) =>
      '.css'.search(test) || '.sass'.search(test) || '.less'.search(test)
    )
  )

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
