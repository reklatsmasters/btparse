import { digit, MINUS } from './const.js';

const { NUM0, NUM9 } = digit;

/**
 * Parse integer from buffer.
 * @param {*} ptr
 * @param {number} start
 * @param {number} end
 * @returns
 */
export default function integer(ptr, start, end) {
  let sign = 1;
  let number_ = 0;
  let byte = 0;
  let i = start;
  const length = end - start;

  if (end >= ptr.length) {
    error(end);
  }

  for (; i < end; ++i) {
    byte = ptr.buffer[i];

    if (i === start && byte === MINUS) {
      sign = -1;
      continue;
    }

    if (
      byte === NUM0 &&
      length > 1 &&
      (i === start || (sign < 0 && i === start + 1))
    ) {
      error(i);
    }

    if (byte >= NUM0 && byte <= NUM9) {
      number_ = number_ * 10 + (byte - NUM0);
      continue;
    }

    error(i);
  }

  return number_ * sign;
}

function error(i) {
  throw new Error('invalid digit at pos = ' + i);
}
