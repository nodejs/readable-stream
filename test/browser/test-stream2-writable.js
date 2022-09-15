/* replacement start */
const { Buffer } = require('buffer')
/* replacement end */

;('use strict')

const inherits = require('inherits')

const { Duplex, Writable } = require('../../lib/ours/index')

const { kReadableStreamSuiteName, kReadableStreamSuiteHasMultipleTests } = require('./symbols')

inherits(TestWriter, Writable)

function TestWriter() {
  Writable.apply(this, arguments)
  this.buffer = []
  this.written = 0
}

TestWriter.prototype._write = function (chunk, encoding, cb) {
  // simulate a small unpredictable latency
  setTimeout(
    function () {
      this.buffer.push(chunk.toString())
      this.written += chunk.length
      cb()
    }.bind(this),
    Math.floor(Math.random() * 10)
  )
}

inherits(Processstdout, Writable)

function Processstdout() {
  Writable.apply(this, arguments)
  this.buffer = []
  this.written = 0
}

Processstdout.prototype._write = function (chunk, encoding, cb) {
  // console.log(chunk.toString());
  cb()
}

const chunks = new Array(50)

for (let i = 0; i < chunks.length; i++) {
  chunks[i] = new Array(i + 1).join('x')
}

if (!process.stdout) {
  process.stdout = new Processstdout()
}

