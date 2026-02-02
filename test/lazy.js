import test from 'node:test';
import assert from 'node:assert/strict';
import decode from '../lazy.js';

test('lazy dict', () => {
  const torrent = decode('d2:abi4e2:bci1e2:bei44e2:bble2:aale2:dxlee');

  assert.ok('ab' in torrent);
  assert.equal(torrent.ab, 4);
  assert.equal(torrent.x, undefined);
  assert.deepEqual(Reflect.ownKeys(torrent).sort(), [
    'aa',
    'ab',
    'bb',
    'bc',
    'be',
    'dx',
  ]);
  assert.deepEqual(torrent, {});
});

test('lazy list', () => {
  const torrent = decode('d2:abli4eee');

  assert.deepEqual(torrent.ab, [4]);
});

test('lazy throws', () => {
  const torrent = decode('d2:abi4ee');

  assert.throws(() => {
    torrent.x = 1;
  }, /You can't change prop x$/);

  assert.throws(() => {
    delete torrent.ab;
  }, /You can't delete prop ab$/);
});
