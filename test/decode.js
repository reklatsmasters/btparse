/* eslint-disable n/prefer-global/buffer */
import test from 'tape';
import compare from 'buffer-compare';
import decode from '../index.js';

test('int', function (t) {
  t.equal(decode('i2e'), 2, 'number');
  t.equal(decode('i-23e'), -23, 'negative number');
  t.equal(decode('i0e'), 0, 'zero');
  t.equal(decode('i10e'), 10, 'number with zero');

  t.throws(function () {
    decode('i2');
  }, 'Invalid data: Missing delimiter');

  t.throws(function () {
    decode('ie');
  }, 'Unexpected token at pos = 2');

  t.throws(function () {
    decode('i-0e');
  }, 'negative zero');

  t.throws(function () {
    decode('i03e');
  }, 'zero prefixed number');

  t.throws(function () {
    decode('i-03e');
  }, 'zero prefixed negative number');

  t.end();
});

test('string', function (t) {
  t.is(compare(decode('2:ab'), Buffer.from('ab')), 0);

  t.throws(function () {
    decode('2:a');
  });
  t.throws(function () {
    decode('-2:ab');
  });

  t.end();
});

test('list', function (t) {
  t.deepEqual(decode('le'), []);
  t.deepEqual(decode('li2ee'), [2]);
  t.deepEqual(decode('li2e2:abe'), [2, Buffer.from('ab')]);
  t.deepEqual(decode('lli1eee'), [[1]]);

  t.end();
});

test('dict', function (t) {
  t.deepEqual(decode('d2:abi2ee'), { ab: 2 });
  t.deepEqual(decode('d2:abli2eee'), { ab: [2] });
  t.deepEqual(decode('d2:ab2:cde'), { ab: Buffer.from('cd') });
  t.deepEqual(decode('d2:abdee'), { ab: {} });

  t.throws(function () {
    decode('di1ei2ee');
  });
  t.throws(function () {
    decode('dlei2ee');
  });
  t.throws(function () {
    decode('ddei2ee');
  });

  t.end();
});

test('depth', function (t) {
  t.deepEqual(decode('d2:abi2e2:bbd2:ccleee', { depth: 0 }), {
    ab: 2,
    bb: { cc: [] },
  });
  t.deepEqual(decode('d2:abi2e2:bbd2:ccleee', { depth: 1 }), {
    ab: 2,
    bb: Buffer.from('d2:cclee'),
  });
  t.deepEqual(decode('d4:infod5:filesld6:lengthi1eeeee', { depth: 1 }), {
    info: Buffer.from('d5:filesld6:lengthi1eeee'),
  });

  t.end();
});

test('empty', function (t) {
  t.throws(function () {
    decode('');
  }, 'Unexpected token at pos = 0');

  t.throws(function () {
    decode([]);
  }, 'Unexpected token at pos = 0');

  t.end();
});
