'use strict'

const { Readable } = require('../../lib/ours/index')

const { kReadableStreamSuiteName } = require('./symbols')

module.exports = function (t) {
  t.plan(1)
  const r = new Readable()
  let nChunks = 10
  const chunk = Buffer.alloc(10)
  chunk.fill('x')

  r._read = function (n) {
    setTimeout(function () {
      r.push(--nChunks === 0 ? null : chunk)
    })
  }

  let readAll = false
  const seen = []
  r.on('readable', function () {
    let chunk

    while ((chunk = r.read())) {
      seen.push(chunk.toString()) // simulate only reading a certain amount of the data,
      // and then putting the rest of the chunk back into the
      // stream, like a parser might do.  We just fill it with
      // 'y' so that it's easy to see which bits were touched,
      // and which were not.

      const putBack = Buffer.alloc(readAll ? 0 : 5)
      putBack.fill('y')
      readAll = !readAll
      r.unshift(putBack)
    }
  })
  const expect = [
    'xxxxxxxxxx',
    'yyyyy',
    'xxxxxxxxxx',
    'yyyyy',
    'xxxxxxxxxx',
    'yyyyy',
    'xxxxxxxxxx',
    'yyyyy',
    'xxxxxxxxxx',
    'yyyyy',
    'xxxxxxxxxx',
    'yyyyy',
    'xxxxxxxxxx',
    'yyyyy',
    'xxxxxxxxxx',
    'yyyyy',
    'xxxxxxxxxx',
    'yyyyy'
  ]
  r.on('end', function () {
    t.deepEqual(seen, expect)
  })
}

module.exports[kReadableStreamSuiteName] = 'stream-unshift-empty-chunk'
