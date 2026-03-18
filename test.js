import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  getRate,
  getStandardRate,
  getAllRates,
  isEUMember,
  dataVersion,
} from './dist/index.js'

test('DE standard rate is 19', () => {
  assert.equal(getStandardRate('DE'), 19)
})

test('EE standard rate is 24', () => {
  assert.equal(getStandardRate('EE'), 24)
})

test('FR is an EU member', () => {
  assert.equal(isEUMember('FR'), true)
})

test('GB is not an EU member', () => {
  assert.equal(isEUMember('GB'), false)
})

test('dataset contains 44 countries', () => {
  assert.equal(Object.keys(getAllRates()).length, 44)
})

test('getRate returns eu_member field', () => {
  assert.equal(getRate('DE')?.eu_member, true)
  assert.equal(getRate('NO')?.eu_member, false)
})

test('dataVersion matches YYYY-MM-DD format', () => {
  assert.match(dataVersion, /^\d{4}-\d{2}-\d{2}$/)
})
