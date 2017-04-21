const { Buffer } = require('buffer')
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

function fromHex (data) {
  return decode(new Buffer(data, 'hex'))
}

function encode ({ schema, data }) {
  const encoder = typeof schema === 'string' ? messages[schema] : schema
  if (!encoder) throw new Error('encoder not found')

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
