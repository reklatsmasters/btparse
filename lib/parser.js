'use strict'

var c = require('./const')
var next = require('./lexer')
var parse_int = require('./parse-int')

module.exports = {
  select: select,
  intval: intval,
  listval: listval,
  strval: strval,
  dictval: dictval
}

function select(ptr, token) {
  switch (token.type) {
    case c.type.STR:
      return strval(ptr, token)
    case c.type.DICT:
      return dictval(ptr)
    case c.type.LIST:
      return listval(ptr)
    case c.type.INT:
      return intval(ptr)
    default:
      error(token.start)
      break
  }
}

function intval(ptr) {
  var str = next(ptr, c.type.INT)  // str
  var end = next(ptr, c.type.END)

  if (str.type != c.type.STR || str.start == str.end) {
    error(str.start)
  }

  if (end.type != c.type.END) {
    error(end.start)
  }

  return parse_int(ptr, str.start, str.end)
}

function listval(ptr) {
  var list = []
  var token

  // eslint-disable-next-line
  while (true) {
    token = next(ptr, c.type.UNDEFINED)

    if (token.type == c.type.END) {
      break
    }

    list.push(select(ptr, token))
  }

  return list
}

function strval(ptr, token) {
  return ptr.buffer.slice(token.start, token.end)
}

function dictval(ptr) {
  var dict = Object.create(null)
  var token

  // eslint-disable-next-line
  while (true) {
    token = next(ptr, c.type.STR)  // key

    if (token.type == c.type.END) {
      break
    }

    if (token.type != c.type.STR) {
      error(token.start)
    }

    dict[strval(ptr, token).toString()] = select(ptr, next(ptr, c.type.UNDEFINED))
  }

  return dict
}

function error(pos) {
  throw new Error('Unexpected token at pos = ' + pos)
}
