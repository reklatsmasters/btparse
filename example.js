import * as fs from 'node:fs';
import path from 'node:path';

import decode from './index.js';

const file = fs.readFileSync(path.join(import.meta.dirname, 'bench/test.torrent'))

console.log(decode(file).info.pieces);
