'use strict'

const c = require('./const')
const parse_int = require('./parse-int')

const COLON = 58

module.exports = next

function find(d, chr, pos, len) {
  let i = pos

  while (i < len) {
    if (d[i] == chr) {
      return i
    }

    ++i
  }

  throw new Error('Invalid data: Missing delimiter')
}

/*@param char {number} */
function type(char) {
  switch (char) {
    case c.letter.d: // d
      return c.type.DICT
    case c.letter.l: // l
      return c.type.LIST
    case c.letter.i: // i
      return c.type.INT
    case c.letter.e: // e
      return c.type.END
    case c.digit.NUM0:
    case c.digit.NUM1:
    case c.digit.NUM2:
    case c.digit.NUM3:
    case c.digit.NUM4:
    case c.digit.NUM5:
    case c.digit.NUM6:
    case c.digit.NUM7:
    case c.digit.NUM8:
    case c.digit.NUM9:
    case c.MINUS:
      return c.type.STR
    default:
      break
  }

  return c.type.UNDEFINED
}

function token(type) {
  return {
    type,
    start: 0,
    end: 0
  }
}

function next(ptr, expected) {
  if (ptr.i >= ptr.length) {
    error(ptr.i)
  }

  const leaf = token(type(ptr.buffer[ptr.i]))
  leaf.start = leaf.end = ptr.i++

  if (leaf.type == c.type.UNDEFINED) {
    error(leaf.start)
  }

  if (leaf.type == c.type.STR) {
    if (expected == c.type.INT) {
      ptr.i = leaf.end = find(ptr.buffer, c.letter.e, ptr.i, ptr.length)

      return leaf
    }

    next_str(ptr, leaf)
  }

  return leaf
}

function next_str(ptr, leaf) {
  const size_start = ptr.i - 1
  const size_end = find(ptr.buffer, COLON, size_start, ptr.length)

  const size = parse_int(ptr, size_start, size_end)

  leaf.start = size_end + 1
  leaf.end = leaf.start + size

  if (size < 0 || leaf.end > ptr.length) {
    error(size_start)
  }

  ptr.i = leaf.end
}

function error(pos) {
  throw new Error('Unexpected token at pos = ' + pos)
}