import * as fs from 'node:fs';
import path from 'node:path';
import bencode from 'bencode';
import btparse from '../index.js';
import lazybtparse from '../lazy.js';

const file = fs.readFileSync(path.join(import.meta.dirname, 'test.torrent'));
const time = 1e5;

console.time('bencode');
for (let i = 0; i < time; ++i) {
  bencode.decode(file);
}

console.timeEnd('bencode');

console.time('btparse');
for (let i = 0; i < time; ++i) {
  btparse(file);
}

console.timeEnd('btparse');

console.time('btparse#lazy');
for (let i = 0; i < time; ++i) {
  lazybtparse(file);
}

console.timeEnd('btparse#lazy');
