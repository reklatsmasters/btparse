## btparse
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
*windows 10/x64 i5 4690*

|Library| op/s | ms (1e5 op) |
|-------|:---:|:---:|
|bencode| 109,484| 887 |
|btparse| 139,477 | 696 |
|btparse#lazy|159,597|594 |

## API

##### `decode(input: Buffer|String) -> Object|Number|Array|Buffer`
Parse and decode bencoded message.

## Lazy

##### `decode(input: Buffer|String) -> Proxy<Object>|Number|Array|Buffer`
The main difference is that **all** buffers aren't decoded into a string in parsing time. Other entities parsed as in the main api. Required nodejs 6+.

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
MIT 
