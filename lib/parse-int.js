'use strict'

var c = require('./const')

module.exports = parse_int

function parse_int(ptr, start, end) {
  var sign = 1
  var num = 0
  var byte = 0
  var i = start
  var buffer = ptr.buffer
  var zero_prefixed = false

  if (end >= ptr.length) {
    throw new Error('unexpected end of a string')
  }

  for(;i < end; ++i) {
    byte = buffer[i]

    if (i == start && byte == c.MINUS) {
      sign = -1
      continue
    }

    if (byte >= c.digit.NUM0 && byte <= c.digit.NUM9) {
      if (byte == c.digit.NUM0 && ((sign == 1 && i == start) || (sign == -1 && i == (start + 1)))) {
        zero_prefixed = true
      }

      num = num * 10 + (byte - c.digit.NUM0)
      continue
    }

    throw new Error('expected digit as pos = ' + i)
  }

  if ((!num && sign == -1) || (zero_prefixed && num)) {
    throw new Error('invalid number')
  }

  return num * sign
}
