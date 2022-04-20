
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;

const common = require('../common');
const { Writable } = require('../../lib/ours/index');

{
  const w = new Writable({
    write: common.mustCall((chunk, encoding, cb) => {
      w.on('close', common.mustCall(() => {
        cb();
      }));
    })
  });

  w.on('finish', common.mustNotCall());
  w.end('asd');
  w.destroy();
}

{
  const w = new Writable({
    write: common.mustCall((chunk, encoding, cb) => {
      w.on('close', common.mustCall(() => {
        cb();
        w.end();
      }));
    })
  });

  w.on('finish', common.mustNotCall());
  w.write('asd');
  w.destroy();
}

{
  const w = new Writable({
    write() {
    }
  });
  w.on('finish', common.mustNotCall());
  w.end();
  w.destroy();
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
