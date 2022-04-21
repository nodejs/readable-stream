'use strict'

const test = require('tape')
const inherits = require('inherits')
const { Transform } = require('../../lib/ours/index')

test('big packet', function (t) {
  t.plan(3)

  let passed = false

  function PassThrough() {
    Transform.call(this)
  }
  inherits(PassThrough, Transform)

  PassThrough.prototype._transform = function (chunk, encoding, done) {
    this.push(chunk)
    done()
  }

  function TestStream() {
    Transform.call(this)
  }
  inherits(TestStream, Transform)

  TestStream.prototype._transform = function (chunk, encoding, done) {
    if (!passed) {
      // Char 'a' only exists in the last write
      passed = indexOf(chunk.toString(), 'a') >= 0
    }
    if (passed) {
      t.ok(passed)
    }
    done()
  }

  const s1 = new PassThrough()
  const s2 = new PassThrough()
  const s3 = new TestStream()

  s1.pipe(s3)
  // Don't let s2 auto close which may close s3
  s2.pipe(s3, { end: false })

  // We must write a buffer larger than highWaterMark
  const big = Buffer.alloc(s1._writableState.highWaterMark + 1)
  big.fill('x')

  // Since big is larger than highWaterMark, it will be buffered internally.
  t.notOk(s1.write(big))

  // 'tiny' is small enough to pass through internal buffer.
  t.ok(s2.write('tiny'))

  // Write some small data in next IO loop, which will never be written to s3
  // Because 'drain' event is not emitted from s1 and s1 is still paused
  setImmediate(s1.write.bind(s1), 'later')

  function indexOf(xs, x) {
    for (let i = 0, l = xs.length; i < l; i++) {
      if (xs[i] === x) {
        return i
      }
    }
    return -1
  }
})
