'use strict'

const { Readable } = require('../../lib/ours/index')
const { kReadableStreamSuiteName } = require('./symbols')
module.exports = function (t) {
  t.plan(2)
  const stream = new Readable()
  let calledRead = false
  stream._read = function () {
    t.notOk(calledRead)
    calledRead = true
    this.push(null)
  }
  stream.on('data', function () {
    throw new Error('should not ever get data')
  })
  stream.pause()
  setTimeout(function () {
    stream.on('end', function () {
      t.ok(calledRead)
    })
    stream.resume()
  })
}
module.exports[kReadableStreamSuiteName] = 'stream-end-paused'
