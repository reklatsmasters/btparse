/* eslint-disable camelcase */
import * as c from './const.js';
import next from './lexer.js';
import * as avltree from './avltree.js';
import * as parser from './parser.js';

const handler = {
  get(tree, key) {
    if (typeof key === 'symbol') {
      return {};
    }

    const node = avltree.lookup(tree, key);

    if (node) {
      return node.value;
    }
  },
  ownKeys(tree) {
    return avltree.keys(tree);
  },
  has(tree, key) {
    if (typeof key === 'symbol') {
      return false;
    }

    return Boolean(avltree.lookup(tree, key));
  },
  set(target, key) {
    throw new Error(`You can't change prop ${key}`);
  },
  deleteProperty(target, key) {
    throw new Error(`You can't delete prop ${key}`);
  },
};

export function dictval(ptr) {
  let dict = null;

  while (true) {
    const token = next(ptr, c.type.STR);

    if (token.type === c.type.END) {
      break;
    }

    if (token.type !== c.type.STR) {
      error(token.start);
    }

    const key = parser.strval(ptr, token);
    const value = select(ptr, next(ptr, c.type.UNDEFINED));

    dict = avltree.add(dict, key, value);
  }

  return new Proxy(dict, handler);
}

export function select(ptr, token) {
  switch (token.type) {
    case c.type.STR: {
      return parser.strval(ptr, token);
    }

    case c.type.DICT: {
      return dictval(ptr);
    }

    case c.type.LIST: {
      return listval(ptr);
    }

    case c.type.INT: {
      return parser.intval(ptr);
    }

    default: {
      error(token.start);
      break;
    }
  }
}

export function listval(ptr) {
  const list = [];

  while (true) {
    const token = next(ptr, c.type.UNDEFINED);

    if (token.type === c.type.END) {
      break;
    }

    list.push(select(ptr, token));
  }

  return list;
}

function error(pos) {
  throw new Error('Unexpected token at pos = ' + pos);
}
