'use strict'

const { Readable, Writable } = require('../../lib/ours/index')
const { kReadableStreamSuiteName, kReadableStreamSuiteHasMultipleTests } = require('./symbols')
function forEach(xs, f) {
  for (let i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i)
  }
}
function toArray(callback) {
  const stream = new Writable({
    objectMode: true
  })
  const list = []
  stream.write = function (chunk) {
    list.push(chunk)
  }
  stream.end = function () {
    callback(list)
  }
  return stream
}
function fromArray(list) {
  const r = new Readable({
    objectMode: true
  })
  r._read = noop
  forEach(list, function (chunk) {
    r.push(chunk)
  })
  r.push(null)
  return r
}
function noop() {}
module.exports = function (test) {
  test('can read objects from stream', function (t) {
    t.plan(3)
    const r = fromArray([
      {
        one: '1'
      },
      {
        two: '2'
      }
    ])
    const v1 = r.read()
    const v2 = r.read()
    const v3 = r.read()
    t.deepEqual(v1, {
      one: '1'
    })
    t.deepEqual(v2, {
      two: '2'
    })
    t.deepEqual(v3, null)
  })
  test('can pipe objects into stream', function (t) {
    t.plan(1)
    const r = fromArray([
      {
        one: '1'
      },
      {
        two: '2'
      }
    ])
    r.pipe(
      toArray(function (list) {
        t.deepEqual(list, [
          {
            one: '1'
          },
          {
            two: '2'
          }
        ])
      })
    )
  })
  test('read(n) is ignored', function (t) {
    t.plan(1)
    const r = fromArray([
      {
        one: '1'
      },
      {
        two: '2'
      }
    ])
    const value = r.read(2)
    t.deepEqual(value, {
      one: '1'
    })
  })
  test('can read objects from _read (sync)', function (t) {
    t.plan(1)
    const r = new Readable({
      objectMode: true
    })
    const list = [
      {
        one: '1'
      },
      {
        two: '2'
      }
    ]
    r._read = function (n) {
      const item = list.shift()
      r.push(item || null)
    }
    r.pipe(
      toArray(function (list) {
        t.deepEqual(list, [
          {
            one: '1'
          },
          {
            two: '2'
          }
        ])
      })
    )
  })
  test('can read objects from _read (async)', function (t) {
    t.plan(1)
    const r = new Readable({
      objectMode: true
    })
    const list = [
      {
        one: '1'
      },
      {
        two: '2'
      }
    ]
    r._read = function (n) {
      const item = list.shift()
      process.nextTick(function () {
        r.push(item || null)
      })
    }
    r.pipe(
      toArray(function (list) {
        t.deepEqual(list, [
          {
            one: '1'
          },
          {
            two: '2'
          }
        ])
      })
    )
  })
  test('can read strings as objects', function (t) {
    t.plan(1)
    const r = new Readable({
      objectMode: true
    })
    r._read = noop
    const list = ['one', 'two', 'three']
    forEach(list, function (str) {
      r.push(str)
    })
    r.push(null)
    r.pipe(
      toArray(function (array) {
        t.deepEqual(array, list)
      })
    )
  })
  test('read(0) for object streams', function (t) {
    t.plan(1)
    const r = new Readable({
      objectMode: true
    })
    r._read = noop
    r.push('foobar')
    r.push(null)
    r.read(0)
    r.pipe(
      toArray(function (array) {
        t.deepEqual(array, ['foobar'])
      })
    )
  })
  test('falsey values', function (t) {
    t.plan(1)
    const r = new Readable({
      objectMode: true
    })
    r._read = noop
    r.push(false)
    r.push(0)
    r.push('')
    r.push(null)
    r.pipe(
      toArray(function (array) {
        t.deepEqual(array, [false, 0, ''])
      })
    )
  })
  test('high watermark _read', function (t) {
    t.plan(5)
    const r = new Readable({
      highWaterMark: 6,
      objectMode: true
    })
    let calls = 0
    const list = ['1', '2', '3', '4', '5', '6', '7', '8']
    r._read = function (n) {
      calls++
    }
    forEach(list, function (c) {
      r.push(c)
    })
    const v = r.read()
    t.equal(calls, 0)
    t.equal(v, '1')
    const v2 = r.read()
    t.equal(v2, '2')
    const v3 = r.read()
    t.equal(v3, '3')
    t.equal(calls, 1)
  })
  test('high watermark push', function (t) {
    t.plan(6)
    const r = new Readable({
      highWaterMark: 6,
      objectMode: true
    })
    r._read = function (n) {}
    for (let i = 0; i < 6; i++) {
      const bool = r.push(i)
      t.equal(bool, i !== 5)
    }
  })
  test('can write objects to stream', function (t) {
    t.plan(1)
    const w = new Writable({
      objectMode: true
    })
    w._write = function (chunk, encoding, cb) {
      t.deepEqual(chunk, {
        foo: 'bar'
      })
      cb()
    }
    w.on('finish', function () {})
    w.write({
      foo: 'bar'
    })
    w.end()
  })
  test('can write multiple objects to stream', function (t) {
    t.plan(1)
    const w = new Writable({
      objectMode: true
    })
    const list = []
    w._write = function (chunk, encoding, cb) {
      list.push(chunk)
      cb()
    }
    w.on('finish', function () {
      t.deepEqual(list, [0, 1, 2, 3, 4])
    })
    w.write(0)
    w.write(1)
    w.write(2)
    w.write(3)
    w.write(4)
    w.end()
  })
  test('can write strings as objects', function (t) {
    t.plan(1)
    const w = new Writable({
      objectMode: true
    })
    const list = []
    w._write = function (chunk, encoding, cb) {
      list.push(chunk)
      process.nextTick(cb)
    }
    w.on('finish', function () {
      t.deepEqual(list, ['0', '1', '2', '3', '4'])
    })
    w.write('0')
    w.write('1')
    w.write('2')
    w.write('3')
    w.write('4')
    w.end()
  })
  test('buffers finish until cb is called', function (t) {
    t.plan(2)
    const w = new Writable({
      objectMode: true
    })
    let called = false
    w._write = function (chunk, encoding, cb) {
      t.equal(chunk, 'foo')
      process.nextTick(function () {
        called = true
        cb()
      })
    }
    w.on('finish', function () {
      t.equal(called, true)
    })
    w.write('foo')
    w.end()
  })
}
module.exports[kReadableStreamSuiteName] = 'stream2-objects'
module.exports[kReadableStreamSuiteHasMultipleTests] = true
