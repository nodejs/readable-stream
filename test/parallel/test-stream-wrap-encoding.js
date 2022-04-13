// Flags: --expose-internals

    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;
const common = require('../common');

const StreamWrap = require('../../lib/internal/js_stream_socket');
const Duplex = require('../../lib').Duplex;

{
  const stream = new Duplex({
    read() {},
    write() {}
  });

  stream.setEncoding('ascii');

  const wrap = new StreamWrap(stream);

  wrap.on('error', common.expectsError({
    name: 'Error',
    code: 'ERR_STREAM_WRAP',
    message: 'Stream has StringDecoder set or is in objectMode'
  }));

  stream.push('ohai');
}

{
  const stream = new Duplex({
    read() {},
    write() {},
    objectMode: true
  });

  const wrap = new StreamWrap(stream);

  wrap.on('error', common.expectsError({
    name: 'Error',
    code: 'ERR_STREAM_WRAP',
    message: 'Stream has StringDecoder set or is in objectMode'
  }));

  stream.push(new Error('foo'));
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
