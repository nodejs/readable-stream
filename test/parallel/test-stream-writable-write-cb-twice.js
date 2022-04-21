'use strict'

const tap = require('tap')

const silentConsole = {
  log() {},

  error() {}
}
const common = require('../common')

const { Writable } = require('../../lib/ours/index')

{
  // Sync + Sync
  const writable = new Writable({
    write: common.mustCall((buf, enc, cb) => {
      cb()
      cb()
    })
  })
  writable.write('hi')
  writable.on(
    'error',
    common.expectsError({
      code: 'ERR_MULTIPLE_CALLBACK',
      name: 'Error'
    })
  )
}
{
  // Sync + Async
  const writable = new Writable({
    write: common.mustCall((buf, enc, cb) => {
      cb()
      process.nextTick(() => {
        cb()
      })
    })
  })
  writable.write('hi')
  writable.on(
    'error',
    common.expectsError({
      code: 'ERR_MULTIPLE_CALLBACK',
      name: 'Error'
    })
  )
}
{
  // Async + Async
  const writable = new Writable({
    write: common.mustCall((buf, enc, cb) => {
      process.nextTick(cb)
      process.nextTick(() => {
        cb()
      })
    })
  })
  writable.write('hi')
  writable.on(
    'error',
    common.expectsError({
      code: 'ERR_MULTIPLE_CALLBACK',
      name: 'Error'
    })
  )
}
/* replacement start */

process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