module.exports = function (test) {
  test('write fast', function (t) {
    t.plan(1)
    const tw = new TestWriter({
      highWaterMark: 100
    })
    tw.on('finish', function () {
      t.same(tw.buffer, chunks, 'got chunks in the right order')
    })
    forEach(chunks, function (chunk) {
      // screw backpressure.  Just buffer it all up.
      tw.write(chunk)
    })
    tw.end()
  })
  test('write slow', function (t) {
    t.plan(1)
    const tw = new TestWriter({
      highWaterMark: 100
    })
    tw.on('finish', function () {
      t.same(tw.buffer, chunks, 'got chunks in the right order')
    })
    let i = 0

    ;(function W() {
      tw.write(chunks[i++])

      if (i < chunks.length) {
        setTimeout(W, 10)
      } else {
        tw.end()
      }
    })()
  })
  test('write backpressure', function (t) {
    t.plan(19)
    const tw = new TestWriter({
      highWaterMark: 50
    })
    let drains = 0
    tw.on('finish', function () {
      t.same(tw.buffer, chunks, 'got chunks in the right order')
      t.equal(drains, 17)
    })
    tw.on('drain', function () {
      drains++
    })
    let i = 0

    ;(function W() {
      let ret

      do {
        ret = tw.write(chunks[i++])
      } while (ret !== false && i < chunks.length)

      if (i < chunks.length) {
        t.ok(tw._writableState.length >= 50)
        tw.once('drain', W)
      } else {
        tw.end()
      }
    })()
  })
  test('write bufferize', function (t) {
    t.plan(50)
    const tw = new TestWriter({
      highWaterMark: 100
    })
    const encodings = [
      'hex',
      'utf8',
      'utf-8',
      'ascii',
      'binary',
      'base64',
      'ucs2',
      'ucs-2',
      'utf16le',
      'utf-16le',
      undefined
    ]
    tw.on('finish', function () {
      forEach(chunks, function (chunk, i) {
        const actual = Buffer.from(tw.buffer[i])
        chunk = Buffer.from(chunk) // Some combination of encoding and length result in the last byte replaced by two extra null bytes

        if (actual[actual.length - 1] === 0) {
          chunk = Buffer.concat([chunk.slice(0, chunk.length - 1), Buffer.from([0, 0])])
        } // In some cases instead there is one byte less

        if (actual.length === chunk.length - 1) {
          chunk = chunk.slice(0, chunk.length - 1)
        }

        t.same(actual, chunk, 'got the expected chunks ' + i)
      })
    })
    forEach(chunks, function (chunk, i) {
      const enc = encodings[i % encodings.length]
      chunk = Buffer.from(chunk)
      tw.write(chunk.toString(enc), enc)
    })
    tw.end()
  })
  test('write no bufferize', function (t) {
    t.plan(100)
    const tw = new TestWriter({
      highWaterMark: 100,
      decodeStrings: false
    })

    tw._write = function (chunk, encoding, cb) {
      t.equals(typeof chunk, 'string')
      chunk = Buffer.from(chunk, encoding)
      return TestWriter.prototype._write.call(this, chunk, encoding, cb)
    }

    const encodings = [
      'hex',
      'utf8',
      'utf-8',
      'ascii',
      'binary',
      'base64',
      'ucs2',
      'ucs-2',
      'utf16le',
      'utf-16le',
      undefined
    ]
    tw.on('finish', function () {
      forEach(chunks, function (chunk, i) {
        const actual = Buffer.from(tw.buffer[i])
        chunk = Buffer.from(chunk) // Some combination of encoding and length result in the last byte replaced by two extra null bytes

        if (actual[actual.length - 1] === 0) {
          chunk = Buffer.concat([chunk.slice(0, chunk.length - 1), Buffer.from([0, 0])])
        } // In some cases instead there is one byte less

        if (actual.length === chunk.length - 1) {
          chunk = chunk.slice(0, chunk.length - 1)
        }

        t.same(actual, chunk, 'got the expected chunks ' + i)
      })
    })
    forEach(chunks, function (chunk, i) {
      const enc = encodings[i % encodings.length]
      chunk = Buffer.from(chunk)
      tw.write(chunk.toString(enc), enc)
    })
    tw.end()
  })
  test('write callbacks', function (t) {
    t.plan(2)
    const callbacks = chunks
      .map(function (chunk, i) {
        return [
          i,
          function (er) {
            callbacks._called[i] = chunk
          }
        ]
      })
      .reduce(function (set, x) {
        set['callback-' + x[0]] = x[1]
        return set
      }, {})
    callbacks._called = []
    const tw = new TestWriter({
      highWaterMark: 100
    })
    tw.on('finish', function () {
      process.nextTick(function () {
        t.same(tw.buffer, chunks, 'got chunks in the right order')
        t.same(callbacks._called, chunks, 'called all callbacks')
      })
    })
    forEach(chunks, function (chunk, i) {
      tw.write(chunk, callbacks['callback-' + i])
    })
    tw.end()
  })
  test('end callback', function (t) {
    t.plan(1)
    const tw = new TestWriter()
    tw.end(() => {
      t.ok(true)
    })
  })
  test('end callback with chunk', function (t) {
    t.plan(1)
    const tw = new TestWriter()
    tw.end(Buffer.from('hello world'), () => {
      t.ok(true)
    })
  })
  test('end callback with chunk and encoding', function (t) {
    t.plan(1)
    const tw = new TestWriter()
    tw.end('hello world', 'ascii', () => {
      t.ok(true)
    })
  })
  test('end callback after .write() call', function (t) {
    t.plan(1)
    const tw = new TestWriter()
    tw.write(Buffer.from('hello world'))
    tw.end(() => {
      t.ok(true)
    })
  })
  test('end callback called after write callback', function (t) {
    t.plan(1)
    const tw = new TestWriter()
    let writeCalledback = false
    tw.write(Buffer.from('hello world'), function () {
      writeCalledback = true
    })
    tw.end(function () {
      t.equal(writeCalledback, true)
    })
  })
  test('encoding should be ignored for buffers', function (t) {
    t.plan(1)
    const tw = new Writable()
    const hex = '018b5e9a8f6236ffe30e31baf80d2cf6eb'

    tw._write = function (chunk, encoding, cb) {
      t.equal(chunk.toString('hex'), hex)
    }

    const buf = Buffer.from(hex, 'hex')
    tw.write(buf, 'binary')
  })
  test('writables are not pipable', function (t) {
    t.plan(1)
    const w = new Writable({
      autoDestroy: false
    })

    w._write = function () {}

    let gotError = false
    w.on('error', function (er) {
      gotError = true
    })
    w.pipe(process.stdout)
    t.ok(gotError)
  })
  test('duplexes are pipable', function (t) {
    t.plan(1)
    const d = new Duplex()

    d._read = function () {}

    d._write = function () {}

    let gotError = false
    d.on('error', function (er) {
      gotError = true
    })
    d.pipe(process.stdout)
    t.notOk(gotError)
  })
  test('end(chunk) two times is an error', function (t) {
    t.plan(2)
    const w = new Writable()

    w._write = function () {}

    let gotError = false
    w.on('error', function (er) {
      gotError = true
      t.equal(er.message, 'write after end')
    })
    w.end('this is the end')
    w.end('and so is this')
    process.nextTick(function () {
      t.ok(gotError)
    })
  })
  test('dont end while writing', function (t) {
    t.plan(2)
    const w = new Writable()
    let wrote = false

    w._write = function (chunk, e, cb) {
      t.notOk(this.writing)
      wrote = true
      this.writing = true
      setTimeout(function () {
        this.writing = false
        cb()
      })
    }

    w.on('finish', function () {
      t.ok(wrote)
    })
    w.write(Buffer.alloc(0))
    w.end()
  })
  test('finish does not come before write cb', function (t) {
    t.plan(1)
    const w = new Writable()
    let writeCb = false

    w._write = function (chunk, e, cb) {
      setTimeout(function () {
        writeCb = true
        cb()
      }, 10)
    }

    w.on('finish', function () {
      t.ok(writeCb)
    })
    w.write(Buffer.alloc(0))
    w.end()
  })
  test('finish does not come before sync _write cb', function (t) {
    t.plan(1)
    const w = new Writable()
    let writeCb = false

    w._write = function (chunk, e, cb) {
      cb()
    }

    w.on('finish', function () {
      t.ok(writeCb)
    })
    w.write(Buffer.alloc(0), function (er) {
      writeCb = true
    })
    w.end()
  })
  test('finish is emitted if last chunk is empty', function (t) {
    t.plan(1)
    const w = new Writable()

    w._write = function (chunk, e, cb) {
      process.nextTick(cb)
    }

    w.on('finish', () => {
      t.ok(true)
    })
    w.write(Buffer.alloc(1))
    w.end(Buffer.alloc(0))
  })

  function forEach(xs, f) {
    for (let i = 0, l = xs.length; i < l; i++) {
      f(xs[i], i)
    }
  }
}

module.exports[kReadableStreamSuiteName] = 'stream2-writable'
module.exports[kReadableStreamSuiteHasMultipleTests] = true
