'use strict'

const { PassThrough } = require('../../lib/ours/index')

const { kReadableStreamSuiteName } = require('./symbols')

module.exports = function (t) {
  t.plan(13)
  const src = new PassThrough({
    objectMode: true
  })
  const tx = new PassThrough({
    objectMode: true
  })
  const dest = new PassThrough({
    objectMode: true
  })
  const expect = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const results = []
  dest.on('end', function () {
    t.deepEqual(results, expect)
  })
  dest.on('data', function (x) {
    results.push(x)
  })
  src.pipe(tx).pipe(dest)
  let i = -1
  const int = setInterval(function () {
    if (i > 10) {
      src.end()
      clearInterval(int)
    } else {
      t.ok(true)
      src.write(i++)
    }
  }, 10)
}

module.exports[kReadableStreamSuiteName] = 'stream-transform-objectmode-falsey-value'
