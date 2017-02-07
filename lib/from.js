'use strict'

module.exports = typeof Buffer.from == 'function' ? Buffer.from : from

// ported from `safe-buffer`
function from(arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}
