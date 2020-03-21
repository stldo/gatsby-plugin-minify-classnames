const incstr = require('incstr')

const FIRST_CHAR_IS_LETTER = /^[A-Za-z]/
const HAS_A_LETTER = /[A-Za-z]/
const IDENTIFIER_MAP = new Map()

function getMinifiedIdentifier(
  fragments,
  dictionary = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ0123456789'
) {
  let minifiedIdentifier = ''
  let index = 0

  for (let fragment in fragments) {
    let fragmentMap = IDENTIFIER_MAP.get(fragment)

    if (!fragmentMap) {
      fragmentMap = new Map()
      fragmentMap.getMinifiedIdentifierFragment = incstr.idGenerator({
        alphabet: dictionary
      })
      IDENTIFIER_MAP.set(fragment, fragmentMap)
    }

    const identifierFragment = fragments[fragment]
    let minifiedIdentifierFragment = fragmentMap.get(identifierFragment)

    if (!minifiedIdentifierFragment) {
      do {
        minifiedIdentifierFragment = fragmentMap.getMinifiedIdentifierFragment()
      } while (!index && !FIRST_CHAR_IS_LETTER.test(minifiedIdentifierFragment))
      fragmentMap.set(identifierFragment, minifiedIdentifierFragment)
    }

    minifiedIdentifier += `_${minifiedIdentifierFragment}`
    index++
  }

  return minifiedIdentifier.slice(1)
}

exports.onCreateWebpackConfig = (
  { actions, getConfig, stage },
  { dictionary, enableOnDevelopment = false }
) => {
  if (!enableOnDevelopment && stage.startsWith(`develop`)) {
    return
  } else if (dictionary && !HAS_A_LETTER.test(dictionary)) {
    throw new Error(`'dictionary' must have at least one letter`)
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
        if (!options || !options.localIdentName) continue
        options.getLocalIdent = (context, _, localName) => {
          const path = context.resourcePath
          return getMinifiedIdentifier({ path, localName }, dictionary)
        }
      }
    }
  }

  actions.replaceWebpackConfig(config)
}
