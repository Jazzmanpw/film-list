export type CountryData = { name: string; code: string | undefined }
export type CountryDataWithCode = CountryData & { code: string }

const fromName =
  (codeMap: Record<string, string>, synonyms?: Record<string, string>) =>
  (name: string): CountryData => {
    return synonyms?.[name]
      ? { name: synonyms[name], code: codeMap[synonyms[name]] }
      : { name, code: codeMap[name] }
  }

const fromCode =
  (nameMap: Record<string, string>) =>
  (code: string): CountryDataWithCode => ({
    name: nameMap[code],
    code,
  })

const hasCode = (country: CountryData): country is CountryDataWithCode =>
  !!country.code

export default {
  fromCode,
  fromName,
  hasCode,
}
