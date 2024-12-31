'use strict'

/* replacement start */
const { Buffer } = require('buffer')

/* replacement end */

const { EventEmitter: EE } = require('events')
const { Readable, Writable } = require('../../lib/ours/index')
const { kReadableStreamSuiteName, kReadableStreamSuiteHasMultipleTests } = require('./symbols')
let run = 0
module.exports = function (test) {
  function runTest(highWaterMark, objectMode, produce) {
    test('run #' + ++run, (t) => {
      t.plan(4)
      const old = new EE()
      const r = new Readable({
        highWaterMark,
        objectMode
      })
      t.equal(r, r.wrap(old))
      let ended = false
      r.on('end', function () {
        ended = true
      })
      old.pause = function () {
        // console.error('old.pause()');
        old.emit('pause')
        flowing = false
      }
      old.resume = function () {
        // console.error('old.resume()');
        old.emit('resume')
        flow()
      }
      let flowing
      let chunks = 10
      let oldEnded = false
      const expected = []
      function flow() {
        flowing = true
        // eslint-disable-next-line no-unmodified-loop-condition
        while (flowing && chunks-- > 0) {
          const item = produce()
          expected.push(item)
          // console.log('old.emit', chunks, flowing);
          old.emit('data', item)
          // console.log('after emit', chunks, flowing);
        }
        if (chunks <= 0) {
          oldEnded = true
          // console.log('old end', chunks, flowing);
          old.emit('end')
        }
      }
      const w = new Writable({
        highWaterMark: highWaterMark * 2,
        objectMode
      })
      const written = []
      w._write = function (chunk, encoding, cb) {
        // console.log('_write', chunk);
        written.push(chunk)
        setTimeout(cb)
      }
      w.on('finish', function () {
        performAsserts()
      })
      r.pipe(w)
      flow()
      function performAsserts() {
        t.ok(ended)
        t.ok(oldEnded)
        t.deepEqual(written, expected)
      }
    })
  }
  runTest(100, false, function () {
    return Buffer.alloc(100)
  })
  runTest(10, false, function () {
    return Buffer.from('xxxxxxxxxx')
  })
  runTest(1, true, function () {
    return {
      foo: 'bar'
    }
  })
  const objectChunks = [
    5,
    'a',
    false,
    0,
    '',
    'xyz',
    {
      x: 4
    },
    7,
    [],
    555
  ]
  runTest(1, true, function () {
    return objectChunks.shift()
  })
}
module.exports[kReadableStreamSuiteName] = 'stream2-readable-wrap'
module.exports[kReadableStreamSuiteHasMultipleTests] = true
