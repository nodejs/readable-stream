
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;
const common = require('../common');
const { Transform } = require('../../lib');
const stream = new Transform({
  transform(chunk, enc, cb) { cb(); cb(); }
});

stream.on('error', common.expectsError({
  name: 'Error',
  message: 'Callback called multiple times',
  code: 'ERR_MULTIPLE_CALLBACK'
}));

stream.write('foo');

  /* replacement start */
  process.on('beforeExit', (code) => {
    if(code === 0) {
      tap.pass('test succeeded');
    } else {
      tap.fail(`test failed - exited code ${code}`);
    }
  });
  /* replacement end */
