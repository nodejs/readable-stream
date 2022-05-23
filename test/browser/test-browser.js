'use strict'

const logger = globalThis.logger || console.log

const tape = require('tape')

const { createDeferredPromise } = require('../../lib/ours/util')

const { kReadableStreamSuiteName, kReadableStreamSuiteHasMultipleTests } = require('./symbols')

let totalTests = 0
let completed = 0
let failed = 0

async function test(rootName, fn) {
  // Gather all tests in the file
  const tests = {}

  function addTests(name, fn) {
    tests[`${rootName} - ${name}`] = fn
  }

  if (fn[kReadableStreamSuiteHasMultipleTests]) {
    fn(addTests)
  } else {
    tests[rootName] = fn
  } // Execute each test in a separate harness and then output overall results

  for (const [name, subtest] of Object.entries(tests)) {
    const currentIndex = ++totalTests
    const harness = tape.createHarness()
    const { promise, resolve } = createDeferredPromise()
    const messages = [`# Subtest: ${name}`]
    harness.createStream().on('data', function (row) {
      if (row.startsWith('TAP version') || row.match(new RegExp(`^# (?:${name})`))) {
        return
      }

      messages.push(row.trim().replace(/^/gm, '    '))
    })
    harness.onFinish(() => {
      const success = harness._exitCode === 0
      messages.push(`${success ? 'ok' : 'not ok'} ${currentIndex} - ${name}`)
      logger(messages.join('\n'))
      completed++

      if (!success) {
        failed++
      }

      resolve()
    })
    harness(name, subtest)
    await promise
  }
}

async function runTests(suites) {
  // Setup an interval
  const interval = setInterval(() => {
    if (completed < totalTests) {
      return
    }

    clearInterval(interval)
    logger(`1..${totalTests}`)
    logger(`# tests ${totalTests}`)
    logger(`# pass  ${completed - failed}`)
    logger(`# fail  ${failed}`)
    logger(`# ${failed === 0 ? 'ok' : 'not ok'}`) // This line is used by the playwright script to detect we're done

    logger('# readable-stream-finished')
  }, 100) // Execute each test serially, to avoid side-effects errors when dealing with global error handling

  for (const suite of suites) {
    await test(suite[kReadableStreamSuiteName], suite)
  }
} // Important: Do not try to make the require dynamic because bundlers will not like it

runTests([
  require('./test-stream-big-packet'),
  require('./test-stream-big-push'),
  require('./test-stream-duplex'),
  require('./test-stream-end-paused'),
  require('./test-stream-finished'),
  require('./test-stream-ispaused'),
  require('./test-stream-pipe-after-end'),
  require('./test-stream-pipe-cleanup-pause'),
  require('./test-stream-pipe-cleanup'),
  require('./test-stream-pipe-error-handling'),
  require('./test-stream-pipe-event'),
  require('./test-stream-pipe-without-listenerCount'),
  require('./test-stream-pipeline'),
  require('./test-stream-push-order'),
  require('./test-stream-push-strings'),
  require('./test-stream-readable-constructor-set-methods'),
  require('./test-stream-readable-event'),
  require('./test-stream-sync-write'),
  require('./test-stream-transform-constructor-set-methods'),
  require('./test-stream-transform-objectmode-falsey-value'),
  require('./test-stream-transform-split-objectmode'),
  require('./test-stream-unshift-empty-chunk'),
  require('./test-stream-unshift-read-race'),
  require('./test-stream-writable-change-default-encoding'),
  require('./test-stream-writable-constructor-set-methods'),
  require('./test-stream-writable-decoded-encoding'),
  require('./test-stream-writev'),
  require('./test-stream2-base64-single-char-read-end'),
  require('./test-stream2-compatibility'),
  require('./test-stream2-large-read-stall'),
  require('./test-stream2-objects'),
  require('./test-stream2-pipe-error-handling'),
  require('./test-stream2-pipe-error-once-listener'),
  require('./test-stream2-push'),
  require('./test-stream2-readable-empty-buffer-no-eof'),
  require('./test-stream2-readable-from-list'),
  require('./test-stream2-readable-legacy-drain'),
  require('./test-stream2-readable-non-empty-end'),
  require('./test-stream2-readable-wrap-empty'),
  require('./test-stream2-readable-wrap'),
  require('./test-stream2-set-encoding'),
  require('./test-stream2-transform'),
  require('./test-stream2-unpipe-drain'),
  require('./test-stream2-writable'),
  require('./test-stream3-pause-then-read')
]).catch((e) => {
  console.error(e)
})
