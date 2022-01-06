const { countries } = require('country-flag-icons')
const fs = require('fs')
const { fromPairs, map, pipe, prop, __ } = require('ramda')

const russianNames = new Intl.DisplayNames(['ru'], { type: 'region' })

const ruToCode = pipe(
  map((code) => [russianNames.of(code), code]),
  fromPairs,
)(countries)

const codeToRu = pipe(
  map((code) => [code, russianNames.of(code)]),
  fromPairs,
)(countries)

const ruOrderedCodes = Object.keys(ruToCode).sort().map(prop(__, ruToCode))

const generatedDir = './assets/generated'
if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir)
}

fs.writeFileSync(
  `${generatedDir}/ruCountryCodes.json`,
  JSON.stringify(ruOrderedCodes),
  'utf-8',
)

fs.writeFileSync(
  `${generatedDir}/ruToCode.json`,
  JSON.stringify(ruToCode),
  'utf-8',
)

fs.writeFileSync(
  `${generatedDir}/codeToRu.json`,
  JSON.stringify(codeToRu),
  'utf-8',
)
