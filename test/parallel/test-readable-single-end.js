
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;

const common = require('../common');
const { Readable } = require('../../lib');

// This test ensures that there will not be an additional empty 'readable'
// event when stream has ended (only 1 event signalling about end)

const r = new Readable({
  read: () => {},
});

r.push(null);

r.on('readable', common.mustCall());
r.on('end', common.mustCall());

  /* replacement start */
  process.on('beforeExit', (code) => {
    if(code === 0) {
      tap.pass('test succeeded');
    } else {
      tap.fail(`test failed - exited code ${code}`);
    }
  });
  /* replacement end */
