## btparse [![Build Status](https://travis-ci.org/reklatsmasters/btparse.svg?branch=master)](https://travis-ci.org/reklatsmasters/btparse) [![npm](https://img.shields.io/npm/v/btparse.svg)](https://npmjs.org/package/btparse) [![license](https://img.shields.io/npm/l/btparse.svg)](https://npmjs.org/package/btparse) [![downloads](https://img.shields.io/npm/dm/btparse.svg)](https://npmjs.org/package/btparse)

A modern bencode parser focused on speed and perfomance. It used [`recursive descent parser`](https://en.wikipedia.org/wiki/Recursive_descent_parser), a kind of [`top-down`](https://en.wikipedia.org/wiki/Top-down_parsing) parsers.

## Usage

```js
// classic api
import decode from 'btparse';
// or you can use lazy parser
import decode from 'btparse/lazy';

console.log(decode(torrent).info.name)

console.log(decode('d3:abcli13eee'))  // {abc: [ 13 ]}
```

## Perfomance

*nodejs 22 / ubuntu 22 / i5 4690*

```
┌────────────────┬──────────────────┬───────────────────┬────────────────────────┬────────────────────────┬─────────┐
│ Task name      │ Latency avg (ns) │ Latency med (ns)  │ Throughput avg (ops/s) │ Throughput med (ops/s) │ Samples │
├────────────────┼──────────────────┼───────────────────┼────────────────────────┼────────────────────────┼─────────┤
│ 'bencode'      │ '12449 ± 4.47%'  │ '9560.5 ± 505.50' │ '96067 ± 0.51%'        │ '104597 ± 5675'        │ 8034    │
│ 'btparse'      │ '4379.3 ± 1.50%' │ '3921.0 ± 41.00'  │ '243364 ± 0.17%'       │ '255037 ± 2695'        │ 26886   │
│ 'btparse#lazy' │ '3369.0 ± 2.97%' │ '3143.0 ± 40.00'  │ '311258 ± 0.07%'       │ '318167 ± 4101'        │ 33297   │
└────────────────┴──────────────────┴───────────────────┴────────────────────────┴────────────────────────┴─────────┘
```
## API

##### `decode(input: Buffer|String, opts: Options) -> Object|Number|Array|Buffer`
Parse and decode bencoded message.

* **`opts.depth: Number`**

Max parse depth for objects; default = `infinity`, min = `1`

```js
import decode from 'btparse';

console.log(decode('d2:abi2e2:bbd2:ccleee', {depth: 1}))  //  {ab: 2, bb: Buffer.from('d2:cclee')}
```

## Lazy

##### `decode(input: Buffer|String) -> Proxy<Object>|Number|Array|Buffer`
The main difference is that dictionary keys doesn't decoded into a strings.

```js
import decode from 'btparse/lazy';


// get prop
console.log(decode(torrent).info.name);

// check prop
console.log('name' in decode(torrent).info);

// get all keys / props
console.log(Reflect.ownKeys(decode(torrent)));
```

## License

MIT, (c) Dmitry Tsvettsikh, 2017 - 2026
