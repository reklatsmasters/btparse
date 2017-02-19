'use strict'

var next = require('./lib/lexer')
var parser = require('./lib/parser')
var from = require('./lib/from')

module.exports = decode

function decode(buffer, opts) {
  if (typeof buffer === 'string') {
    buffer = from(buffer)
  }

  opts = opts || {}

  var depth = opts.depth >>> 0

  var ptr = {
    i: 0,
    buffer: buffer,
    length: buffer.length, // save space in IC
    depth: depth < 1 ? Infinity : depth,
    curr_depth: 0
  }

  return parser.select(ptr, next(ptr, -1))
}
