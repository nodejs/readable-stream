'use strict'

const tap = require('tap')

const silentConsole = {
  log() {},

  error() {}
}
const common = require('../common')

const { Readable, PassThrough } = require('../../lib/ours/index')

function test(r) {
  const wrapper = new Readable({
    read: () => {
      let data = r.read()

      if (data) {
        wrapper.push(data)
        return
      }

      r.once('readable', function () {
        data = r.read()

        if (data) {
          wrapper.push(data)
        } // else: the end event should fire
      })
    }
  })
  r.once('end', function () {
    wrapper.push(null)
  })
  wrapper.resume()
  wrapper.once('end', common.mustCall())
}

{
  const source = new Readable({
    read: () => {}
  })
  source.push('foo')
  source.push('bar')
  source.push(null)
  const pt = source.pipe(new PassThrough())
  test(pt)
}
{
  // This is the underlying cause of the above test case.
  const pushChunks = ['foo', 'bar']
  const r = new Readable({
    read: () => {
      const chunk = pushChunks.shift()

      if (chunk) {
        // synchronous call
        r.push(chunk)
      } else {
        // asynchronous call
        process.nextTick(() => r.push(null))
      }
    }
  })
  test(r)
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
