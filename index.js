
const messages = require('./schema')

const CODERS = [
  messages.ImportData,
  messages.AddProvider,
]

module.exports = {
  schema: messages,
  encode,
  decode,
  toHex,
  fromHex
}

function toHex ({ schema, data }) {
  return encode({ schema, data })
    .toString('hex')
    .toUpperCase()
}

function hexify (decoded) {
  const { data } = decoded
  if (Buffer.isBuffer(data.provider)) {
    data.provider = data.provider.toString('hex')
  }

  if (Buffer.isBuffer(data.dataHash)) {
    data.dataHash = data.dataHash.toString('hex')
  }

  return decoded
}

function unhexify (data) {
  data = Object.assign({}, data)
  if (typeof data.provider === 'string') {
    data.provider = new Buffer(data.provider, 'hex')
  }

  if (typeof data.dataHash === 'string') {
    data.dataHash = new Buffer(data.dataHash, 'hex')
  }

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
