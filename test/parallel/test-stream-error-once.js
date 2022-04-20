
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;
const common = require('../common');
const { Writable, Readable } = require('../../lib/ours/index');

{
  const writable = new Writable();
  writable.on('error', common.mustCall());
  writable.end();
  writable.write('h');
  writable.write('h');
}

{
  const readable = new Readable();
  readable.on('error', common.mustCall());
  readable.push(null);
  readable.push('h');
  readable.push('h');
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
