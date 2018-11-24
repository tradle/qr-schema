const querystring = require('querystring')
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

  const baseQuery = {
    provider: base.provider,
    host: base.host,
  }

  const chatMobile = enc.links.getChatLink(extend(base, { platform: 'mobile' }))
  const chatWeb = enc.links.getChatLink(extend(base, { platform: 'web' }))

  const chatQuery = baseQuery
  t.equal(chatMobile, 'https://link.tradle.io/chat?qs=70726f76696465723d61626326686f73743d6874747073253341253246253246736f6d652e747261646c652e736572766572')
  t.same(enc.links.parseQueryString(chatMobile.split('?')[1]), chatQuery)

  t.equal(chatWeb, 'https://link.tradle.io/#/chat?qs=70726f76696465723d61626326686f73743d6874747073253341253246253246736f6d652e747261646c652e736572766572')

  const importQuery = extend({ dataHash: 'abc' }, baseQuery)
  const importMobile = enc.links.getImportDataLink(extend(base, { platform: 'mobile', dataHash: importQuery.dataHash }))
  const importWeb = enc.links.getImportDataLink(extend(base, { platform: 'web', dataHash: importQuery.dataHash }))

  t.equal(importMobile, 'https://link.tradle.io/chat?qs=70726f76696465723d61626326686f73743d6874747073253341253246253246736f6d652e747261646c652e7365727665722664617461486173683d616263')
  t.equal(importWeb, 'https://link.tradle.io/#/chat?qs=70726f76696465723d61626326686f73743d6874747073253341253246253246736f6d652e747261646c652e7365727665722664617461486173683d616263')
  t.same(enc.links.parseQueryString(importMobile.split('?')[1]), importQuery)

  const applyMobile = enc.links.getApplyForProductLink(extend(base, { platform: 'mobile', product: 'abc' }))
  const applyWeb = enc.links.getApplyForProductLink(extend(base, { platform: 'web', product: 'abc' }))

  t.equal(applyMobile, 'https://link.tradle.io/applyForProduct?qs=70726f76696465723d61626326686f73743d6874747073253341253246253246736f6d652e747261646c652e7365727665722670726f647563743d616263')
  t.equal(applyWeb, 'https://link.tradle.io/#/applyForProduct?qs=70726f76696465723d61626326686f73743d6874747073253341253246253246736f6d652e747261646c652e7365727665722670726f647563743d616263')

  const applyMobile1 = enc.links.getApplyForProductLink(extend(base, { platform: 'mobile', product: 'abc', contextId: 'efg' }))
  const applyWeb1 = enc.links.getApplyForProductLink(extend(base, { platform: 'web', product: 'abc', contextId: 'efg' }))

  t.equal(applyMobile1, 'https://link.tradle.io/applyForProduct?qs=70726f76696465723d61626326686f73743d6874747073253341253246253246736f6d652e747261646c652e7365727665722670726f647563743d61626326636f6e7465787449643d656667')
  t.equal(applyWeb1, 'https://link.tradle.io/#/applyForProduct?qs=70726f76696465723d61626326686f73743d6874747073253341253246253246736f6d652e747261646c652e7365727665722670726f647563743d61626326636f6e7465787449643d656667')

  const applyPerPlatformQuery = extend({ product: 'abc', contextId: 'efg' }, baseQuery)
  const applyPerPlatform = enc.links.getApplyForProductLinks(extend(base, {
    platform: 'mobile',
    product: applyPerPlatformQuery.product,
    contextId: applyPerPlatformQuery.contextId
  }))

  t.same(applyPerPlatform, {
    mobile: 'https://link.tradle.io/applyForProduct?qs=70726f76696465723d61626326686f73743d6874747073253341253246253246736f6d652e747261646c652e7365727665722670726f647563743d61626326636f6e7465787449643d656667',
    web: 'https://link.tradle.io/#/applyForProduct?qs=70726f76696465723d61626326686f73743d6874747073253341253246253246736f6d652e747261646c652e7365727665722670726f647563743d61626326636f6e7465787449643d656667'
  })

  // console.log(JSON.stringify(enc.links.parseLink(applyPerPlatform.mobile), null, 2))
  t.same(enc.links.parseLink(applyPerPlatform.mobile).query, applyPerPlatformQuery)

  t.end()
})
