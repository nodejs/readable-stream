'use strict'

const tap = require('tap')

const silentConsole = {
  log() {},

  error() {}
}
const common = require('../common')

const stream = require('../../lib/ours/index')

const fs = require('fs')

const readStream = fs.createReadStream(process.execPath)
const transformStream = new stream.Transform({
  transform: common.mustCall(() => {
    readStream.unpipe()
    readStream.resume()
  })
})
readStream.on('end', common.mustCall())
readStream.pipe(transformStream).resume()
/* replacement start */

process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
