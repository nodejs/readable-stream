
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;

const common = require('../common');
const assert = require('assert');
const os = require('os');

if (process.argv[2] === 'child') {
  const { pipeline } = require('../../lib/ours/index');
  pipeline(
    process.stdin,
    process.stdout,
    common.mustSucceed()
  );
} else {
  const cp = require('child_process');
  cp.exec([
    'echo',
    'hello',
    '|',
    `"${process.execPath}"`,
    `"${__filename}"`,
    'child',
  ].join(' '), common.mustSucceed((stdout) => {
    assert.strictEqual(stdout.split(os.EOL).shift().trim(), 'hello');
  }));
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
