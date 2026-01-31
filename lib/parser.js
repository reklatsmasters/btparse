/* eslint-disable camelcase */
import integer from './parse-int.js';
import * as c from './const.js';
import next from './lexer.js';

export function select(ptr, token) {
  switch (token.type) {
    case c.type.STR: {
      return strval(ptr, token);
    }

    case c.type.DICT: {
      return dictval(ptr, token);
    }

    case c.type.LIST: {
      return listval(ptr);
    }

    case c.type.INT: {
      return intval(ptr);
    }

    default: {
      error(token.start);
      break;
    }
  }
}

export function intval(ptr) {
  let token = next(ptr, c.type.INT);

  const string_type = token.type;
  const string_start = token.start;
  const string_end = token.end;

  token = next(ptr, c.type.END);

  const end_type = token.type;
  const end_start = token.start;

  if (string_type !== c.type.STR || string_start === string_end) {
    error(string_start);
  }

  if (end_type !== c.type.END) {
    error(end_start);
  }

  return integer(ptr, string_start, string_end);
}

export function listval(ptr) {
  const list = [];
  let token;
  let node;

  while (true) {
    token = next(ptr, c.type.UNDEFINED);

    if (token.type === c.type.END) {
      break;
    }

    node = select(ptr, token);

    if (ptr.curr_depth <= ptr.depth) {
      list.push(node);
    }
  }

  return list;
}

export function strval(ptr, token) {
  return ptr.buffer.subarray(token.start, token.end);
}

export function dictval(ptr, start_token) {
  let dict = Object.create(null);
  let token;
  let token_start = 0;
  const start_token_start = start_token.start;

  ++ptr.curr_depth;

  while (true) {
    token = next(ptr, c.type.STR); // Key
    token_start = token.start;

    if (token.type === c.type.END) {
      break;
    }

    if (token.type !== c.type.STR) {
      error(token_start);
    }

    if (ptr.curr_depth <= ptr.depth) {
      dict[strval(ptr, token).toString('ascii')] = select(
        ptr,
        next(ptr, c.type.UNDEFINED),
      );
    } else {
      select(ptr, next(ptr, c.type.UNDEFINED));
    }
  }

  if (ptr.curr_depth > ptr.depth) {
    dict = ptr.buffer.subarray(start_token_start, token_start + 1);
  }

  --ptr.curr_depth;
  return dict;
}

function error(pos) {
  throw new Error('Unexpected token at pos = ' + pos);
}
