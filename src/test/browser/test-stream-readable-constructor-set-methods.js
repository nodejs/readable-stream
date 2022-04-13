'use strict'

const test = require('tape')
const { Readable } = require('../../lib')

test('readable constructor set methods', function (t) {
  t.plan(2)

  let _readCalled = false

  function _read(n) {
    _readCalled = true
    this.push(null)
  }

  const r = new Readable({ read: _read })
  r.resume()

  setTimeout(function () {
    t.equal(r._read, _read)
    t.ok(_readCalled)
  })
})
