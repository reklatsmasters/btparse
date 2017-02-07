import test from 'ava'
import decode from '../'

test('int', t => {
  t.is(decode('i2e'), 2)
  t.is(decode('i-23e'), -23)

  t.throws(() => decode('i2'))
  t.throws(() => decode('ie'))
})

test('string', t => {
  t.is(Buffer.compare(decode('2:ab'), Buffer.from('ab')), 0)

  t.throws(() => decode('2:a'))
  t.throws(() => decode('-2:ab'))
})

test('list', t => {
  t.deepEqual(decode('le'), [])
  t.deepEqual(decode('li2ee'), [2])
  t.deepEqual(decode('li2e2:abe'), [2, Buffer.from('ab')])
  t.deepEqual(decode('lli1eee'), [[1]])
})

test('dict', t => {
  t.deepEqual(decode("d2:abi2ee"), {ab: 2})
  t.deepEqual(decode("d2:abli2eee"), {ab: [2]})
  t.deepEqual(decode("d2:ab2:cde"), {ab: Buffer.from('cd')})
  t.deepEqual(decode("d2:abdee"), {ab: {}})

  t.throws(() => decode("di1ei2ee"))
  t.throws(() => decode("dlei2ee"))
  t.throws(() => decode("ddei2ee"))
})
