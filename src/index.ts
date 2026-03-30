import data from '../data/eu-vat-rates-data.json'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** ISO 3166-1 alpha-2 codes for all European countries in the dataset (EU-27 + 17 non-EU). */
export type CountryCode =
  // EU-27
  | 'AT' | 'BE' | 'BG' | 'CY' | 'CZ' | 'DE' | 'DK' | 'EE'
  | 'ES' | 'FI' | 'FR' | 'GR' | 'HR' | 'HU' | 'IE' | 'IT'
  | 'LT' | 'LU' | 'LV' | 'MT' | 'NL' | 'PL' | 'PT' | 'RO'
  | 'SE' | 'SI' | 'SK'
  // Non-EU Europe
  | 'AD' | 'AL' | 'BA' | 'CH' | 'GB' | 'GE' | 'IS' | 'LI'
  | 'MC' | 'MD' | 'ME' | 'MK' | 'NO' | 'RS' | 'TR' | 'UA' | 'XK'

/** Non-EU European countries in the dataset. */
type NonEUCode = 'AD' | 'AL' | 'BA' | 'CH' | 'GB' | 'GE' | 'IS' | 'LI'
              | 'MC' | 'MD' | 'ME' | 'MK' | 'NO' | 'RS' | 'TR' | 'UA' | 'XK'

/** ISO 3166-1 alpha-2 codes for EU-27 member states only. */
export type EUMemberCode = Exclude<CountryCode, NonEUCode>

/** VAT rate data for a single country. */
export interface VatRate {
  /** Full country name. */
  country: string
  /** ISO 4217 currency code (EUR for eurozone members). */
  currency: string
  /** Whether the country is an EU member state. False for GB. */
  eu_member: boolean
  /** Official name of the VAT tax in the country's primary official language. */
  vat_name: string
  /** Short local abbreviation of the VAT tax (e.g. "ALV", "MwSt", "TVA"). */
  vat_abbr: string
  /** Standard VAT rate in percent (e.g. 20 for 20%). */
  standard: number
  /**
   * Reduced VAT rates in percent, sorted ascending.
   * May include rates for special territories (e.g. French DOM, Azores).
   * Empty array when the country applies no reduced rates (e.g. Denmark).
   */
  reduced: number[]
  /**
   * Super-reduced rate in percent, or null when not applicable.
   * Applied to a narrow set of essentials in some member states.
   */
  super_reduced: number | null
  /**
   * Parking rate in percent, or null when not applicable.
   * Transitional rate for goods taxed at reduced rates before 1991.
   */
  parking: number | null
  /** Human-readable format description (e.g. "ATU + 8 digits"). */
  format: string
  /** Regex pattern string for format validation (without slashes), or null for countries without a standardised format. */
  pattern: string | null
}

/** Shape of the bundled dataset JSON. */
export interface VatDataset {
  /** ISO 8601 date when the data was last fetched from EC TEDB. */
  version: string
  /** Human-readable source description. */
  source: string
  /** Map of country code → VAT rate data. */
  rates: Record<CountryCode, VatRate>
}

// ---------------------------------------------------------------------------
// Dataset
// ---------------------------------------------------------------------------

const dataset = data as VatDataset

/**
 * The full bundled dataset, including metadata.
 * Use this when you need the version date or source attribution.
 */
export { dataset }

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

/**
 * Returns the complete VAT rate record for a country, or `undefined` if the
 * country code is not in the dataset.
 *
 * @example
 * ```ts
 * const fi = getRate('FI')
 * // { country: 'Finland', currency: 'EUR', standard: 25.5, reduced: [10, 13.5], … }
 * ```
 */
export function getRate(code: CountryCode): VatRate
export function getRate(code: string): VatRate | undefined
export function getRate(code: string): VatRate | undefined {
  return dataset.rates[code as CountryCode]
}

/**
 * Returns the standard VAT rate (percent) for a country, or `undefined`.
 *
 * @example
 * ```ts
 * getStandardRate('DE') // 19
 * getStandardRate('FI') // 25.5
 * ```
 */
export function getStandardRate(code: CountryCode): number
export function getStandardRate(code: string): number | undefined
export function getStandardRate(code: string): number | undefined {
  return dataset.rates[code as CountryCode]?.standard
}

/**
 * Returns all VAT rate records as a plain object keyed by country code.
 *
 * @example
 * ```ts
 * const all = getAllRates()
 * Object.entries(all).forEach(([code, rate]) => {
 *   console.log(`${code}: ${rate.standard}%`)
 * })
 * ```
 */
export function getAllRates(): Record<CountryCode, VatRate> {
  return dataset.rates
}

/**
 * Returns `true` when the given string is an EU-27 member state code.
 * Returns `false` for GB and any unknown code.
 *
 * Acts as a TypeScript type guard narrowing `string` to `EUMemberCode`.
 *
 * @example
 * ```ts
 * isEUMember('DE') // true
 * isEUMember('GB') // false — not an EU member
 * isEUMember('US') // false
 * ```
 */
export function isEUMember(code: string): code is EUMemberCode {
  return dataset.rates[code as CountryCode]?.eu_member === true
}


/**
 * Returns `true` when the given string is a country code present in the
 * dataset (all 44 European countries).
 *
 * Acts as a TypeScript type guard narrowing `string` to `CountryCode`.
 * Use `isEUMember` instead to check EU membership specifically.
 *
 * @example
 * ```ts
 * isKnownCountry('NO') // true
 * isKnownCountry('US') // false
 * ```
 */
export function isKnownCountry(code: string): code is CountryCode {
  return Object.prototype.hasOwnProperty.call(dataset.rates, code)
}

/**
 * ISO 8601 date string indicating when the bundled data was last refreshed
 * from the European Commission TEDB.
 *
 * @example
 * ```ts
 * console.log(`Rates valid as of ${dataVersion}`)
 * ```
 */
export const dataVersion: string = dataset.version
