const extend = (a, b) => Object.assign({}, a, b)
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
      provider: Buffer.from(hex[0], 'hex'),
      dataHash: Buffer.from(hex[1], 'hex'),
      host: 'https://blah.blah'
    }
  }

  t.same(enc.fromHex(enc.toHex(expected)), expected)
  t.same(enc.fromHex(enc.toHex(prebufferized)), expected)
  t.end()
})

test('parse/stringify', function (t) {
  function io (input, expected) {
    const stringified = enc.links.stringifyQuery(input)
    t.equals(stringified, expected)
    const parsed = enc.links.parseQueryString(stringified)
    t.deepEquals(parsed, input)
  }

  [
    [{ hello: 'world' }, 'q=gaVoZWxsb6V3b3JsZA'],
    [{ こんにちは: '世界' }, 'q=ga_jgZPjgpPjgavjgaHjga-m5LiW55WM'],
    [{ a: 1 }, 'q=gaFhAQ']
  ].forEach(([input, expected]) => io(input, expected))

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
    host: base.host
  }

  const chatMobile = enc.links.getChatLink(extend(base, { platform: 'mobile' }))
  const chatWeb = enc.links.getChatLink(extend(base, { platform: 'web' }))

  const chatQuery = baseQuery
  t.equal(chatMobile, 'https://link.tradle.io/chat?q=gqhwcm92aWRlcqNhYmOkaG9zdLpodHRwczovL3NvbWUudHJhZGxlLnNlcnZlcg')
  t.same(enc.links.parseQueryString(chatMobile.split('?')[1]), chatQuery)

  t.equal(chatWeb, 'https://link.tradle.io/#/chat?q=gqhwcm92aWRlcqNhYmOkaG9zdLpodHRwczovL3NvbWUudHJhZGxlLnNlcnZlcg')

  const importQuery = extend({ dataHash: 'abc' }, baseQuery)
  const importMobile = enc.links.getImportDataLink(extend(base, { platform: 'mobile', dataHash: importQuery.dataHash }))
  const importWeb = enc.links.getImportDataLink(extend(base, { platform: 'web', dataHash: importQuery.dataHash }))

  t.equal(importMobile, 'https://link.tradle.io/chat?q=g6hwcm92aWRlcqNhYmOkaG9zdLpodHRwczovL3NvbWUudHJhZGxlLnNlcnZlcqhkYXRhSGFzaKNhYmM')
  t.equal(importWeb, 'https://link.tradle.io/#/chat?q=g6hwcm92aWRlcqNhYmOkaG9zdLpodHRwczovL3NvbWUudHJhZGxlLnNlcnZlcqhkYXRhSGFzaKNhYmM')
  t.same(enc.links.parseQueryString(importMobile.split('?')[1]), importQuery)

  const applyMobile = enc.links.getApplyForProductLink(extend(base, { platform: 'mobile', product: 'abc' }))
  const applyWeb = enc.links.getApplyForProductLink(extend(base, { platform: 'web', product: 'abc' }))

  t.equal(applyMobile, 'https://link.tradle.io/applyForProduct?q=g6hwcm92aWRlcqNhYmOkaG9zdLpodHRwczovL3NvbWUudHJhZGxlLnNlcnZlcqdwcm9kdWN0o2FiYw')
  t.equal(applyWeb, 'https://link.tradle.io/#/applyForProduct?q=g6hwcm92aWRlcqNhYmOkaG9zdLpodHRwczovL3NvbWUudHJhZGxlLnNlcnZlcqdwcm9kdWN0o2FiYw')

  const applyMobile1 = enc.links.getApplyForProductLink(extend(base, { platform: 'mobile', product: 'abc', contextId: 'efg' }))
  const applyWeb1 = enc.links.getApplyForProductLink(extend(base, { platform: 'web', product: 'abc', contextId: 'efg' }))

  t.equal(applyMobile1, 'https://link.tradle.io/applyForProduct?q=hKhwcm92aWRlcqNhYmOkaG9zdLpodHRwczovL3NvbWUudHJhZGxlLnNlcnZlcqdwcm9kdWN0o2FiY6ljb250ZXh0SWSjZWZn')
  t.equal(applyWeb1, 'https://link.tradle.io/#/applyForProduct?q=hKhwcm92aWRlcqNhYmOkaG9zdLpodHRwczovL3NvbWUudHJhZGxlLnNlcnZlcqdwcm9kdWN0o2FiY6ljb250ZXh0SWSjZWZn')

  const applyPerPlatformQuery = extend({ product: 'abc', contextId: 'efg' }, baseQuery)
  const applyPerPlatform = enc.links.getApplyForProductLinks(extend(base, {
    platform: 'mobile',
    product: applyPerPlatformQuery.product,
    contextId: applyPerPlatformQuery.contextId
  }))

  t.same(applyPerPlatform, {
    mobile: 'https://link.tradle.io/applyForProduct?q=hKhwcm92aWRlcqNhYmOkaG9zdLpodHRwczovL3NvbWUudHJhZGxlLnNlcnZlcqdwcm9kdWN0o2FiY6ljb250ZXh0SWSjZWZn',
    web: 'https://link.tradle.io/#/applyForProduct?q=hKhwcm92aWRlcqNhYmOkaG9zdLpodHRwczovL3NvbWUudHJhZGxlLnNlcnZlcqdwcm9kdWN0o2FiY6ljb250ZXh0SWSjZWZn'
  })

  // console.log(JSON.stringify(enc.links.parseLink(applyPerPlatform.mobile), null, 2))
  t.same(enc.links.parseLink(applyPerPlatform.mobile).query, applyPerPlatformQuery)

  t.end()
})
