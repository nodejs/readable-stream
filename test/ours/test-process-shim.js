'use strict'

const t = require('tap')
const shimPath = '../../lib/internal/shims/process'
t.test('unwraps an ES module default export containing the process object', (t) => {
  const processLike = {
    nextTick() {}
  }
  const wrappedProcess = {
    __esModule: true,
    default: processLike
  }
  const shimmedProcess = t.mock(shimPath, {
    'process/': wrappedProcess
  })
  t.equal(shimmedProcess, processLike)
  t.equal(typeof shimmedProcess.nextTick, 'function')
  t.end()
})
t.test('unwraps an ES module process export when default is not process-like', (t) => {
  const processLike = {
    nextTick() {}
  }
  const wrappedProcess = {
    __esModule: true,
    default: {},
    process: processLike
  }
  const shimmedProcess = t.mock(shimPath, {
    'process/': wrappedProcess
  })
  t.equal(shimmedProcess, processLike)
  t.equal(typeof shimmedProcess.nextTick, 'function')
  t.end()
})
t.test('returns a plain process-like object unchanged', (t) => {
  const processLike = {
    nextTick() {}
  }
  const shimmedProcess = t.mock(shimPath, {
    'process/': processLike
  })
  t.equal(shimmedProcess, processLike)
  t.equal(typeof shimmedProcess.nextTick, 'function')
  t.end()
})
t.test('returns an ES module wrapper unchanged when no candidate is process-like', (t) => {
  const wrappedProcess = {
    __esModule: true,
    default: {},
    process: {}
  }
  const shimmedProcess = t.mock(shimPath, {
    'process/': wrappedProcess
  })
  t.equal(shimmedProcess, wrappedProcess)
  t.notOk('nextTick' in shimmedProcess)
  t.end()
})
