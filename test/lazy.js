/* eslint-disable camelcase */
/* eslint-disable n/prefer-global/process */
import test from 'tape';
import decode from '../lazy.js';

const test_if = (cond, title, impl) =>
  cond ? test(title, impl) : test.skip(title, impl);
const NODE_VER = Number.parseInt(process.versions.node, 10);

test_if(NODE_VER > 4, 'lazy dict', (t) => {
  const torrent = decode('d2:abi4e2:bci1e2:bei44e2:bble2:aale2:dxlee');

  t.true('ab' in torrent);
  t.is(torrent.ab, 4);
  t.is(torrent.x, undefined);
  t.deepEqual(Reflect.ownKeys(torrent).sort(), [
    'aa',
    'ab',
    'bb',
    'bc',
    'be',
    'dx',
  ]);
  t.deepEqual(torrent, {});

  t.end();
});

test_if(NODE_VER > 4, 'lazy list', (t) => {
  const torrent = decode('d2:abli4eee');

  t.deepEqual(torrent.ab, [4]);
  t.end();
});

test_if(NODE_VER > 4, 'lazy throws', (t) => {
  const torrent = decode('d2:abi4ee');

  t.throws(() => {
    torrent.x = 1;
  }, `You can't change prop x`);

  t.throws(() => {
    delete torrent.ab;
  }, `You can't delete prop ab`);

  t.end();
});
