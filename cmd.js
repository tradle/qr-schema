#!/usr/bin/env node

const { toHex, fromHex } = require('./')
const argv = require('minimist')(process.argv.slice(2), {
  string: ['host', 'provider', 'data-hash'],
  default: {
    host: ''
  }
})

const { host, provider } = argv
const dataHash = argv['data-hash']
const schema = dataHash ? 'ImportData' : 'AddProvider'
const data = {
  host,
  provider,
  dataHash
}

const result = toHex({ schema, data })
console.log(`QR data for schema ${schema}: ${result}`)
