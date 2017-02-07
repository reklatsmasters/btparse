'use strict'

var test = require('tape')
var path = require('path')

var NODE_VER = parseInt(process.versions.node)

test.createStream().pipe(process.stdout)

require(path.join(__dirname, 'decode.js'))

if (NODE_VER >= 4) {
  require(path.join(__dirname, 'lazy.js'))
}
