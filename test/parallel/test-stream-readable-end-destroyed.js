
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;

const common = require('../common');
const { Readable } = require('../../lib/ours/index');

{
  // Don't emit 'end' after 'close'.

  const r = new Readable();

  r.on('end', common.mustNotCall());
  r.resume();
  r.destroy();
  r.on('close', common.mustCall(() => {
    r.push(null);
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
