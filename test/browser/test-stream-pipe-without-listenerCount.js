'use strict'

const { Stream } = require('../../lib/ours/index')

const { kReadableStreamSuiteName } = require('./symbols')

module.exports = function (t) {
  t.plan(1)
  const r = new Stream({
    read: function () {}
  })
  r.listenerCount = undefined
  const w = new Stream()
  w.on('pipe', function () {
    r.emit('error', new Error('Readable Error'))
  })
  t.throws(() => r.pipe(w), 'TypeError: this.listenerCount is not a function')
}

module.exports[kReadableStreamSuiteName] = 'stream-pipe-without-listenerCount'
