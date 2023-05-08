'use strict'

const tap = require('tap')
const silentConsole = {
  log() {},
  error() {}
}
const common = require('../common')
const { pipeline, PassThrough } = require('../../lib/ours/index')
async function runTest() {
  await pipeline(
    '',
    new PassThrough({
      objectMode: true
    }),
    common.mustCall()
  )
}
runTest().then(common.mustCall())

/* replacement start */
process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
