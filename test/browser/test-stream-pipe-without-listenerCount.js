'use strict'

const test = require('tape')
const { Stream } = require('../../lib')

test('pipe without listenerCount on read', function (t) {
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
})
