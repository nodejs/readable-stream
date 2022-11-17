'use strict'

/* replacement start */
const { Buffer } = require('buffer')

/* replacement end */

const { Readable, Writable, pipeline } = require('../../lib/ours/index')
const { kReadableStreamSuiteName, kReadableStreamSuiteHasMultipleTests } = require('./symbols')
module.exports = function (test) {
  test('pipeline', function (t) {
    t.plan(3)
    let finished = false
    const processed = []
    const expected = [Buffer.from('a'), Buffer.from('b'), Buffer.from('c')]
    const read = new Readable({
      read: function read() {}
    })
    const write = new Writable({
      write: function write(data, enc, cb) {
        processed.push(data)
        cb()
      }
    })
    write.on('finish', function () {
      finished = true
    })
    for (let i = 0; i < expected.length; i++) {
      read.push(expected[i])
    }
    read.push(null)
    pipeline(read, write, (err) => {
      t.ifErr(err)
      t.ok(finished)
      t.deepEqual(processed, expected)
    })
  })
  test('pipeline missing args', function (t) {
    t.plan(3)
    const _read = new Readable({
      read: function read() {}
    })
    t.throws(function () {
      pipeline(_read, function () {})
    })
    t.throws(function () {
      pipeline(function () {})
    })
    t.throws(function () {
      pipeline()
    })
  })
  test('pipeline error', function (t) {
    t.plan(1)
    const _read2 = new Readable({
      read: function read() {}
    })
    const _write = new Writable({
      write: function write(data, enc, cb) {
        cb()
      }
    })
    _read2.push('data')
    setImmediate(function () {
      return _read2.destroy()
    })
    pipeline(_read2, _write, (err) => {
      t.equal(err.message, 'Premature close')
    })
  })
  test('pipeline destroy', function (t) {
    t.plan(2)
    const _read3 = new Readable({
      read: function read() {}
    })
    const _write2 = new Writable({
      write: function write(data, enc, cb) {
        cb()
      }
    })
    _read3.push('data')
    setImmediate(function () {
      return _read3.destroy(new Error('kaboom'))
    })
    const dst = pipeline(_read3, _write2, (err) => {
      t.equal(err.message, 'kaboom')
    })
    t.equal(dst, _write2)
  })
}
module.exports[kReadableStreamSuiteName] = 'stream-pipeline'
module.exports[kReadableStreamSuiteHasMultipleTests] = true
