## btparse [![Build Status](https://travis-ci.org/ReklatsMasters/btparse.svg?branch=master)](https://travis-ci.org/ReklatsMasters/btparse) [![npm](https://img.shields.io/npm/v/btparse.svg)](https://npmjs.org/package/btparse) [![license](https://img.shields.io/npm/l/btparse.svg)](https://npmjs.org/package/btparse) [![downloads](https://img.shields.io/npm/dm/btparse.svg)](https://npmjs.org/package/btparse)

A modern bencode parser focused on speed and perfomance. It used [`recursive descent parser`](https://en.wikipedia.org/wiki/Recursive_descent_parser), a kind of [`top-down`](https://en.wikipedia.org/wiki/Top-down_parsing) parsers.

## Usage

```js
// classic api
const decode = require('btparse')
// or you can use lazy parser
// const decode = require('btparse/lazy')

console.log(decode(torrent).info.name)

console.log(decode('d3:abcli13eee'))  // {abc: [ 13 ]}
```

## Perfomance
*nodejs 6.9.1 / windows 10 x64 / i5 4690*

|Library| op/s | ms (1e5 op) |
|-------|:---:|:---:|
|bencode| 109,484| 887 |
|btparse| 139,477 | 696 |
|btparse#lazy|159,597|594 |

## API

##### `decode(input: Buffer|String, opts: Options) -> Object|Number|Array|Buffer`
Parse and decode bencoded message.

* **`opts.depth: Number`**

Max parse depth for objects; default = `infinity`, min = `1`

```js
const decode = require('btparse')

console.log(decode('d2:abi2e2:bbd2:ccleee', {depth: 1}))  //  {ab: 2, bb: Buffer.from('d2:cclee')}
```

## Lazy

##### `decode(input: Buffer|String) -> Proxy<Object>|Number|Array|Buffer`
The main difference is that **all** buffers aren't decoded into a string in parsing time. Required nodejs 6+.

```js
const decode = require('btparse/lazy')


// get prop
console.log(decode(torrent).info.name)

// check prop
console.log('name' in decode(torrent).info)

// get all keys / props
console.log(Reflect.ownKeys(decode(torrent)))
```

## License

MIT, (c) Dmitry Tsvettsikh, 2017+
