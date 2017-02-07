import test from 'ava'
import decode from '../lazy'

const test_if = (cond, title, impl) => cond ? test.skip(title, impl) : test(title, impl)
const NODE_VER = parseInt(process.versions.node)

test_if(NODE_VER == 4, 'dict', t => {
  const torrent = decode('d2:abi4e2:bci1e2:bei44e2:bble2:aale2:dxlee')

  t.true('ab' in torrent)
  t.is(torrent.ab, 4)
  t.is(torrent.x, void 0)
  t.deepEqual(Reflect.ownKeys(torrent).sort(), ['aa', 'ab', 'bb', 'bc', 'be', 'dx'])
  t.deepEqual(torrent, {})
})

test_if(NODE_VER == 4,'list', t => {
  const torrent = decode('d2:abli4eee')

  t.deepEqual(torrent.ab, [4])
})

test_if(NODE_VER == 4,'throws', t => {
  const torrent = decode('d2:abi4ee')

  t.throws(() => {
    torrent.x = 1
  }, `You can't change prop x`)

  t.throws(() => {
    delete torrent.ab
  }, `You can't delete prop ab`)
})

