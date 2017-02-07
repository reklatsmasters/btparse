'use strict'

const next = require('./lexer')
const parser = require('./parser')
const avltree = require('./avltree')
const c = require('./const')

const handler = {
  get(tree, key) {
    if (typeof key === 'symbol') {
      return {}
    }

    const node = avltree.lookup(tree, key)

    if (node) {
      return node.value
    }
  },
  ownKeys(tree) {
    return avltree.keys(tree)
  },
  has(tree, key) {
    if (typeof key === 'symbol') {
      return false
    }

    return !!avltree.lookup(tree, key)
  },
  set(target, key) {
    throw new Error(`You can't change prop ${key}`)
  },
  deleteProperty(target, key) {
    throw new Error(`You can't delete prop ${key}`)
  }
}

module.exports = {
  dictval,
  select,
  listval
}

function dictval(ptr) {
  return dictval_internal(ptr, null, next(ptr, c.type.STR))
}

function dictval_internal(ptr, tree, token) {
  if (token.type == c.type.END) {
    return new Proxy(tree, handler)
  }

  if (token.type != c.type.STR) {
    error(token.start)
  }

  const key = parser.strval(ptr, token)
  const value = select(ptr, next(ptr, c.type.UNDEFINED))

  return dictval_internal(ptr, avltree.add(tree, key, value), next(ptr, c.type.STR))
}

function select(ptr, token) {
  switch (token.type) {
    case c.type.STR:
      return parser.strval(ptr, token)
    case c.type.DICT:
      return dictval(ptr)
    case c.type.LIST:
      return listval(ptr)
    case c.type.INT:
      return parser.intval(ptr)
    default:
      error(token.start)
      break
  }
}

function listval(ptr) {
  return listval_internal(ptr, [], next(ptr, c.type.UNDEFINED))
}

function listval_internal(ptr, list, token) {
  if (token.type == c.type.END) {
    return list
  }

  list.push(select(ptr, token))
  return listval_internal(ptr, list, next(ptr, c.type.UNDEFINED))
}

function error(pos) {
  throw new Error('Unexpected token at pos = ' + pos)
}
