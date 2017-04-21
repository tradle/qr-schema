#!/usr/bin/env node

const { toHex, fromHex } = require('./')
const argv = require('minimist')(process.argv.slice(2), {
  default: {
    host: ''
  }
})

if (argv._[0]) {
  console.log(JSON.stringify(fromHex(argv._[0]), null, 2))
} else {
  console.log(toHex({
    schema: 'ImportData',
    data: {
      host: argv.host,
      provider: argv.provider,
      dataHash: argv['data-hash']
    }
  }))
}
