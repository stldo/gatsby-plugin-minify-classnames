const incstr = require('incstr')

const STARTS_WITH_LETTER = /^[A-Za-z]/

const minifiedParts = new Map()

module.exports = function getMinifiedIdent (identParts, dictionary) {
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
      } while (isFirst && !STARTS_WITH_LETTER.test(minifiedIdent))

      minifiedIdents.set(sourceIdent, minifiedIdent)
    }

    ident += `_${minifiedIdent}`
    isFirst = false
  }

  return ident.slice(1) // Ignore the first underscore
}
