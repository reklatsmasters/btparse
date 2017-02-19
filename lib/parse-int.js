'use strict'

var c = require('./const')

module.exports = parse_int

var NUM0 = c.digit.NUM0
var NUM9 = c.digit.NUM9

function parse_int(ptr, start, end) {
  var sign = 1
  var num = 0
  var byte = 0
  var i = start
  var len = end - start

  if (end >= ptr.length) {
    error(end)
  }

  for(;i < end; ++i) {
    byte = ptr.buffer[i]

    if (i == start && byte == c.MINUS) {
      sign = -1
      continue
    }

    if (byte == NUM0 && len > 1 && (i == start || (sign < 0 && i == start + 1))) {
      error(i)
    }

    if (byte >= NUM0 && byte <= NUM9) {
      num = num * 10 + (byte - NUM0)
      continue
    }

    error(i)
  }

  return num * sign
}

function error(i) {
  throw new Error('invalid digit at pos = ' + i)
}
