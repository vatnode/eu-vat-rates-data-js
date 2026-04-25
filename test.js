import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getRate, getAllRates, isEUMember, dataVersion } from './dist/index.js'

test('DE is an EU member', () => {
  assert.equal(isEUMember('DE'), true)
})

test('GB is not an EU member', () => {
  assert.equal(isEUMember('GB'), false)
})

test('NO is not an EU member', () => {
  assert.equal(isEUMember('NO'), false)
})

test('dataset contains 45 countries', () => {
  assert.equal(Object.keys(getAllRates()).length, 45)
})

test('all standard rates are greater than zero', () => {
  for (const [code, rate] of Object.entries(getAllRates())) {
    assert.ok(rate.standard > 0, `${code}: standard rate is ${rate.standard}`)
  }
})

test('eu_member field is boolean on every entry', () => {
  for (const [code, rate] of Object.entries(getAllRates())) {
    assert.equal(typeof rate.eu_member, 'boolean', `${code}: eu_member is not boolean`)
  }
})

test('all vat_name fields are non-empty strings', () => {
  for (const [code, rate] of Object.entries(getAllRates())) {
    assert.ok(rate.vat_name.length > 0, `${code}: vat_name is empty`)
  }
})

test('dataVersion matches YYYY-MM-DD format', () => {
  assert.match(dataVersion, /^\d{4}-\d{2}-\d{2}$/)
})

test('unknown country returns undefined', () => {
  assert.equal(getRate('XX'), undefined)
})
