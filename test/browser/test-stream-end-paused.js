'use strict'

const test = require('tape')
const { Readable } = require('../../lib')

test('end pause', function (t) {
  t.plan(2)

  const stream = new Readable()
  let calledRead = false

  stream._read = function () {
    t.notOk(calledRead)
    calledRead = true
    this.push(null)
  }

  stream.on('data', function () {
    throw new Error('should not ever get data')
  })

  stream.pause()

  setTimeout(function () {
    stream.on('end', function () {
      t.ok(calledRead)
    })
    stream.resume()
  })
})
