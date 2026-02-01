import * as fs from 'node:fs';
import path from 'node:path';
import { Bench } from 'tinybench';
import bencode from 'bencode';
import btparse from '../index.js';
import lazybtparse from '../lazy.js';

const file = fs.readFileSync(path.join(import.meta.dirname, 'test.torrent'));
const bench = new Bench({ name: 'torrent parsers bench', time: 800 });

bench
  .add('bencode', () => bencode.decode(file))
  .add('btparse', () => btparse(file))
  .add('btparse#lazy', () => lazybtparse(file));

await bench.run();

console.log(bench.name);
console.table(bench.table());
