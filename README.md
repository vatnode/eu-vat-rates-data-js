# eu-vat-rates-data

[![npm version](https://img.shields.io/npm/v/eu-vat-rates-data)](https://www.npmjs.com/package/eu-vat-rates-data)
[![Last updated](https://img.shields.io/github/last-commit/vatnode/eu-vat-rates-data?path=data%2Feu-vat-rates.json&label=last%20updated)](https://github.com/vatnode/eu-vat-rates-data/commits/main/data/eu-vat-rates.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Auto-updated VAT rates for all **27 EU member states** plus the **United Kingdom**, sourced directly from the [European Commission TEDB](https://taxation-customs.ec.europa.eu/tedb/vatRates.html) SOAP web service.

- Standard, reduced, super-reduced, and parking rates
- TypeScript types included — works in Node.js and the browser
- JSON file committed to git — full rate-change history via `git log`
- Refreshed every Monday via GitHub Actions, auto-published to npm

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
console.log(dataVersion) // e.g. "2026.2.25"
```

### CommonJS

```js
const { getRate, isEUMember } = require('eu-vat-rates-data')

console.log(getRate('FR').standard) // 20
```

### Direct JSON — always the latest data

Two CDN options, both always serve the **most recent** rates:

```
# Recommended — served directly from this GitHub repo:
https://cdn.jsdelivr.net/gh/vatnode/eu-vat-rates-data@main/data/eu-vat-rates.json

# Also available via npm CDN (updates on each publish):
https://cdn.jsdelivr.net/npm/eu-vat-rates-data/data/eu-vat-rates.json
```

```js
const res = await fetch(
  'https://cdn.jsdelivr.net/gh/vatnode/eu-vat-rates-data@main/data/eu-vat-rates.json'
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

`reduced` may contain rates for special territories (e.g. French DOM departments, Azores/Madeira for Portugal). All values come verbatim from EC TEDB.

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
- Refreshed: **every Monday at 06:00 UTC** (GitHub Actions cron)
- On change: new npm version published automatically (`YYYY.M.D` versioning)
- History: `git log -- data/eu-vat-rates.json` gives a full public audit trail of VAT changes across the EU

To manually trigger a refresh, go to **[Actions → Update EU VAT Rates → Run workflow](https://github.com/vatnode/eu-vat-rates-data/actions/workflows/update-vat-rates.yml)**.

To run locally:

```bash
git clone https://github.com/vatnode/eu-vat-rates-data.git
cd eu-vat-rates-data
pip install requests
python3 scripts/update.py          # update data/eu-vat-rates.json
python3 scripts/update.py --dry-run  # preview changes without writing
```

---

## Covered countries

EU-27 member states + United Kingdom (28 countries total):

AT BE BG CY CZ DE DK EE ES FI FR GB GR HR HU IE IT LT LU LV MT NL PL PT RO SE SI SK

---

## License

MIT
