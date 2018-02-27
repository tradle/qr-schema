const extend = require('xtend')
const test = require('tape')
const enc = require('./')
const hex = [
  '5623ab6d6518b00065fb9d133fc34ebb6141015de72a5c39946058e0fbd35550',
  '01623fc16b2b76ac7d102fa2edcb07c351f1acccc597f3c7d27e118440510426'
]

test('encode/decode', function (t) {
  const expected = {
    schema: 'ImportData',
    data: {
      provider: hex[0],
      dataHash: hex[1],
      host: 'https://blah.blah'
    }
  }

  const prebufferized = {
    schema: 'ImportData',
    data: {
      provider: new Buffer(hex[0], 'hex'),
      dataHash: new Buffer(hex[1], 'hex'),
      host: 'https://blah.blah'
    }
  }

  t.same(enc.fromHex(enc.toHex(expected)), expected)
  t.same(enc.fromHex(enc.toHex(prebufferized)), expected)
  t.end()
})

test('links', function (t) {
  const base = {
    baseUrl: 'https://link.tradle.io',
    provider: 'abc',
    host: 'https://some.tradle.server'
  }

  const chatMobile = enc.links.getChatLink(extend(base, { platform: 'mobile' }))
  const chatWeb = enc.links.getChatLink(extend(base, { platform: 'web' }))

  t.equal(chatMobile, 'https://link.tradle.io/chat?provider=abc&host=https%3A%2F%2Fsome.tradle.server')
  t.equal(chatWeb, 'https://link.tradle.io/#/chat?provider=abc&host=https%3A%2F%2Fsome.tradle.server')

  const importMobile = enc.links.getImportDataLink(extend(base, { platform: 'mobile', dataHash: 'abc' }))
  const importWeb = enc.links.getImportDataLink(extend(base, { platform: 'web', dataHash: 'abc' }))

  t.equal(importMobile, 'https://link.tradle.io/chat?provider=abc&host=https%3A%2F%2Fsome.tradle.server&dataHash=abc')
  t.equal(importWeb, 'https://link.tradle.io/#/chat?provider=abc&host=https%3A%2F%2Fsome.tradle.server&dataHash=abc')

  const applyMobile = enc.links.getApplyForProductLink(extend(base, { platform: 'mobile', product: 'abc' }))
  const applyWeb = enc.links.getApplyForProductLink(extend(base, { platform: 'web', product: 'abc' }))

  t.equal(applyMobile, 'https://link.tradle.io/applyForProduct?provider=abc&host=https%3A%2F%2Fsome.tradle.server&product=abc')
  t.equal(applyWeb, 'https://link.tradle.io/#/applyForProduct?provider=abc&host=https%3A%2F%2Fsome.tradle.server&product=abc')

  const applyMobile1 = enc.links.getApplyForProductLink(extend(base, { platform: 'mobile', product: 'abc', contextId: 'efg' }))
  const applyWeb1 = enc.links.getApplyForProductLink(extend(base, { platform: 'web', product: 'abc', contextId: 'efg' }))

  t.equal(applyMobile1, 'https://link.tradle.io/applyForProduct?provider=abc&host=https%3A%2F%2Fsome.tradle.server&product=abc&contextId=efg')
  t.equal(applyWeb1, 'https://link.tradle.io/#/applyForProduct?provider=abc&host=https%3A%2F%2Fsome.tradle.server&product=abc&contextId=efg')

  const applyPerPlatform = enc.links.getApplyForProductLinks(extend(base, { platform: 'mobile', product: 'abc', contextId: 'efg' }))
  t.same(applyPerPlatform, {
    mobile: 'https://link.tradle.io/applyForProduct?provider=abc&host=https%3A%2F%2Fsome.tradle.server&product=abc&contextId=efg',
    web: 'https://link.tradle.io/#/applyForProduct?provider=abc&host=https%3A%2F%2Fsome.tradle.server&product=abc&contextId=efg'
  })

  t.end()
})
