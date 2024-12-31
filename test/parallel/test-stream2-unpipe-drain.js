// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict'

const tap = require('tap')
const silentConsole = {
  log() {},
  error() {}
}
require('../common')
const assert = require('assert')
const stream = require('../../lib/ours/index')
class TestWriter extends stream.Writable {
  _write(buffer, encoding, callback) {
    silentConsole.log('write called')
    // Super slow write stream (callback never called)
  }
}
const dest = new TestWriter()
class TestReader extends stream.Readable {
  constructor() {
    super()
    this.reads = 0
  }
  _read(size) {
    this.reads += 1
    this.push(Buffer.alloc(size))
  }
}
const src1 = new TestReader()
const src2 = new TestReader()
src1.pipe(dest)
src1.once('readable', () => {
  process.nextTick(() => {
    src2.pipe(dest)
    src2.once('readable', () => {
      process.nextTick(() => {
        src1.unpipe(dest)
      })
    })
  })
})
process.on('exit', () => {
  assert.strictEqual(src1.reads, 2)
  assert.strictEqual(src2.reads, 2)
})

/* replacement start */
process.on('beforeExit', (code) => {
  if (code === 0) {
    tap.pass('test succeeded')
  } else {
    tap.fail(`test failed - exited code ${code}`)
  }
})
/* replacement end */
