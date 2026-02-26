# eu-vat-rates-data

[![npm version](https://img.shields.io/npm/v/eu-vat-rates-data)](https://www.npmjs.com/package/eu-vat-rates-data)
[![Last updated](https://img.shields.io/github/last-commit/vatnode/eu-vat-rates-data-js?path=data%2Feu-vat-rates-data.json&label=last%20updated)](https://github.com/vatnode/eu-vat-rates-data-js/commits/main/data/eu-vat-rates-data.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

EU VAT rates for all **27 EU member states** plus the **United Kingdom**, sourced from the [European Commission TEDB](https://taxation-customs.ec.europa.eu/tedb/vatRates.html). Checked daily, published automatically when rates change.

- Standard, reduced, super-reduced, and parking rates
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
import { getRate, getStandardRate, getAllRates, isEUMember, dataVersion } from 'eu-vat-rates-data'

// Full rate object for a country
const fi = getRate('FI')
// {
//   country: 'Finland',
//   currency: 'EUR',
//   standard: 25.5,
//   reduced: [10, 13.5],
//   super_reduced: null,
//   parking: null
// }

// Just the standard rate
getStandardRate('DE') // → 19

// Type guard
if (isEUMember(userInput)) {
  const rate = getRate(userInput) // type: VatRate (never undefined)
}

// All 28 countries at once
const all = getAllRates()
Object.entries(all).forEach(([code, rate]) => {
  console.log(`${code}: ${rate.standard}%`)
})

// When were these rates last fetched?
console.log(dataVersion) // e.g. "2026-02-25"
```

### CommonJS

```js
const { getRate, isEUMember } = require('eu-vat-rates-data')

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

## Data structure

```ts
interface VatRate {
  country:      string        // "Finland"
  currency:     string        // "EUR" (or "DKK", "GBP", …)
  standard:     number        // 25.5
  reduced:      number[]      // [10, 13.5] — sorted ascending
  super_reduced: number | null // null when not applicable
  parking:      number | null  // null when not applicable
}
```

`reduced` may contain rates for special territories (e.g. French DOM departments, Azores/Madeira for Portugal, Canary Islands for Spain). All values come verbatim from EC TEDB.

### Country codes

Standard ISO 3166-1 alpha-2, with one EU convention: Greece is `GR` (TEDB internally uses `EL`, which this package normalises).

### Example JSON entry

```json
{
  "version": "2026-02-25",
  "source": "European Commission TEDB",
  "url": "https://taxation-customs.ec.europa.eu/tedb/vatRates.html",
  "rates": {
    "FI": {
      "country": "Finland",
      "currency": "EUR",
      "standard": 25.5,
      "reduced": [10, 13.5],
      "super_reduced": null,
      "parking": null
    }
  }
}
```

---

## Data source & update frequency

Rates are fetched from the **European Commission Taxes in Europe Database (TEDB)** via its official SOAP web service:

- WSDL: `https://ec.europa.eu/taxation_customs/tedb/ws/VatRetrievalService.wsdl`
- Refreshed: **daily at 07:00 UTC**
- Published: new npm version only when actual rates change (not on date-only updates)
- History: `git log -- data/eu-vat-rates-data.json` gives a full audit trail of VAT changes across the EU


Data is fetched by the [eu-vat-rates-data](https://github.com/vatnode/eu-vat-rates-data) repository and synced here daily.

---

## Covered countries

EU-27 member states + United Kingdom (28 countries total):

`AT` `BE` `BG` `CY` `CZ` `DE` `DK` `EE` `ES` `FI` `FR` `GB` `GR` `HR` `HU` `IE` `IT` `LT` `LU` `LV` `MT` `NL` `PL` `PT` `RO` `SE` `SI` `SK`

---

## Need to validate VAT numbers?

This package provides **VAT rates** only. If you also need to **validate EU VAT numbers** against the official VIES database — confirming a business is VAT-registered — check out [vatnode.dev](https://vatnode.dev), a simple REST API with a free tier.

```bash
curl https://api.vatnode.dev/v1/vat/FI17156132 \
  -H "Authorization: Bearer vat_live_..."
# → { "valid": true, "companyName": "Suomen Pehmeä Ikkuna Oy" }
```

---

## License

MIT

If you find this useful, a ⭐ on GitHub is appreciated.
