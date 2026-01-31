import integer from './parse-int.js';
import * as c from './const.js';

const COLON = 58;

function find(d, chr, pos, length) {
  let i = pos;

  while (i < length) {
    if (d[i] === chr) {
      return i;
    }

    ++i;
  }

  throw new Error('Invalid data: Missing delimiter');
}

/* @param char {number} */
function type(char) {
  switch (char) {
    case c.letter.d: {
      return c.type.DICT;
    }

    case c.letter.l: {
      return c.type.LIST;
    }

    case c.letter.i: {
      return c.type.INT;
    }

    case c.letter.e: {
      return c.type.END;
    }

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
    case c.MINUS: {
      return c.type.STR;
    }

    default: {
      break;
    }
  }

  return c.type.UNDEFINED;
}

function token(type) {
  return { type, start: 0, end: 0 };
}

export default function next(ptr, expected) {
  if (ptr.i >= ptr.length) {
    error(ptr.i);
  }

  const leaf = token(type(ptr.buffer[ptr.i]));
  leaf.start = leaf.end = ptr.i++; // eslint-disable-line no-multi-assign

  if (leaf.type === c.type.UNDEFINED) {
    error(leaf.start);
  }

  if (leaf.type === c.type.STR) {
    if (expected === c.type.INT) {
      // eslint-disable-next-line no-multi-assign
      ptr.i = leaf.end = find(ptr.buffer, c.letter.e, ptr.i, ptr.length);

      return leaf;
    }

    nextString(ptr, leaf);
  }

  return leaf;
}

function nextString(ptr, leaf) {
  const startPtr = ptr.i - 1;
  const endPtr = find(ptr.buffer, COLON, startPtr, ptr.length);

  const size = integer(ptr, startPtr, endPtr);

  leaf.start = endPtr + 1;
  leaf.end = leaf.start + size;

  if (size < 0 || leaf.end > ptr.length) {
    error(startPtr);
  }

  ptr.i = leaf.end;
}

function error(pos) {
  throw new Error('Unexpected token at pos = ' + pos);
}
