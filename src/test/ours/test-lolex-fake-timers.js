'use strict'

require('../common')
const t = require('tap')
const util = require('util')
const lolex = require('lolex')
const Transform = require('../../lib').Transform

t.plan(1)

function MyTransform() {
  Transform.call(this)
}

util.inherits(MyTransform, Transform)

const clock = lolex.install({ toFake: ['setImmediate', 'nextTick'] })
let stream2DataCalled = false

const stream = new MyTransform()
stream.on('data', function () {
  stream.on('end', function () {
    const stream2 = new MyTransform()
    stream2.on('data', function () {
      stream2.on('end', function () {
        stream2DataCalled = true
      })
      setImmediate(function () {
        stream2.end()
      })
    })
    stream2.emit('data')
  })
  stream.end()
})
stream.emit('data')

clock.runAll()
clock.uninstall()
t.ok(stream2DataCalled)
