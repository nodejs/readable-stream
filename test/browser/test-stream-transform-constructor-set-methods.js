'use strict'

const test = require('tape')
const { Transform } = require('../../lib/ours/index')

test('transform constructor set methods', function (t) {
  t.plan(4)

  let _transformCalled = false
  function _transform(d, e, n) {
    _transformCalled = true
    n()
  }

  let _flushCalled = false
  function _flush(n) {
    _flushCalled = true
    n()
  }

  const tr = new Transform({
    transform: _transform,
    flush: _flush
  })

  tr.end(Buffer.from('blerg'))
  tr.resume()

  tr.on('end', function () {
    t.equal(tr._transform, _transform)
    t.equal(tr._flush, _flush)
    t.ok(_transformCalled)
    t.ok(_flushCalled)
  })
})
