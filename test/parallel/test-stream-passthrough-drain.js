
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;
const common = require('../common');
const { PassThrough } = require('../../lib');

const pt = new PassThrough({ highWaterMark: 0 });
pt.on('drain', common.mustCall());
pt.write('hello');
pt.read();

  /* replacement start */
  process.on('beforeExit', (code) => {
    if(code === 0) {
      tap.pass('test succeeded');
    } else {
      tap.fail(`test failed - exited code ${code}`);
    }
  });
  /* replacement end */
