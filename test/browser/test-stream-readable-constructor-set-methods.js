'use strict'

const { Readable } = require('../../lib/ours/index')

const { kReadableStreamSuiteName } = require('./symbols')

module.exports = function (t) {
  t.plan(2)
  let _readCalled = false

  function _read(n) {
    _readCalled = true
    this.push(null)
  }

  const r = new Readable({
    read: _read
  })
  r.resume()
  setTimeout(function () {
    t.equal(r._read, _read)
    t.ok(_readCalled)
  })
}

module.exports[kReadableStreamSuiteName] = 'stream-readable-constructor-set-methods'
