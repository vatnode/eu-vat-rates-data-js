# eu-vat-rates-data

[![npm version](https://img.shields.io/npm/v/eu-vat-rates-data)](https://www.npmjs.com/package/eu-vat-rates-data)
[![Last updated](https://img.shields.io/github/last-commit/vatnode/eu-vat-rates-data?path=data%2Feu-vat-rates.json&label=last%20updated)](https://github.com/vatnode/eu-vat-rates-data/commits/main/data/eu-vat-rates.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Auto-updated VAT rates for all **27 EU member states** plus the **United Kingdom**, sourced from the [European Commission TEDB](https://taxation-customs.ec.europa.eu/tedb/vatRates.html). Refreshed every Monday.

---

## Install

```bash
npm install eu-vat-rates-data
```

## Usage

```ts
import { getRate, getStandardRate, getAllRates, isEUMember, dataVersion } from 'eu-vat-rates-data'

getRate('FI')
// { country: 'Finland', currency: 'EUR', standard: 25.5, reduced: [10, 13.5], ... }

getStandardRate('DE')  // 19
getStandardRate('FR')  // 20

isEUMember('DE')  // true
isEUMember('US')  // false

dataVersion  // "2026.2.25" — date of last rate update
```

CommonJS:

```js
const { getRate } = require('eu-vat-rates-data')
```

---

## Data

### JSON — no npm required

```
https://cdn.jsdelivr.net/gh/vatnode/eu-vat-rates-data@main/data/eu-vat-rates.json
```

Raw GitHub (always latest commit):

```
https://raw.githubusercontent.com/vatnode/eu-vat-rates-data/main/data/eu-vat-rates.json
```

```js
const { rates } = await fetch(
  'https://cdn.jsdelivr.net/gh/vatnode/eu-vat-rates-data@main/data/eu-vat-rates.json'
).then(r => r.json())

rates.DE  // { standard: 19, reduced: [7], ... }
```

### Structure

```ts
interface VatRate {
  country:       string        // "Finland"
  currency:      string        // "EUR" | "DKK" | "GBP" | ...
  standard:      number        // 25.5
  reduced:       number[]      // [10, 13.5] — sorted ascending
  super_reduced: number | null
  parking:       number | null
}
```

`reduced` includes all rates from TEDB verbatim — some countries have territorial variants (e.g. French DOM, Azores).

### Country codes

ISO 3166-1 alpha-2. Greece is `GR` (TEDB uses `EL` internally, normalised here).

### Example

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

### Covered countries

EU-27 + United Kingdom (28 total):

`AT` `BE` `BG` `CY` `CZ` `DE` `DK` `EE` `ES` `FI` `FR` `GB` `GR` `HR` `HU` `IE` `IT` `LT` `LU` `LV` `MT` `NL` `PL` `PT` `RO` `SE` `SI` `SK`

---

## Update frequency

Data is fetched from [EC TEDB SOAP API](https://ec.europa.eu/taxation_customs/tedb/ws/VatRetrievalService.wsdl) every Monday. When rates change, a new npm version is published automatically and the change is committed here — so `git log` on this repo is a public audit trail of VAT changes across the EU.

---

## License

MIT
