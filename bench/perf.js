'use strict'

/* eslint-disable no-console */

const fs = require('fs')
const path = require('path')

const bencode = require('bencode')
const btparse = require('../')
const lazybtparse = require('../lazy')
const bencoding = require('bencoding')

const file = fs.readFileSync(path.join(__dirname, 'test.torrent'))

const time = 1e5

console.time('bencode')
for(let i = 0; i < time; ++i) {
  bencode.decode(file)
}
console.timeEnd('bencode')

console.time('btparse')
for(let i = 0; i < time; ++i) {
  btparse(file)
}
console.timeEnd('btparse')

console.time('btparse#lazy')
for(let i = 0; i < time; ++i) {
  lazybtparse(file)
}
console.timeEnd('btparse#lazy')

console.time('bencoding')
for(let i = 0; i < time; ++i) {
  bencoding.decode(file)
}
console.timeEnd('bencoding')
