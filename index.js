
const messages = require('./schema.js')

const CODERS = [
  messages.ImportData,
  messages.AddProvider,
  messages.Pair,
  messages.ProductAuthorization,
  messages.ApplyForProduct,
  messages.IdentityStub,
  messages.Profile,
  messages.OrgProfile
]
// Adding name and index to all schema
for (const name in messages) {
  const coder = messages[name]
  coder.name = name
  coder.type = CODERS.indexOf(coder)
}
Object.freeze(messages)

const HEX_PROPS = ['provider', 'dataHash', 'permalink', 'link']

const links = require('./links')

module.exports = {
  schema: messages,
  encode,
  decode,
  toHex,
  fromHex,
  links
}

function toHex ({ schema, data }) {
  return encode({ schema, data })
    .toString('hex')
    .toUpperCase()
}

function hexify (decoded) {
  const { data } = decoded
  HEX_PROPS.forEach(prop => {
    if (Buffer.isBuffer(data[prop])) {
      data[prop] = data[prop].toString('hex')
    }
  })

  return decoded
}

function unhexify (data) {
  data = Object.assign({}, data)
  HEX_PROPS.forEach(prop => {
    if (typeof data[prop] === 'string') {
      data[prop] = Buffer.from(data[prop], 'hex')
    }
  })

  return data
}

function fromHex (data) {
  return hexify(decode(Buffer.from(data, 'hex')))
}

function encode ({ schema, data }) {
  const encoder = typeof schema === 'string' ? messages[schema] : schema
  if (!encoder) throw new Error('encoder not found')

  data = unhexify(data)
  const buf = Buffer.alloc(encoder.encodingLength(data) + 1)
  buf[0] = CODERS.indexOf(encoder)
  encoder.encode(data, buf, 1)
  return buf.toString('hex')
}

function decode (buffer) {
  if (typeof buffer === 'string') buffer = Buffer.from(buffer, 'hex')

  const type = buffer[0]
  const decoder = CODERS[type]
  if (!decoder) throw new Error('decoder not found')

  return {
    schema: decoder.name,
    data: decoder.decode(buffer, 1)
  }
}
