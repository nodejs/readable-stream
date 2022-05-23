'use strict'

const { Writable, Readable, Transform, finished } = require('../../lib/ours/index')

const { kReadableStreamSuiteName, kReadableStreamSuiteHasMultipleTests } = require('./symbols')

module.exports = function (test) {
  test('readable finished', function (t) {
    t.plan(1)
    const rs = new Readable({
      read: function read() {}
    })
    finished(rs, (err) => {
      t.ifErr(err)
    })
    rs.push(null)
    rs.resume()
  })
  test('writable finished', function (t) {
    t.plan(1)
    const ws = new Writable({
      write: function write(data, enc, cb) {
        cb()
      }
    })
    finished(ws, (err) => {
      t.ifErr(err)
    })
    ws.end()
  })
  test('transform finished', function (t) {
    t.plan(3)
    const tr = new Transform({
      transform: function transform(data, enc, cb) {
        cb()
      }
    })
    let finish = false
    let ended = false
    tr.on('end', function () {
      ended = true
    })
    tr.on('finish', function () {
      finish = true
    })
    finished(tr, (err) => {
      t.ifErr(err)
      t.ok(finish)
      t.ok(ended)
    })
    tr.end()
    tr.resume()
  })
}

module.exports[kReadableStreamSuiteName] = 'stream-finished'
module.exports[kReadableStreamSuiteHasMultipleTests] = true
