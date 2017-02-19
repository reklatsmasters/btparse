'use strict'

var c = require('./const')

var NUM0 = c.digit.NUM0
var NUM9 = c.digit.NUM9

module.exports = integer

function integer(ptr, start, end) {
  if (end >= ptr.length) {
    throw new Error('unexpected end of a string')
  }


  return integer_internal(0, 1, start, start, end, ptr.buffer)
}


function integer_internal(num, sign, i, start, end, buffer) {
  if (i >= end) {
    return num * sign
  }

  var byte = buffer[i]
  var len = end - start

  if (i == start && byte == c.MINUS) {
    sign = -1
  }
  else if (byte == NUM0 && len > 1 && (i == start || (sign < 0 && i == start + 1))) {
    error()
  }
  else if (byte >= NUM0 && byte <= NUM9) {
    num = num * 10 + (byte - NUM0)
  }
  else {
    error()
  }

  return integer_internal(num, sign, ++i, start, end, buffer)
}

function error() {
  throw new Error('invalid number')
}
