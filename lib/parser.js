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
      return dictval(ptr, token)
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
  var token

  token = next(ptr, c.type.INT)

  var str_type = token.type
  var str_start = token.start
  var str_end = token.end

  token = next(ptr, c.type.END)

  var end_type = token.type
  var end_start = token.start

  if (str_type != c.type.STR || str_start == str_end) {
    error(str_start)
  }

  if (end_type != c.type.END) {
    error(end_start)
  }

  return parse_int(ptr, str_start, str_end)
}

function listval(ptr) {
  var list = []
  var token
  var node

  // eslint-disable-next-line
  while (true) {
    token = next(ptr, c.type.UNDEFINED)

    if (token.type == c.type.END) {
      break
    }

    node = select(ptr, token)

    if (ptr.curr_depth <= ptr.depth) {
      list.push(node)
    }
  }

  return list
}

function strval(ptr, token) {
  return ptr.buffer.slice(token.start, token.end)
}

function dictval(ptr, start_token) {
  var dict = Object.create(null)
  var token, token_start = 0
  var start_token_start = start_token.start

  ++ptr.curr_depth

  // eslint-disable-next-line
  while (true) {
    token = next(ptr, c.type.STR)  // key
    token_start = token.start

    if (token.type == c.type.END) {
      break
    }

    if (token.type != c.type.STR) {
      error(token_start)
    }

    if (ptr.curr_depth <= ptr.depth) {
      dict[strval(ptr, token).toString()] = select(ptr, next(ptr, c.type.UNDEFINED))
    } else {
      select(ptr, next(ptr, c.type.UNDEFINED))
    }
  }

  if (ptr.curr_depth > ptr.depth) {
    dict = ptr.buffer.slice(start_token_start, token_start + 1)
  }

  --ptr.curr_depth
  return dict
}

function error(pos) {
  throw new Error('Unexpected token at pos = ' + pos)
}
