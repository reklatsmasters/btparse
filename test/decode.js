/* eslint-disable n/prefer-global/buffer */
import test from 'node:test';
import assert from 'node:assert/strict';
import compare from 'buffer-compare';
import decode from '../index.js';

test('int', function () {
  assert.equal(decode('i2e'), 2);
  assert.equal(decode('i-23e'), -23);
  assert.equal(decode('i0e'), 0);
  assert.equal(decode('i10e'), 10);

  assert.throws(() => decode('i2'), /Invalid data: Missing delimiter$/);
  assert.throws(() => decode('ie'), /Unexpected token at pos = 2$/);
  assert.throws(() => decode('i-0e'), 'negative zero');
  assert.throws(() => decode('i03e'), 'zero prefixed number');
  assert.throws(() => decode('i-03e'), 'zero prefixed negative number');
});

test('string', function () {
  assert.equal(compare(decode('2:ab'), Buffer.from('ab')), 0);

  assert.throws(() => decode('2:a'));
  assert.throws(() => decode('-2:ab'));
});

test('list', function () {
  assert.deepEqual(decode('le'), []);
  assert.deepEqual(decode('li2ee'), [2]);
  assert.deepEqual(decode('li2e2:abe'), [2, Buffer.from('ab')]);
  assert.deepEqual(decode('lli1eee'), [[1]]);
});

test('dict', function () {
  assert.deepEqual(decode('d2:abi2ee'), { ab: 2 });
  assert.deepEqual(decode('d2:abli2eee'), { ab: [2] });
  assert.deepEqual(decode('d2:ab2:cde'), { ab: Buffer.from('cd') });
  assert.deepEqual(decode('d2:abdee'), { ab: {} });

  assert.throws(() => decode('di1ei2ee'));
  assert.throws(() => decode('dlei2ee'));
  assert.throws(() => decode('ddei2ee'));
});

test('depth', function () {
  assert.deepEqual(decode('d2:abi2e2:bbd2:ccleee', { depth: 0 }), {
    ab: 2,
    bb: { cc: [] },
  });
  assert.deepEqual(decode('d2:abi2e2:bbd2:ccleee', { depth: 1 }), {
    ab: 2,
    bb: Buffer.from('d2:cclee'),
  });
  assert.deepEqual(decode('d4:infod5:filesld6:lengthi1eeeee', { depth: 1 }), {
    info: Buffer.from('d5:filesld6:lengthi1eeee'),
  });
});

test('empty', function () {
  assert.throws(() => decode(''), /Unexpected token at pos = 0$/);
  assert.throws(() => decode([]), /Unexpected token at pos = 0$/);
});
