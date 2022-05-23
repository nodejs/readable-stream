'use strict'

const { Readable } = require('../../lib/ours/index')

const { kReadableStreamSuiteName } = require('./symbols')

module.exports = function (t) {
  t.plan(1)
  const s = new Readable({
    highWaterMark: 20,
    encoding: 'ascii'
  })
  const list = ['1', '2', '3', '4', '5', '6']

  s._read = function (n) {
    const one = list.shift()

    if (!one) {
      s.push(null)
    } else {
      const two = list.shift()
      s.push(one)
      s.push(two)
    }
  }

  s.read(0)
  setTimeout(function () {
    t.equals(s._readableState.buffer.join(','), '1,2,3,4,5,6')
  })
}

module.exports[kReadableStreamSuiteName] = 'stream-push-order'
