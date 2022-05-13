'use strict'

const { Readable } = require('../../lib/ours/index')
const { kReadableStreamSuiteName, kReadableStreamSuiteHasMultipleTests } = require('./symbols')

module.exports = function (test) {
  test('readable events - first', (t) => {
    t.plan(3)

    // First test, not reading when the readable is added.
    // make sure that on('readable', ...) triggers a readable event.
    const r = new Readable({
      highWaterMark: 3
    })

    let _readCalled = false
    r._read = function (n) {
      _readCalled = true
    }

    // This triggers a 'readable' event, which is lost.
    r.push(Buffer.from('blerg'))

    let caughtReadable = false
    setTimeout(function () {
      // we're testing what we think we are
      t.notOk(r._readableState.reading)
      r.on('readable', function () {
        caughtReadable = true
        setTimeout(function () {
          // we're testing what we think we are
          t.notOk(_readCalled)

          t.ok(caughtReadable)
        })
      })
    })
  })

  test('readable events - second', (t) => {
    t.plan(3)

    // second test, make sure that readable is re-emitted if there's
    // already a length, while it IS reading.

    const r = new Readable({
      highWaterMark: 3
    })

    let _readCalled = false
    r._read = function (n) {
      _readCalled = true
    }

    // This triggers a 'readable' event, which is lost.
    r.push(Buffer.from('bl'))

    let caughtReadable = false
    setTimeout(function () {
      // assert we're testing what we think we are
      t.ok(r._readableState.reading)
      r.on('readable', function () {
        caughtReadable = true
        setTimeout(function () {
          // we're testing what we think we are
          t.ok(_readCalled)

          t.ok(caughtReadable)
        })
      })
    })
  })

  test('readable events - third', (t) => {
    t.plan(3)

    // Third test, not reading when the stream has not passed
    // the highWaterMark but *has* reached EOF.
    const r = new Readable({
      highWaterMark: 30
    })

    let _readCalled = false
    r._read = function (n) {
      _readCalled = true
    }

    // This triggers a 'readable' event, which is lost.
    r.push(Buffer.from('blerg'))
    r.push(null)

    let caughtReadable = false
    setTimeout(function () {
      // assert we're testing what we think we are
      t.notOk(r._readableState.reading)
      r.on('readable', function () {
        caughtReadable = true
        setTimeout(function () {
          // we're testing what we think we are
          t.notOk(_readCalled)

          t.ok(caughtReadable)
        })
      })
    })
  })
}

module.exports[kReadableStreamSuiteName] = 'stream-readable-event'
module.exports[kReadableStreamSuiteHasMultipleTests] = true
