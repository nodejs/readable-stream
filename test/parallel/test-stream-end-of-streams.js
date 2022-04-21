'use strict'

const tap = require('tap')

const silentConsole = {
  log() {},

  error() {}
}
require('../common')

const assert = require('assert')

const { Duplex, finished } = require('../../lib/ours/index')

assert.throws(
  () => {
    // Passing empty object to mock invalid stream
    // should throw error
    finished({}, () => {})
  },
  {
    code: 'ERR_INVALID_ARG_TYPE'
  }
)
const streamObj = new Duplex()
streamObj.end() // Below code should not throw any errors as the
// streamObj is `Stream`

finished(streamObj, () => {})
/* replacement start */

process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
