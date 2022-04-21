'use strict'

const test = require('tape')
const crypto = require('crypto')
const inherits = require('inherits')
const stream = require('../../lib/ours/index')

test('unpipe drain', function (t) {
  try {
    crypto.randomBytes(9)
  } catch (_) {
    t.plan(1)
    t.ok(true, 'does not suport random, skipping')
    return
  }

  t.plan(2)

  function TestWriter() {
    stream.Writable.call(this)
  }
  inherits(TestWriter, stream.Writable)

  TestWriter.prototype._write = function (buffer, encoding, callback) {
    // console.log('write called');
    // super slow write stream (callback never called)
  }

  const dest = new TestWriter()

  function TestReader(id) {
    stream.Readable.call(this)
    this.reads = 0
  }
  inherits(TestReader, stream.Readable)

  TestReader.prototype._read = function (size) {
    this.reads += 1
    this.push(crypto.randomBytes(size))
  }

  const src1 = new TestReader()
  const src2 = new TestReader()

  src1.pipe(dest)

  src1.once('readable', function () {
    process.nextTick(function () {
      src2.pipe(dest)

      src2.once('readable', function () {
        process.nextTick(function () {
          src1.unpipe(dest)
        })
      })
    })
  })

  dest.on('unpipe', function () {
    t.equal(src1.reads, 2)
    t.equal(src2.reads, 1)
  })
})
