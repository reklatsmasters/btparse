/* eslint-disable n/prefer-global/buffer */
import next from './lib/lexer.js';
import * as parser from './lib/parser.js';

export default function decode(buffer, options = {}) {
  if (typeof buffer === 'string') {
    buffer = Buffer.from(buffer);
  }

  const depth = options.depth >>> 0; // eslint-disable-line no-bitwise

  const ptr = {
    i: 0,
    buffer,
    length: buffer.length, // Save space in IC
    depth: depth < 1 ? Infinity : depth,
    curr_depth: 0, // eslint-disable-line camelcase
  };

  return parser.select(ptr, next(ptr, -1));
}
