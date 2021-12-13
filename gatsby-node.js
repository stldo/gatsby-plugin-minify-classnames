const getMinifiedIdent = require('./lib/get-minified-ident')

const LETTER = /[A-Za-z]/

exports.onCreateWebpackConfig = ({ actions, getConfig }, {
  dictionary = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ0123456789',
  enable = process.env.NODE_ENV === 'production',
  prefix = '',
  suffix = ''
}) => {
  if (!enable) {
    return
  } else if (!LETTER.test(dictionary)) {
    throw new Error('"dictionary" option must have at least one letter')
  }

  const config = getConfig()

  for (const { oneOf } of config.module.rules) {
    if (!oneOf?.length) {
      continue
    }

    for (const { use } of oneOf) {
      if (!use) {
        continue
      }

      for (const { loader, options } of use) {
        if (!loader?.includes('/css-loader/') || !options?.modules) {
          continue
        }

        const { localIdentName: _, ...modules } = options.modules

        modules.getLocalIdent = (context, _, localName) => {
          const identParts = { path: context.resourcePath, localName }
          const minifiedIdent = getMinifiedIdent(identParts, dictionary)
          return `${prefix}${minifiedIdent}${suffix}`
        }

        options.modules = modules
      }
    }
  }

  actions.replaceWebpackConfig(config)
}
