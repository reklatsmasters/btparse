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
┌─────────┬────────────────┬──────────────────┬───────────────────┬────────────────────────┬────────────────────────┬─────────┐
│ (index) │ Task name      │ Latency avg (ns) │ Latency med (ns)  │ Throughput avg (ops/s) │ Throughput med (ops/s) │ Samples │
├─────────┼────────────────┼──────────────────┼───────────────────┼────────────────────────┼────────────────────────┼─────────┤
│ 0       │ 'bencode'      │ '11039 ± 0.92%'  │ '9280.0 ± 254.00' │ '101444 ± 0.13%'       │ '107759 ± 2971'        │ 72468   │
│ 1       │ 'btparse'      │ '3709.3 ± 0.73%' │ '3467.0 ± 43.00'  │ '281595 ± 0.04%'       │ '288434 ± 3537'        │ 215675  │
│ 2       │ 'btparse#lazy' │ '3335.1 ± 0.50%' │ '3113.0 ± 45.00'  │ '313420 ± 0.03%'       │ '321234 ± 4678'        │ 239876  │
└─────────┴────────────────┴──────────────────┴───────────────────┴────────────────────────┴────────────────────────┴─────────┘
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
