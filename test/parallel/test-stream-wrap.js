// Flags: --expose-internals

    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;
const common = require('../common');
const assert = require('assert');

const internalBinding = process.binding
const StreamWrap = require('../../lib/internal/js_stream_socket');
const { Duplex } = require('../../lib');
const { ShutdownWrap } = internalBinding('stream_wrap');

function testShutdown(callback) {
  const stream = new Duplex({
    read: function() {
    },
    write: function() {
    }
  });

  const wrap = new StreamWrap(stream);

  const req = new ShutdownWrap();
  req.oncomplete = function(code) {
    assert(code < 0);
    callback();
  };
  req.handle = wrap._handle;

  // Close the handle to simulate
  wrap.destroy();
  req.handle.shutdown(req);
}

testShutdown(common.mustCall());

  /* replacement start */
  process.on('beforeExit', (code) => {
    if(code === 0) {
      tap.pass('test succeeded');
    } else {
      tap.fail(`test failed - exited code ${code}`);
    }
  });
  /* replacement end */
