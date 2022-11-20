'use strict'

const inherits = require('inherits')
const { Readable, Writable } = require('../../lib/ours/index')
const { kReadableStreamSuiteName } = require('./symbols')
module.exports = function (t) {
  t.plan(4)
  function TestReadable(opt) {
    if (!(this instanceof TestReadable)) {
      return new TestReadable(opt)
    }
    Readable.call(this, opt)
    this._ended = false
  }
  inherits(TestReadable, Readable)
  TestReadable.prototype._read = function (n) {
    if (this._ended) {
      this.emit('error', new Error('_read called twice'))
    }
    this._ended = true
    this.push(null)
  }
  function TestWritable(opt) {
    if (!(this instanceof TestWritable)) {
      return new TestWritable(opt)
    }
    Writable.call(this, opt)
    this._written = []
  }
  inherits(TestWritable, Writable)
  TestWritable.prototype._write = function (chunk, encoding, cb) {
    this._written.push(chunk)
    cb()
  }

  // this one should not emit 'end' until we read() from it later.
  const ender = new TestReadable()
  let enderEnded = false

  // what happens when you pipe() a Readable that's already ended?
  const piper = new TestReadable()
  // pushes EOF null, and length=0, so this will trigger 'end'
  piper.read()
  setTimeout(function () {
    ender.on('end', function () {
      enderEnded = true
      t.ok(true, 'enderEnded')
    })
    t.notOk(enderEnded)
    const c = ender.read()
    t.equal(c, null)
    const w = new TestWritable()
    w.on('finish', function () {
      t.ok(true, 'writableFinished')
    })
    piper.pipe(w)
  })
}
module.exports[kReadableStreamSuiteName] = 'stream-pipe-after-end'
