
const test = require('tape')
const enc = require('./')

test('encode/decode', function (t) {
  const input = {
    schema: 'ImportData',
    data: {
      provider: 'abc',
      dataHash: '123',
      host: 'hij'
    }
  }

  t.same(enc.fromHex(enc.toHex(input)), input)
  t.end()
})
