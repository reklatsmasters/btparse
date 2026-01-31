/* eslint-disable n/prefer-global/buffer */
import next from './lib/lexer.js';
import * as parser from './lib/lazy.js';

export default function decode(data) {
  const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);

  const ptr = {
    i: 0,
    buffer,
    length: buffer.length, // Save space in IC
  };

  return parser.select(ptr, next(ptr, -1));
}
