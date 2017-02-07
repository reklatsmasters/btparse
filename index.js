'use strict'

var next = require('./lib/lexer')
var parser = require('./lib/parser')
var from = require('./lib/from')

module.exports = decode

function decode(data) {
  var buffer = Buffer.isBuffer(data) ? data : from(data)

  var ptr = {
    i: 0,
    buffer: buffer,
    length: buffer.length // save space in IC
  }

  return parser.select(ptr, next(ptr, -1))
}
