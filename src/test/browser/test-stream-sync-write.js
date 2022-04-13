'use strict'

const test = require('tape')
const inherits = require('inherits')
const { Writable } = require('../../lib')

test('should bea ble to write sync', function (t) {
  t.plan(2)

  let internalCalls = 0
  let externalCalls = 0

  const InternalStream = function () {
    Writable.call(this)
  }
  inherits(InternalStream, Writable)

  InternalStream.prototype._write = function (chunk, encoding, callback) {
    internalCalls++
    callback()
  }

  const internalStream = new InternalStream()

  const ExternalStream = function (writable) {
    this._writable = writable
    Writable.call(this)
  }
  inherits(ExternalStream, Writable)

  ExternalStream.prototype._write = function (chunk, encoding, callback) {
    externalCalls++
    this._writable.write(chunk, encoding, callback)
  }

  const externalStream = new ExternalStream(internalStream)

  for (let i = 0; i < 2000; i++) {
    externalStream.write(i.toString())
  }

  externalStream.end(() => {
    t.equal(internalCalls, 2000)
    t.equal(externalCalls, 2000)
  })
})
