'use strict'

const { Readable } = require('../../lib/ours/index')
const { kReadableStreamSuiteName } = require('./symbols')
module.exports = function (t) {
  t.plan(10)
  const str = 'asdfasdfasdfasdfasdf'
  const r = new Readable({
    highWaterMark: 5,
    encoding: 'utf8'
  })
  let reads = 0
  let eofed = false
  let ended = false
  r._read = function (n) {
    if (reads === 0) {
      setTimeout(function () {
        r.push(str)
      })
      reads++
    } else if (reads === 1) {
      const ret = r.push(str)
      t.equal(ret, false)
      reads++
    } else {
      t.notOk(eofed)
      eofed = true
      r.push(null)
    }
  }
  r.on('end', function () {
    ended = true
  })

  // push some data in to start.
  // we've never gotten any read event at this point.
  const ret = r.push(str)

  // should be false.  > hwm
  t.notOk(ret)
  let chunk = r.read()
  t.equal(chunk, str)
  chunk = r.read()
  t.equal(chunk, null)
  r.once('readable', function () {
    // this time, we'll get *all* the remaining data, because
    // it's been added synchronously, as the read WOULD take
    // us below the hwm, and so it triggered a _read() again,
    // which synchronously added more, which we then return.
    chunk = r.read()
    t.equal(chunk, str + str)
    chunk = r.read()
    t.equal(chunk, null)
  })
  r.on('end', function () {
    t.ok(eofed)
    t.ok(ended)
    t.equal(reads, 2)
  })
}
module.exports[kReadableStreamSuiteName] = 'stream-big-push'
