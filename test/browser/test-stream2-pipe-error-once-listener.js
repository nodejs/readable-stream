'use strict'

const inherits = require('inherits')

const stream = require('../../lib/ours/index')

const { kReadableStreamSuiteName } = require('./symbols')

module.exports = function (t) {
  t.plan(1)

  const Read = function () {
    stream.Readable.call(this)
  }

  inherits(Read, stream.Readable)

  Read.prototype._read = function (size) {
    this.push('x')
    this.push(null)
  }

  const Write = function () {
    stream.Writable.call(this)
  }

  inherits(Write, stream.Writable)

  Write.prototype._write = function (buffer, encoding, cb) {
    this.emit('error', new Error('boom'))
    this.emit('alldone')
  }

  const read = new Read()
  const write = new Write()
  write.once('error', () => {})
  write.once('alldone', function () {
    t.ok(true)
  })
  read.pipe(write)
}

module.exports[kReadableStreamSuiteName] = 'stream2-pipe-error-once-listener'
