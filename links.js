const URL = require('url').URL
const querystring = require('querystring')
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

const getAppLink = ({ baseUrl, path, query = {}, platform }) => {
  if (!baseUrl) {
    throw new Error('expected string "baseUrl"')
  }

  if (!platforms.includes(platform)) {
    throw new Error(`expected "platform" to be one of: ${platforms.join(', ')}`)
  }

  const qs = stringifyQuery(query)
  if (platform === 'mobile') {
    return `${baseUrl}/${path}?${qs}`
  }

  return `${baseUrl}/#/${path}?${qs}`
}

const stringifyQuery = query => {
  query = pickNonNull(query)
  const qsHex = Buffer.from(querystring.stringify(query)).toString('hex')
  return querystring.stringify({
    qs: qsHex
  })
}

const parseQueryString = value => {
  const query = querystring.parse(value)
  if (query.qs) {
    const decoded = Buffer.from(query.qs, 'hex').toString('utf8')
    return Object.assign({}, querystring.parse(decoded))
  }

  return Object.assign({}, query)
}

const CHAT_OPTS = commonOpts.concat(['host'])
const getChatLink = opts => {
  checkRequired(opts, CHAT_OPTS)
  return getAppLink({
    path: 'chat',
    baseUrl: opts.baseUrl,
    platform: opts.platform,
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
  const qs = url.split('?')[1]
  return Object.assign(parsed, {
    query: parseQueryString(qs)
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
