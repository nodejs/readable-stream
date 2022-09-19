'use strict'
/* replacement start */

const { Buffer } = require('buffer')
/* replacement end */

const { _fromList: fromList } = require('../../lib/_stream_readable')

const BufferList = require('../../lib/internal/streams/buffer_list')

const { kReadableStreamSuiteName, kReadableStreamSuiteHasMultipleTests } = require('./symbols')

function bufferListFromArray(arr) {
  const bl = new BufferList()

  for (let i = 0; i < arr.length; ++i) {
    bl.push(arr[i])
  }

  return bl
}

module.exports = function (test) {
  test('buffers', function (t) {
    t.plan(5)
    let list = [Buffer.from('foog'), Buffer.from('bark'), Buffer.from('bazy'), Buffer.from('kuel')]
    list = bufferListFromArray(list) // read more than the first element.

    let ret = fromList(6, {
      buffer: list,
      length: 16
    })
    t.equal(ret.toString(), 'foogba') // read exactly the first element.

    ret = fromList(2, {
      buffer: list,
      length: 10
    })
    t.equal(ret.toString(), 'rk') // read less than the first element.

    ret = fromList(2, {
      buffer: list,
      length: 8
    })
    t.equal(ret.toString(), 'ba') // read more than we have.

    ret = fromList(100, {
      buffer: list,
      length: 6
    })
    t.equal(ret.toString(), 'zykuel') // all consumed.

    t.same(list, new BufferList())
  })
  test('strings', function (t) {
    t.plan(5)
    let list = ['foog', 'bark', 'bazy', 'kuel']
    list = bufferListFromArray(list) // read more than the first element.

    let ret = fromList(6, {
      buffer: list,
      length: 16,
      decoder: true
    })
    t.equal(ret, 'foogba') // read exactly the first element.

    ret = fromList(2, {
      buffer: list,
      length: 10,
      decoder: true
    })
    t.equal(ret, 'rk') // read less than the first element.

    ret = fromList(2, {
      buffer: list,
      length: 8,
      decoder: true
    })
    t.equal(ret, 'ba') // read more than we have.

    ret = fromList(100, {
      buffer: list,
      length: 6,
      decoder: true
    })
    t.equal(ret, 'zykuel') // all consumed.

    t.same(list, new BufferList())
  })
}

module.exports[kReadableStreamSuiteName] = 'stream2-readable-from-list'
module.exports[kReadableStreamSuiteHasMultipleTests] = true
