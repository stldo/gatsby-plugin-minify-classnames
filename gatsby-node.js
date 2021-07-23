const incstr = require('incstr')

const HAS_A_LETTER = /[A-Za-z]/
const IDENT_MAP = new Map()
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const STARTS_WITH_LETTER = /^[A-Za-z]/

function minifyIdent(
  fragments,
  dictionary = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ0123456789'
) {
  let minifiedIdent = ''
  let isFirstFragment = true

  for (let fragmentName in fragments) {
    const fragment = fragments[fragmentName]

    let fragmentMap = IDENT_MAP.get(fragmentName)

    if (!fragmentMap) {
      fragmentMap = new Map()
      fragmentMap.getMinifiedFragment = incstr.idGenerator({
        alphabet: dictionary
      })
      IDENT_MAP.set(fragmentName, fragmentMap)
    }

    let minifiedFragment = fragmentMap.get(fragment)

    if (!minifiedFragment) {
      do {
        minifiedFragment = fragmentMap.getMinifiedFragment()
      } while (isFirstFragment && !STARTS_WITH_LETTER.test(minifiedFragment))
      fragmentMap.set(fragment, minifiedFragment)
    }

    minifiedIdent += `_${minifiedFragment}`
    isFirstFragment = false
  }

  return minifiedIdent.slice(1) // slice(1) removes the first underscore
}

exports.onCreateWebpackConfig = (
  { actions, getConfig },
  { dictionary, enable = IS_PRODUCTION, prefix = '', suffix = '' }
) => {
  if (!enable) {
    return
  } else if (dictionary && !HAS_A_LETTER.test(dictionary)) {
    throw new Error('"dictionary" option must have at least one letter.')
  }

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
        if (!options.modules || !options.modules.localIdentName) continue
        options.modules.getLocalIdent = (context, _, localName) => {
          const path = context.resourcePath
          const minifiedIdent = minifyIdent({ path, localName }, dictionary)
          return `${prefix}${minifiedIdent}${suffix}`
        }
      }
    }
  }

  actions.replaceWebpackConfig(config)
}
