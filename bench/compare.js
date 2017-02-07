'use strict'

const buffer1 = Buffer.from('554bf9c7-09bc-4282-b6f2-314fc9d0a3fe')
const buffer2 = Buffer.from('554bf9c7-09bc-4282-b6f2-314fc9d0a3fg')

const time = 1e6

function sum(a, b) {
  return a + b
}

console.time('Buffer.compare')
for(let i = 0; i < time; ++i) {
  sum(Buffer.compare(buffer1, buffer2), i)
}
console.timeEnd('Buffer.compare')

console.time('compare')
for(let i = 0; i < time; ++i) {
  sum(compare(buffer1, buffer2), i)
}
console.timeEnd('compare')

function compare(b1, b2) {
  if (b1 === b2) {
    return 0
  }

  return compare_internal(b1, 0, b1.length, b2, 0, b2.length)
}

function compare_internal(b1, i1, len1, b2, i2, len2) {
  if (i1 === len1 && i2 === len2) {
    return 0
  } else if (i1 === len1) {
    return -1
  } else if (i2 === len2) {
    return 1
  }

  const char1 = b1[i1]
  const char2 = b2[i2]

  if (char1 > char2) {
    return 1
  } else if (char1 < char2) {
    return -1
  }

  return compare_internal(b1, i1 + 1, len1, b2, i2 + 1, len2)
}
