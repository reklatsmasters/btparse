'use strict'

/* eslint-env es6,node */

var test = require('tape')
var decode = require('../lazy')

var test_if = (cond, title, impl) => cond ? test(title, impl) : test.skip(title, impl)
var NODE_VER = parseInt(process.versions.node)

test_if(NODE_VER > 4, 'lazy dict', t => {
  var torrent = decode('d2:abi4e2:bci1e2:bei44e2:bble2:aale2:dxlee')

  t.true('ab' in torrent)
  t.is(torrent.ab, 4)
  t.is(torrent.x, void 0)
  t.deepEqual(Reflect.ownKeys(torrent).sort(), ['aa', 'ab', 'bb', 'bc', 'be', 'dx'])
  t.deepEqual(torrent, {})

  t.end()
})

test_if(NODE_VER > 4,'lazy list', t => {
  var torrent = decode('d2:abli4eee')

  t.deepEqual(torrent.ab, [4])
  t.end()
})

test_if(NODE_VER > 4,'lazy throws', t => {
  var torrent = decode('d2:abi4ee')

  t.throws(() => {
    torrent.x = 1
  }, `You can't change prop x`)

  t.throws(() => {
    delete torrent.ab
  }, `You can't delete prop ab`)

  t.end()
})

