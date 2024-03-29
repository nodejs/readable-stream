/* eslint-disable node-core/require-common-first, require-yield */

'use strict'

const AbortController = globalThis.AbortController || require('abort-controller').AbortController
const tap = require('tap')
const silentConsole = {
  log() {},
  error() {}
}
const { pipeline } = require('../../lib/stream').promises
{
  // Ensure that async iterators can act as readable and writable streams
  async function* myCustomReadable() {
    yield 'Hello'
    yield 'World'
  }
  const messages = []
  async function* myCustomWritable(stream) {
    for await (const chunk of stream) {
      messages.push(chunk)
    }
  }
  ;(async () => {
    await pipeline(myCustomReadable, myCustomWritable)
    // Importing here to avoid initializing streams
    require('assert').deepStrictEqual(messages, ['Hello', 'World'])
  })().then(require('../common').mustCall())
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
