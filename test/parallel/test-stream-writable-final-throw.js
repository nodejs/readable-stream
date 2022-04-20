
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;

const common = require('../common');
const {
  Duplex,
} = require('../../lib/ours/index');

{
  class Foo extends Duplex {
    _final(callback) {
      throw new Error('fhqwhgads');
    }

    _read() {}
  }

  const foo = new Foo();
  foo._write = common.mustCall((chunk, encoding, cb) => {
    cb();
  });
  foo.end('test', common.expectsError({ message: 'fhqwhgads' }));
  foo.on('error', common.mustCall());
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
