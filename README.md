# eu-vat-rates-data

[![npm version](https://img.shields.io/npm/v/eu-vat-rates-data)](https://www.npmjs.com/package/eu-vat-rates-data)
[![npm downloads](https://img.shields.io/npm/dw/eu-vat-rates-data)](https://www.npmjs.com/package/eu-vat-rates-data)
[![Test](https://github.com/vatnode/eu-vat-rates-data-js/actions/workflows/test.yml/badge.svg)](https://github.com/vatnode/eu-vat-rates-data-js/actions/workflows/test.yml)
[![Last updated](https://img.shields.io/github/last-commit/vatnode/eu-vat-rates-data-js?path=data%2Feu-vat-rates-data.json&label=last%20updated)](https://github.com/vatnode/eu-vat-rates-data-js/commits/main/data/eu-vat-rates-data.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

VAT rates for **45 European countries** — all EU-27 member states plus Norway, Switzerland, the United Kingdom, and more. EU rates sourced from the European Commission TEDB and checked daily. Published automatically when rates change.

Part of **[VATNode VAT Rates](https://vatnode.dev/vat-rates)** · [canonical dataset](https://github.com/vatnode/eu-vat-rates-data) · [methodology](https://vatnode.dev/data) · other languages: [Python](https://github.com/vatnode/eu-vat-rates-data-python), [PHP](https://github.com/vatnode/eu-vat-rates-data-php), [Go](https://github.com/vatnode/eu-vat-rates-data-go), [Ruby](https://github.com/vatnode/eu-vat-rates-data-ruby)

- Standard, reduced, super-reduced, and parking rates
- `eu_member` flag on every country — `true` for EU-27, `false` for non-EU
- `vat_name` — official name of the VAT tax in the country's primary official language
- `vat_abbr` — short abbreviation used locally (e.g. "ALV", "MwSt", "TVA")
- **`format` — human-readable VAT number format (e.g. `"ATU + 8 digits"`)** — unique to this package
- **`pattern` — regex for VAT number validation + built-in `validateFormat()` — free, no API key needed** — unique to this package
- TypeScript types included — works in Node.js and the browser
- JSON file committed to git — full rate-change history via `git log`
- Checked daily via GitHub Actions, new npm version published only when rates change

**Available in 5 ecosystems:**

| Language | Package | Install |
|---|---|---|
| JavaScript / TypeScript | [npm](https://www.npmjs.com/package/eu-vat-rates-data) | `npm install eu-vat-rates-data` |
| Python | [PyPI](https://pypi.org/project/eu-vat-rates-data/) | `pip install eu-vat-rates-data` |
| PHP | [Packagist](https://packagist.org/packages/vatnode/eu-vat-rates-data) | `composer require vatnode/eu-vat-rates-data` |
| Go | [pkg.go.dev](https://pkg.go.dev/github.com/vatnode/eu-vat-rates-data-go) | `go get github.com/vatnode/eu-vat-rates-data-go` |
| Ruby | [RubyGems](https://rubygems.org/gems/eu_vat_rates_data) | `gem install eu_vat_rates_data` |

---

## Why eu-vat-rates-data?

Unlike hand-maintained constants, the EU-27 data is checked daily against an official source. Unlike a runtime tax API, the package works offline and remains reproducible when its version is pinned. It includes multiple rate types, TypeScript declarations, VAT-number format metadata, and standard-rate history through the canonical dataset.

---

## Need live VIES validation?

This package gives you VAT **rates** and **format checks** for free, offline, in your code. It does **not** call VIES — `validateFormat()` only checks the shape of a VAT number, not whether it actually exists.

For **live VIES validation** — confirming a VAT ID is real, pulling the registered company name and address, and getting the VIES consultation number as your reference for the check — there's **[vatnode](https://vatnode.dev?ref=rates-readme-js)**:

- Live VIES validation, with national-database fallback when VIES is down
- Registered company name, address, registration date
- VIES consultation number for compliance and audit trails
- Webhooks for VAT status changes
- Official [MCP server](https://www.npmjs.com/package/vatnode-mcp) so AI agents (Claude, Cursor, ChatGPT) can validate VAT IDs directly
- Free tier — no credit card needed

```bash
curl https://api.vatnode.dev/v1/vat/IE6388047V \
  -H "Authorization: Bearer YOUR_API_KEY"
```

[**See what the API adds →**](https://vatnode.dev/vat-rates?ref=rates-readme-js#beyond-rates) · [Get a free API key](https://vatnode.dev/login?ref=rates-readme-js)

---

## Installation

```bash
npm install eu-vat-rates-data
# or
yarn add eu-vat-rates-data
# or
pnpm add eu-vat-rates-data
```

---

## Usage

### TypeScript / ESM

```ts
import { getRate, getStandardRate, getAllRates, isEUMember, isKnownCountry, dataVersion } from 'eu-vat-rates-data'

// Full rate object for a country
const fi = getRate('FI')
// {
//   country: 'Finland',
//   currency: 'EUR',
//   eu_member: true,
//   vat_name: 'Arvonlisävero',
//   vat_abbr: 'ALV',
//   standard: 25.5,
//   reduced: [10, 13.5],
//   super_reduced: null,
//   parking: null
// }

// Just the standard rate
getStandardRate('DE') // → 19

// EU membership check — false for non-EU countries (GB, NO, CH, ...)
if (isEUMember(userInput)) {
  const rate = getRate(userInput) // type narrowed to EUMemberCode
}

// Dataset membership check — true for any of the 45 European countries
if (isKnownCountry(userInput)) {
  const rate = getRate(userInput) // type narrowed to CountryCode
}

// All 45 countries at once
const all = getAllRates()
Object.entries(all).forEach(([code, rate]) => {
  console.log(`${code}: ${rate.standard}%`)
})

// When were these rates last fetched?
console.log(dataVersion) // e.g. "2026-03-27"

// VAT number format validation — no API key, no network call
import { validateFormat } from 'eu-vat-rates-data'
validateFormat('ATU12345678')  // → true
validateFormat('DE123456789')  // → true
validateFormat('INVALID')      // → false

// Access format metadata directly
const at = getRate('AT')
console.log(at.format)   // "ATU + 8 digits"
console.log(at.pattern)  // "^ATU\\d{8}$"

// Flag emoji from a 2-letter country code — no lookup table, computed from regional indicator symbols
import { getFlag } from 'eu-vat-rates-data'
getFlag('FI')  // → '🇫🇮'
getFlag('DE')  // → '🇩🇪'
getFlag('XX')  // → '' (empty string for unknown/invalid codes)
```

### CommonJS

```js
const { getRate, isEUMember, isKnownCountry } = require('eu-vat-rates-data')

console.log(getRate('FR').standard) // 20
```

### Direct JSON — always the latest data

```
# Served directly from GitHub CDN:
https://cdn.jsdelivr.net/gh/vatnode/eu-vat-rates-data@main/data/eu-vat-rates-data.json

# Raw GitHub (always latest commit):
https://raw.githubusercontent.com/vatnode/eu-vat-rates-data/main/data/eu-vat-rates-data.json
```

```js
const res = await fetch(
  'https://cdn.jsdelivr.net/gh/vatnode/eu-vat-rates-data@main/data/eu-vat-rates-data.json'
)
const { rates } = await res.json()
console.log(rates.DE.standard) // 19
```

---

## Example: charging VAT on an invoice

Rates alone do not determine invoice treatment. Resolve place-of-supply,
customer status, category, exemptions, and any reverse-charge eligibility in
your tax logic first; then use the dataset for the applicable numeric rate.

```js
import { getStandardRate } from 'eu-vat-rates-data'

// Money in minor units (cents). Never floats.
function invoiceTotal({ netCents, buyerCountry, reverseChargeEligible = false }) {
  if (reverseChargeEligible) {
    return { vatCents: 0, totalCents: netCents, reverseCharge: true }
  }

  const rate = getStandardRate(buyerCountry)
  const vatCents = Math.round((netCents * rate) / 100)
  return { vatCents, totalCents: netCents + vatCents, reverseCharge: false }
}

// Domestic sale in Finland — 25.5%
invoiceTotal({ netCents: 10000, buyerCountry: 'FI' })
// → { vatCents: 2550, totalCents: 12550, reverseCharge: false }

// Finnish seller, German business buyer — reverse charge
invoiceTotal({ netCents: 10000, buyerCountry: 'DE', reverseChargeEligible: true })
// → { vatCents: 0, totalCents: 10000, reverseCharge: true }
```

`reverseChargeEligible` must come from applicable tax logic and evidence. `validateFormat()`
only checks a number's shape; it does not establish registration or eligibility.

---

## Data structure

```ts
interface VatRate {
  country:       string        // "Finland"
  currency:      string        // "EUR" (or "DKK", "GBP", …)
  eu_member:     boolean       // true for EU-27, false for non-EU
  vat_name:      string        // "Arvonlisävero" — official name in primary local language
  vat_abbr:      string        // "ALV" — short abbreviation used locally
  standard:      number        // 25.5
  reduced:       number[]      // [10, 13.5] — sorted ascending
  super_reduced: number | null // null when not applicable
  parking:       number | null // null when not applicable
  format:        string        // "FI + 8 digits" — human-readable VAT number format
  pattern:       string        // "^FI\\d{8}$" — regex for format validation, always present
}
```

`reduced` may contain rates for special territories (e.g. French DOM departments, Azores/Madeira for Portugal, Canary Islands for Spain). All values come verbatim from EC TEDB.

### Country codes

Standard ISO 3166-1 alpha-2, with one EU convention: Greece is `GR` (TEDB internally uses `EL`, which this package normalises).

### Example JSON entry

```json
{
  "version": "2026-03-31",
  "source": "European Commission TEDB",
  "publisher": { "name": "vatnode.dev", "url": "https://vatnode.dev" },
  "rates": {
    "FI": {
      "country": "Finland",
      "currency": "EUR",
      "eu_member": true,
      "vat_name": "Arvonlisävero",
      "vat_abbr": "ALV",
      "standard": 25.5,
      "reduced": [10, 13.5],
      "super_reduced": null,
      "parking": null,
      "format": "FI + 8 digits",
      "pattern": "^FI\\d{8}$"
    }
  }
}
```

---

## Data source & update frequency

How the daily check works, and what changed when: [vatnode.dev/data](https://vatnode.dev/data?ref=rates-readme-js).

Rates are fetched from the **European Commission Taxes in Europe Database (TEDB)** via its official SOAP web service:

- Checked against the source: **daily at 07:00 UTC**, updated on any change
- Published: new npm version only when actual rates change (not on date-only updates)
- History: `git log -- data/eu-vat-rates-data.json` gives a full audit trail of VAT changes across the EU


Data is fetched by the [eu-vat-rates-data](https://github.com/vatnode/eu-vat-rates-data) repository and synced here daily.

---


## Keeping rates current

Rates are bundled at install time. A new package version is published automatically whenever rates change — but your installed version will not update itself.

**Recommended:** add [Renovate](https://renovatebot.com) or [Dependabot](https://docs.github.com/en/code-security/dependabot) to your repo. They detect new versions and open a PR automatically whenever rates change — no manual update commands needed.

**Need real-time accuracy?** Fetch the always-current JSON directly:

```
https://cdn.jsdelivr.net/gh/vatnode/eu-vat-rates-data@main/data/eu-vat-rates-data.json
```

No package needed — parse it with a single `fetch()` / `http.get()` / `file_get_contents()` call and cache locally.

---

## Covered countries

EU-27 member states:

`AT` `BE` `BG` `CY` `CZ` `DE` `DK` `EE` `ES` `FI` `FR` `GR` `HR` `HU` `IE` `IT` `LT` `LU` `LV` `MT` `NL` `PL` `PT` `RO` `SE` `SI` `SK`

Additional European countries:

`AD` `AL` `BA` `CH` `GB` `GE` `IS` `LI` `MC` `MD` `ME` `MK` `NO` `RS` `TR` `UA` `XK`

45 countries total.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

---

## License

MIT

If you find this useful, a ⭐ on GitHub is appreciated.
