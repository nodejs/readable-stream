/* replacement start */
const { Buffer } = require('buffer')
/* replacement end */

;('use strict')

const inherits = require('inherits')

const { Readable } = require('../../lib/ours/index')

const { kReadableStreamSuiteName } = require('./symbols')

module.exports = function (t) {
  t.plan(1)
  let ondataCalled = 0

  function TestReader() {
    Readable.apply(this)
    this._buffer = Buffer.alloc(100)

    this._buffer.fill('x')

    this.on('data', function () {
      ondataCalled++
    })
  }

  inherits(TestReader, Readable)

  TestReader.prototype._read = function (n) {
    this.push(this._buffer)
    this._buffer = Buffer.alloc(0)
  }

  setTimeout(function () {
    t.equal(ondataCalled, 1)
  })
  new TestReader().read()
}

module.exports[kReadableStreamSuiteName] = 'stream2-compatibility'
