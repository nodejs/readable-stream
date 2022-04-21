'use strict'

const test = require('tape')

const { EventEmitter: EE } = require('events')

const Readable = require('../../lib/ours/index')

test('wrap empty', function (t) {
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
})
