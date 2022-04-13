
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;

const common = require('../common');
const stream = require('../../lib');

function testPushArg(val) {
  const readable = new stream.Readable({
    read: () => {}
  });
  readable.on('error', common.expectsError({
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  }));
  readable.push(val);
}

testPushArg([]);
testPushArg({});
testPushArg(0);

function testUnshiftArg(val) {
  const readable = new stream.Readable({
    read: () => {}
  });
  readable.on('error', common.expectsError({
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  }));
  readable.unshift(val);
}

testUnshiftArg([]);
testUnshiftArg({});
testUnshiftArg(0);

  /* replacement start */
  process.on('beforeExit', (code) => {
    if(code === 0) {
      tap.pass('test succeeded');
    } else {
      tap.fail(`test failed - exited code ${code}`);
    }
  });
  /* replacement end */
