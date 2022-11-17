'use strict'

const tap = require('tap')
const silentConsole = {
  log() {},
  error() {}
}
const common = require('../common')
const { Readable } = require('../../lib/ours/index')
{
  const r = new Readable({
    read() {}
  })
  r.on('end', common.mustNotCall())
  r.on('data', common.mustCall())
  r.on('error', common.mustCall())
  r.push('asd')
  r.push(null)
  r.destroy(new Error('kaboom'))
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
