'use strict'

const stream = require('../../lib/ours/index')

const { kReadableStreamSuiteName } = require('./symbols')

module.exports = function (t) {
  t.plan(3)
  const reader = new stream.Readable()
  const writer1 = new stream.Writable()
  const writer2 = new stream.Writable() // 560000 is chosen here because it is larger than the (default) highWaterMark
  // and will cause `.write()` to return false
  // See: https://github.com/nodejs/node/issues/2323

  const buffer = Buffer.alloc(560000)

  reader._read = function () {}

  writer1._write = function (chunk, encoding, cb) {
    this.emit('chunk-received')
    cb()
  }

  writer1.on('chunk-received', function () {
    reader.unpipe(writer1)
    reader.pipe(writer2)
    reader.push(buffer)
    setImmediate(function () {
      reader.push(buffer)
      setImmediate(function () {
        reader.push(buffer)
      })
    })
  })

  writer2._write = function (chunk, encoding, cb) {
    t.ok(true)
    cb()
  }

  reader.pipe(writer1)
  reader.push(buffer)
}

module.exports[kReadableStreamSuiteName] = 'stream-pipe-cleanup-pause'
