'use strict'

const inherits = require('inherits')
const { Readable } = require('../../lib/ours/index')
const { kReadableStreamSuiteName } = require('./symbols')
module.exports = function (t) {
  t.plan(2)
  function MyStream(options) {
    Readable.call(this, options)
    this._chunks = 3
  }
  inherits(MyStream, Readable)
  MyStream.prototype._read = function (n) {
    switch (this._chunks--) {
      case 0:
        return this.push(null)
      case 1:
        return setTimeout(
          function () {
            this.push('last chunk')
          }.bind(this),
          100
        )
      case 2:
        return this.push('second to last chunk')
      case 3:
        return process.nextTick(
          function () {
            this.push('first chunk')
          }.bind(this)
        )
      default:
        throw new Error('?')
    }
  }
  const expect = ['first chunksecond to last chunk', 'last chunk']
  const ms = new MyStream()
  const results = []
  ms.on('readable', function () {
    let chunk
    while ((chunk = ms.read()) !== null) {
      results.push(chunk + '')
    }
  })
  ms.on('end', function () {
    t.equal(ms._chunks, -1)
    t.deepEqual(results, expect)
  })
}
module.exports[kReadableStreamSuiteName] = 'stream-push-strings'
