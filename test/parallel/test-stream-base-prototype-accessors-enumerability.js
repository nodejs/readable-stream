// Flags: --expose-internals

    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;

require('../common');

// This tests that the prototype accessors added by StreamBase::AddMethods
// are not enumerable. They could be enumerated when inspecting the prototype
// with util.inspect or the inspector protocol.

const assert = require('assert');

// Or anything that calls StreamBase::AddMethods when setting up its prototype
const internalBinding = process.binding
const TTY = internalBinding('tty_wrap').TTY;

{
  const ttyIsEnumerable = Object.prototype.propertyIsEnumerable.bind(TTY);
  assert.strictEqual(ttyIsEnumerable('bytesRead'), false);
  assert.strictEqual(ttyIsEnumerable('fd'), false);
  assert.strictEqual(ttyIsEnumerable('_externalStream'), false);
}

  /* replacement start */
  process.on('beforeExit', (code) => {
    if(code === 0) {
      tap.pass('test succeeded');
    } else {
      tap.fail(`test failed - exited code ${code}`);
    }
  });
  /* replacement end */
