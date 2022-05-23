'use strict'

const inherits = require('inherits')

const { Readable } = require('../../lib/ours/index')

const { kReadableStreamSuiteName, kReadableStreamSuiteHasMultipleTests } = require('./symbols')

inherits(TestReader, Readable)

function TestReader(n, opts) {
  Readable.call(this, opts)
  this.pos = 0
  this.len = n || 100
}

TestReader.prototype._read = function (n) {
  setTimeout(
    function () {
      if (this.pos >= this.len) {
        // double push(null) to test eos handling
        this.push(null)
        return this.push(null)
      }

      n = Math.min(n, this.len - this.pos)

      if (n <= 0) {
        // double push(null) to test eos handling
        this.push(null)
        return this.push(null)
      }

      this.pos += n
      const ret = Buffer.alloc(n)
      ret.fill('a') // console.log('this.push(ret)', ret);

      return this.push(ret)
    }.bind(this),
    1
  )
}

module.exports = function (test) {
  test('setEncoding utf8', function (t) {
    t.plan(1)
    const tr = new TestReader(100)
    tr.setEncoding('utf8')
    const out = []
    const expect = [
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa'
    ]
    tr.on('readable', function flow() {
      let chunk

      while ((chunk = tr.read(10)) !== null) {
        out.push(chunk)
      }
    })
    tr.on('end', function () {
      t.same(out, expect)
    })
  })
  test('setEncoding hex', function (t) {
    t.plan(1)
    const tr = new TestReader(100)
    tr.setEncoding('hex')
    const out = []
    const expect = [
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161'
    ]
    tr.on('readable', function flow() {
      let chunk

      while ((chunk = tr.read(10)) !== null) {
        out.push(chunk)
      }
    })
    tr.on('end', function () {
      t.same(out, expect)
    })
  })
  test('setEncoding hex with read(13)', function (t) {
    t.plan(1)
    const tr = new TestReader(100)
    tr.setEncoding('hex')
    const out = []
    const expect = [
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '16161'
    ]
    tr.on('readable', function flow() {
      // console.log('readable once');
      let chunk

      while ((chunk = tr.read(13)) !== null) {
        out.push(chunk)
      }
    })
    tr.on('end', function () {
      // console.log('END');
      t.same(out, expect)
    })
  })
  test('setEncoding base64', function (t) {
    t.plan(1)
    const tr = new TestReader(100)
    tr.setEncoding('base64')
    const out = []
    const expect = [
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYQ=='
    ]
    tr.on('readable', function flow() {
      let chunk

      while ((chunk = tr.read(10)) !== null) {
        out.push(chunk)
      }
    })
    tr.on('end', function () {
      t.same(out, expect)
    })
  })
  test('encoding: utf8', function (t) {
    t.plan(1)
    const tr = new TestReader(100, {
      encoding: 'utf8'
    })
    const out = []
    const expect = [
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa'
    ]
    tr.on('readable', function flow() {
      let chunk

      while ((chunk = tr.read(10)) !== null) {
        out.push(chunk)
      }
    })
    tr.on('end', function () {
      t.same(out, expect)
    })
  })
  test('encoding: hex', function (t) {
    t.plan(1)
    const tr = new TestReader(100, {
      encoding: 'hex'
    })
    const out = []
    const expect = [
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161'
    ]
    tr.on('readable', function flow() {
      let chunk

      while ((chunk = tr.read(10)) !== null) {
        out.push(chunk)
      }
    })
    tr.on('end', function () {
      t.same(out, expect)
    })
  })
  test('encoding: hex with read(13)', function (t) {
    t.plan(1)
    const tr = new TestReader(100, {
      encoding: 'hex'
    })
    const out = []
    const expect = [
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '16161'
    ]
    tr.on('readable', function flow() {
      let chunk

      while ((chunk = tr.read(13)) !== null) {
        out.push(chunk)
      }
    })
    tr.on('end', function () {
      t.same(out, expect)
    })
  })
  test('encoding: base64', function (t) {
    t.plan(1)
    const tr = new TestReader(100, {
      encoding: 'base64'
    })
    const out = []
    const expect = [
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYQ=='
    ]
    tr.on('readable', function flow() {
      let chunk

      while ((chunk = tr.read(10)) !== null) {
        out.push(chunk)
      }
    })
    tr.on('end', function () {
      t.same(out, expect)
    })
  })
  test('chainable', function (t) {
    t.plan(1)
    const tr = new TestReader(100)
    t.equal(tr.setEncoding('utf8'), tr)
  })
}

module.exports[kReadableStreamSuiteName] = 'stream2-set-encoding'
module.exports[kReadableStreamSuiteHasMultipleTests] = true
