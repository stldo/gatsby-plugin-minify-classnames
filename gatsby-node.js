const incstr = require('incstr')

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const LETTER = /[A-Za-z]/

const minifiedParts = new Map()

function minifyIdent (identParts, dictionary) {
  let ident = ''
  let isFirst = true

  for (const identPart in identParts) {
    let minifiedIdents = minifiedParts.get(identPart)

    if (!minifiedIdents) {
      minifiedIdents = new Map()
      minifiedIdents.nextId = incstr.idGenerator({ alphabet: dictionary })
      minifiedParts.set(identPart, minifiedIdents)
    }

    const sourceIdent = identParts[identPart]

    let minifiedIdent = minifiedIdents.get(sourceIdent)

    if (!minifiedIdent) {
      do {
        minifiedIdent = minifiedIdents.nextId()
        // eslint-disable-next-line no-unmodified-loop-condition
      } while (isFirst && !LETTER.test(minifiedIdent[0]))

      minifiedIdents.set(sourceIdent, minifiedIdent)
    }

    ident += `_${minifiedIdent}`
    isFirst = false
  }

  return ident.slice(1) // Ignore the first underscore
}

exports.onCreateWebpackConfig = ({ actions, getConfig }, {
  dictionary = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ0123456789',
  enable = IS_PRODUCTION,
  prefix = '',
  suffix = ''
}) => {
  if (!enable) {
    return
  } else if (!LETTER.test(dictionary)) {
    throw new Error('"dictionary" option must have at least one letter.')
  }

  const config = getConfig()

  for (const { oneOf } of config.module.rules) {
    if (!oneOf || !oneOf.length) {
      continue
    }

    for (const { use, test } of oneOf) {
      if (
        !test.test('.module.css') &&
        !test.test('.module.less') &&
        !test.test('.module.sass') &&
        !test.test('.module.styl')
      ) {
        continue
      }

      for (const { loader, options = {} } of use) {
        if (!loader.includes('/css-loader/') || !options.modules) {
          continue
        }

        const { localIdentName: _, ...modules } = options.modules

        modules.getLocalIdent = (context, _, localName) => {
          const identParts = { path: context.resourcePath, localName }
          const minifiedIdent = minifyIdent(identParts, dictionary)

          return `${prefix}${minifiedIdent}${suffix}`
        }

        options.modules = modules
      }
    }
  }

  actions.replaceWebpackConfig(config)
}
