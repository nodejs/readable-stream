'use strict'

const test = require('tape')
const { Writable } = require('../../lib/ours/index')

test('writable constructor set methods', function (t) {
  t.plan(5)

  let _writeCalled = false
  function _write(d, e, n) {
    _writeCalled = true
  }

  const w = new Writable({ write: _write })
  w.end(Buffer.from('blerg'))

  let _writevCalled = false
  let dLength = 0
  function _writev(d, n) {
    dLength = d.length
    _writevCalled = true
  }

  const w2 = new Writable({ writev: _writev })
  w2.cork()

  w2.write(Buffer.from('blerg'))
  w2.write(Buffer.from('blerg'))
  w2.end()

  setImmediate(function () {
    t.equal(w._write, _write)
    t.ok(_writeCalled)
    t.equal(w2._writev, _writev)
    t.equal(dLength, 2)
    t.ok(_writevCalled)
  })
})
