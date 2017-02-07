'use strict'

const next = require('./lib/lexer')
const lazyparser = require('./lib/lazy')

module.exports = decode

function decode(data) {
  const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data)

  const ptr = {
    i: 0,
    buffer,
    length: buffer.length // save space in IC
  }

  return lazyparser.select(ptr, next(ptr, -1))
}
