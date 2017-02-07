'use strict'

const fs = require('fs')
const path = require('path')

const bencode = require('bencode')
const btparse = require('../')
const lazybtparse = require('../lazy')

const file = fs.readFileSync(path.join(__dirname, 'test.torrent'))

suite('decode', () => {
  bench('bencode', () => bencode.decode(file))

  bench('btparse', () => btparse(file))

  bench('btparse#lazy', () => lazybtparse(file))
})
