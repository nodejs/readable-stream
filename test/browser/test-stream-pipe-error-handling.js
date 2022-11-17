'use strict'

const { Readable, Writable, Stream } = require('../../lib/ours/index')
const { kReadableStreamSuiteName, kReadableStreamSuiteHasMultipleTests } = require('./symbols')
module.exports = function (test) {
  test('Error Listener Catches', function (t) {
    t.plan(1)
    const source = new Stream()
    const dest = new Stream()
    source._read = function () {}
    source.pipe(dest)
    let gotErr = null
    source.on('error', function (err) {
      gotErr = err
    })
    const err = new Error('This stream turned into bacon.')
    source.emit('error', err)
    t.strictEqual(gotErr, err)
  })
  test('Error WithoutListener Throws', function (t) {
    t.plan(1)
    const source = new Stream()
    const dest = new Stream()
    source._read = function () {}
    source.pipe(dest)
    const err = new Error('This stream turned into bacon.')
    let gotErr = null
    try {
      source.emit('error', err)
    } catch (e) {
      gotErr = e
    }
    t.strictEqual(gotErr, err)
  })
  test('Error With Removed Listener Throws', function (t) {
    t.plan(2)
    const onerror = global.onerror
    const r = new Readable()
    const w = new Writable()
    let removed = false
    let caught = false
    global.onerror = () => {
      t.notOk(caught)
      global.onerror = onerror
      return true
    }
    r._read = function () {
      setTimeout(function () {
        t.ok(removed)
        w.emit('error', new Error('fail'))
      })
    }
    w.on('error', myOnError)
    r.pipe(w)
    w.removeListener('error', myOnError)
    removed = true
    function myOnError(er) {
      caught = true
    }
  })
  test('Error Listener Catches When Wrong Listener Is Removed', function (t) {
    t.plan(2)
    const r = new Readable()
    const w = new Writable()
    let removed = false
    let caught = false
    r._read = function () {
      setTimeout(function () {
        t.ok(removed)
        w.emit('error', new Error('fail'))
      })
    }
    w.on('error', myOnError)
    w._write = function () {}
    r.pipe(w)
    // Removing some OTHER random listener should not do anything
    w.removeListener('error', function () {})
    removed = true
    function myOnError(er) {
      t.notOk(caught)
      caught = true
    }
  })
}
module.exports[kReadableStreamSuiteName] = 'stream-pipe-error-handling'
module.exports[kReadableStreamSuiteHasMultipleTests] = true
