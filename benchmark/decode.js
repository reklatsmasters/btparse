var fs        = require( 'fs' )

var btparse     = require( '../' )
var bencode     = require( 'bencode' )
var bencoding   = require( 'bencoding' )
var dht_bencode = require( 'dht-bencode' )
var bncode      = require( 'bncode' )
var dht         = require( 'dht.js/lib/dht/bencode' )

var buffer = fs.readFileSync( __dirname + '/test.torrent' )

suite('decode to buffer', function() {
    bench('bencode', function() {
        bencode.decode( buffer )
    })
    bench('bencoding', function() {
        var v = bencoding.decode( buffer )
    })
    bench('dht_bencode', function() {
        dht_bencode.bdecode( buffer )
    })
    bench('bncode', function() {
        bncode.decode( buffer )
    })
    bench('dht', function() {
        dht.decode( buffer )
    })
    bench('btparse', function() {
        btparse.decode( buffer )
    })
})

suite('decode to utf8', function() {
    bench('bencode', function() {
        bencode.decode( buffer, 'utf8' )
    })
    bench('btparse', function() {
        btparse.decode( buffer, true )
    })
})
