const URL = global.URL || require('url').URL
const URLSearchParams = global.URLSearchParams || require('url').URLSearchParams
const omit = require('object.omit')
const commonOpts = ['baseUrl', 'platform']
const platforms = ['mobile', 'web']
const omitCommon = obj => omit(obj, commonOpts)
const checkRequired = (opts, required) => {
  for (const prop of required) {
    if (!opts[prop]) {
      throw new Error(`expected "${prop}"`)
    }
  }
}

const pickNonNull = obj => {
  const picked = {}
  for (const key in obj) {
    if (obj[key] != null) {
      picked[key] = obj[key]
    }
  }

  return picked
}

const getAppLink = ({ baseUrl, path, query = {}, platform, unpacked }) => {
  if (!baseUrl) {
    throw new Error('expected string "baseUrl"')
  }

  if (!platforms.includes(platform)) {
    throw new Error(`expected "platform" to be one of: ${platforms.join(', ')}`)
  }

  const qs = stringifyQuery(query, unpacked)
  if (platform === 'mobile') {
    return `${baseUrl}/${path}?${qs}`
  }

  return `${baseUrl}/#/${path}?${qs}`
}

const searchParamString = query => (new URLSearchParams(query)).toString()

const stringifyQuery = (query, unpacked) => {
  query = pickNonNull(query)
  if (!unpacked) {
    const q = require('urlsafe-base64').encode(require('msgpack-codec').encode(query))
    return searchParamString({ q })
  }
  const qsHex = Buffer.from(searchParamString(query)).toString('hex')
  return searchParamString({
    qs: qsHex
  })
}

const paramsToObject = params => {
  const result = {}
  Array.from(params.keys()).forEach(key => {
    result[key] = params.get(key)
  })
  return result
}

const parseQueryString = value => {
  const query = paramsToObject(new URLSearchParams(value))
  if (query.q) {
    return require('msgpack-codec').decode(require('urlsafe-base64').decode(query.q))
  }
  if (query.qs) {
    const decoded = Buffer.from(query.qs, 'hex').toString('utf8')
    return paramsToObject(new URLSearchParams(decoded))
  }

  return query
}

const CHAT_OPTS = commonOpts.concat(['host'])
const getChatLink = opts => {
  checkRequired(opts, CHAT_OPTS)
  return getAppLink({
    path: 'chat',
    baseUrl: opts.baseUrl,
    platform: opts.platform,
    unpacked: opts.unpacked,
    query: omitCommon(opts)
  })
}

const IMPORT_DATA_OPTS = CHAT_OPTS.concat('dataHash')
const getImportDataLink = opts => {
  checkRequired(opts, IMPORT_DATA_OPTS)
  return getAppLink({
    path: 'chat',
    baseUrl: opts.baseUrl,
    platform: opts.platform,
    unpacked: opts.unpacked,
    query: omitCommon(opts)
  })
}

const APPLY_FOR_PRODUCT_OPTS = CHAT_OPTS.concat('product')
const getApplyForProductLink = opts => {
  checkRequired(opts, APPLY_FOR_PRODUCT_OPTS)
  return getAppLink({
    path: 'applyForProduct',
    baseUrl: opts.baseUrl,
    platform: opts.platform,
    unpacked: opts.unpacked,
    query: omitCommon(opts)
  })
}

const getResourceLink = opts => {
  const { type, link, permalink } = opts
  if (!type) throw new Error('expected "type"')
  if (!(link || permalink)) throw new Error('expected "link" or "permalink"')

  return getAppLink({
    path: 'r',
    baseUrl: opts.baseUrl,
    platform: opts.platform,
    unpacked: opts.unpacked,
    query: { type, link, permalink }
  })
}

const inferSchemaAndData = ({ provider, host, data }) => {
  const { claimId, product } = data
  if (claimId) {
    return {
      schema: 'ImportData',
      data: { provider, host, dataHash: claimId }
    }
  }

  if (product) {
    return {
      schema: 'ApplyForProduct',
      data: { provider, host, product }
    }
  }

  return {
    schema: 'AddProvider',
    data: { provider, host }
  }
}

const perPlatform = fn => opts => platforms.reduce((map, platform) => {
  const pOpts = Object.assign({}, opts, { platform })
  map[platform] = fn(pOpts)
  return map
}, {})

const getAppLinks = perPlatform(getAppLink)
const getChatLinks = perPlatform(getChatLink)
const getImportDataLinks = perPlatform(getImportDataLink)
const getApplyForProductLinks = perPlatform(getApplyForProductLink)
const getResourceLinks = perPlatform(getResourceLink)

const parseLink = url => {
  const parsed = new URL(url)
  return Object.assign(parsed, {
    query: parseQueryString(parsed.search)
  })
}

module.exports = {
  getAppLink,
  getAppLinks,
  getChatLink,
  getChatLinks,
  getImportDataLink,
  getImportDataLinks,
  getApplyForProductLink,
  getApplyForProductLinks,
  getResourceLink,
  getResourceLinks,
  inferSchemaAndData,
  stringifyQuery,
  parseQueryString,
  parseLink
}
