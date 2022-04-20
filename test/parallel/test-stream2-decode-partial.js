
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;
require('../common');
const { Readable } = require('../../lib/ours/index');
const assert = require('assert');

let buf = '';
const euro = Buffer.from([0xE2, 0x82, 0xAC]);
const cent = Buffer.from([0xC2, 0xA2]);
const source = Buffer.concat([euro, cent]);

const readable = Readable({ encoding: 'utf8' });
readable.push(source.slice(0, 2));
readable.push(source.slice(2, 4));
readable.push(source.slice(4, 6));
readable.push(null);

readable.on('data', function(data) {
  buf += data;
});

process.on('exit', function() {
  assert.strictEqual(buf, '€¢');
});

  /* replacement start */
  process.on('beforeExit', (code) => {
    if(code === 0) {
      tap.pass('test succeeded');
    } else {
      tap.fail(`test failed - exited code ${code}`);
    }
  });
  /* replacement end */
