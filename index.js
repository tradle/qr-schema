
const messages = require('./schema')

const CODERS = [
  messages.ImportData,
  messages.AddProvider,
  messages.ApplyForProduct,
  messages.IdentityStub,
  messages.Profile,
]

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
      data[prop] = new Buffer(data[prop], 'hex')
    }
  })

  return data
}

function fromHex (data) {
  return hexify(decode(new Buffer(data, 'hex')))
}

function encode ({ schema, data }) {
  const encoder = typeof schema === 'string' ? messages[schema] : schema
  if (!encoder) throw new Error('encoder not found')

  data = unhexify(data)
  const buf = new Buffer(encoder.encodingLength(data) + 1)
  buf[0] = CODERS.indexOf(encoder)
  encoder.encode(data, buf, 1)
  return buf.toString('hex')
}

function decode (buffer) {
  if (typeof buffer === 'string') buffer = new Buffer(buffer, 'hex')

  const type = buffer[0]
  const decoder = CODERS[type]
  if (!decoder) throw new Error('decoder not found')

  return {
    schema: decoder.name,
    data: decoder.decode(buffer, 1)
  }
}
