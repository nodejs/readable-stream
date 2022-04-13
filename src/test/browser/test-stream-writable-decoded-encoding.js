'use strict'

const test = require('tape')
const inherits = require('inherits')
const stream = require('../../lib')

function MyWritable(fn, options) {
  stream.Writable.call(this, options)
  this.fn = fn
}

inherits(MyWritable, stream.Writable)

MyWritable.prototype._write = function (chunk, encoding, callback) {
  this.fn(Buffer.isBuffer(chunk), typeof chunk, encoding)
  callback()
}

test('decodeStringsTrue', (t) => {
  t.plan(3)

  const m = new MyWritable(
    function (isBuffer, type, enc) {
      t.ok(isBuffer)
      t.equal(type, 'object')
      t.equal(enc, 'buffer')
      // console.log('ok - decoded string is decoded');
    },
    { decodeStrings: true }
  )
  m.write('some-text', 'utf8')
  m.end()
})

test('decodeStringsFalse', (t) => {
  t.plan(3)

  const m = new MyWritable(
    function (isBuffer, type, enc) {
      t.notOk(isBuffer)
      t.equal(type, 'string')
      t.equal(enc, 'utf8')
      // console.log('ok - un-decoded string is not decoded');
    },
    { decodeStrings: false }
  )
  m.write('some-text', 'utf8')
  m.end()
})
