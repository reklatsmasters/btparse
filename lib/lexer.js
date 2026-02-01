import integer from './parse-int.js';
import * as c from './const.js';

const COLON = 58;
const typemap = Object.fromEntries([
  [c.letter.d, c.type.DICT],
  [c.letter.l, c.type.LIST],
  [c.letter.i, c.type.INT],
  [c.letter.e, c.type.END],
  [c.digit.NUM0, c.type.STR],
  [c.digit.NUM1, c.type.STR],
  [c.digit.NUM2, c.type.STR],
  [c.digit.NUM3, c.type.STR],
  [c.digit.NUM4, c.type.STR],
  [c.digit.NUM5, c.type.STR],
  [c.digit.NUM6, c.type.STR],
  [c.digit.NUM7, c.type.STR],
  [c.digit.NUM8, c.type.STR],
  [c.digit.NUM9, c.type.STR],
  [c.MINUS, c.type.STR],
]);

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
  if (char in typemap) {
    return typemap[char];
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
