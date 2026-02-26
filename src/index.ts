import data from '../data/eu-vat-rates-data.json'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** ISO 3166-1 alpha-2 codes for EU-27 member states plus the United Kingdom. */
export type CountryCode =
  | 'AT' | 'BE' | 'BG' | 'CY' | 'CZ' | 'DE' | 'DK' | 'EE'
  | 'ES' | 'FI' | 'FR' | 'GB' | 'GR' | 'HR' | 'HU' | 'IE'
  | 'IT' | 'LT' | 'LU' | 'LV' | 'MT' | 'NL' | 'PL' | 'PT'
  | 'RO' | 'SE' | 'SI' | 'SK'

/** VAT rate data for a single country. */
export interface VatRate {
  /** Full country name. */
  country: string
  /** ISO 4217 currency code (EUR for eurozone members). */
  currency: string
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
}

/** Shape of the bundled dataset JSON. */
export interface VatDataset {
  /** ISO 8601 date when the data was last fetched from EC TEDB. */
  version: string
  /** Human-readable source description. */
  source: string
  /** URL of the upstream data source. */
  url: string
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
 * Returns `true` when the given string is a country code present in the
 * dataset (EU-27 + GB).
 *
 * Acts as a TypeScript type guard narrowing `string` to `CountryCode`.
 *
 * @example
 * ```ts
 * isEUMember('DE') // true
 * isEUMember('US') // false
 * ```
 */
export function isEUMember(code: string): code is CountryCode {
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
