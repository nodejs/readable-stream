'use strict'

const { EventEmitter: EE } = require('events')
const Readable = require('../../lib/ours/index')
const { kReadableStreamSuiteName } = require('./symbols')

module.exports = function (t) {
  t.plan(1)

  const oldStream = new EE()
  oldStream.pause = function () {}
  oldStream.resume = function () {}

  const newStream = new Readable().wrap(oldStream)

  newStream
    .on('readable', function () {})
    .on('end', function () {
      t.ok(true, 'ended')
    })

  oldStream.emit('end')
}

module.exports[kReadableStreamSuiteName] = 'stream2-readable-wrap-empty'
