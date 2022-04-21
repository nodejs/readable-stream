'use strict'

const test = require('tape')

const inherits = require('inherits')

const stream = require('../../lib/ours/index')

inherits(MyWritable, stream.Writable)

MyWritable.prototype._write = function (chunk, encoding, callback) {
  this.fn(Buffer.isBuffer(chunk), typeof chunk, encoding)
  callback()
}

function MyWritable(fn, options) {
  stream.Writable.call(this, options)
  this.fn = fn
}

test('defaultCondingIsUtf8', (t) => {
  t.plan(1)
  const m = new MyWritable(
    function (isBuffer, type, enc) {
      t.equal(enc, 'utf8')
    },
    {
      decodeStrings: false
    }
  )
  m.write('foo')
  m.end()
})
test('changeDefaultEncodingToAscii', (t) => {
  t.plan(1)
  const m = new MyWritable(
    function (isBuffer, type, enc) {
      t.equal(enc, 'ascii')
    },
    {
      decodeStrings: false
    }
  )
  m.setDefaultEncoding('ascii')
  m.write('bar')
  m.end()
})
test('changeDefaultEncodingToInvalidValue', (t) => {
  t.plan(1)
  t.throws(function () {
    const m = new MyWritable(function (isBuffer, type, enc) {}, {
      decodeStrings: false
    })
    m.setDefaultEncoding({})
    m.write('bar')
    m.end()
  }, TypeError)
})
test('checkVairableCaseEncoding', (t) => {
  t.plan(1)
  const m = new MyWritable(
    function (isBuffer, type, enc) {
      t.equal(enc, 'ascii')
    },
    {
      decodeStrings: false
    }
  )
  m.setDefaultEncoding('AsCii')
  m.write('bar')
  m.end()
})
