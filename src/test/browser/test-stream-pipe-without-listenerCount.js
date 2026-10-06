'use strict'

const { Stream } = require('../../lib/ours/index')
const { kReadableStreamSuiteName } = require('./symbols')

module.exports = function (t) {
  t.plan(1)

  const r = new Stream({
    read: function () {}
  })
  r.listenerCount = undefined
  r.on('error', function () {})

  const w = new Stream()
  w.on('pipe', function () {
    r.emit('error', new Error('Readable Error'))
  })

  t.doesNotThrow(() => r.pipe(w))
}

module.exports[kReadableStreamSuiteName] = 'stream-pipe-without-listenerCount'
