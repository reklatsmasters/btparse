'use strict'

const fs = require('fs')
const path = require('path')

const lazybtparse = require('./lazy')

const file = fs.readFileSync(path.join(__dirname, 'bench/test.torrent'))

console.log(lazybtparse(file).info.pieces)
