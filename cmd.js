#!/usr/bin/env node

const { toHex, fromHex, links } = require('./')
const argv = require('minimist')(process.argv.slice(2), {
  string: ['host', 'provider', 'platform', 'product', 'data-hash'],
  default: {
    host: '',
  },
})

const getSchema = ({ product, dataHash }) => {
  if (dataHash) return 'ImportData'
  if (product) return 'ApplyForProduct'
  return 'AddProvider'
}

const getLinkFn = ({ product, dataHash }) => {
  if (dataHash) return links.getImportDataLink
  if (product) return links.getApplyForProductLink

  return links.getChatLinks
}

const { host, provider, product } = argv
const data = Object.assign({}, argv, { dataHash: argv['data-hash'] })
const schema = getSchema(data)

const getLink = getLinkFn(data)
const result = toHex({ schema, data })
// eslint-disable-next-line no-console
console.log(`QR data for schema ${schema}: ${result}`)

const mobile = getLink({ ...data, platform: 'mobile', baseUrl: 'https://link.tradle.io' })
const web = getLink({ ...data, platform: 'web', baseUrl: 'https://app.tradle.io' })

console.log(`app links: 
mobile: ${mobile}
web: ${web}`)
