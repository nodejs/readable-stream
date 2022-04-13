
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;
const common = require('../common');
const assert = require('assert');
const http = require('http');
const msg = 'Hello';
const server = http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(msg);
}).listen(0, function() {
  http.get({ port: this.address().port }, function(res) {
    let data = '';
    res.on('readable', common.mustCall(function() {
      silentConsole.log('readable event');
      let chunk;
      while ((chunk = res.read()) !== null) {
        data += chunk;
      }
    }));
    res.on('end', common.mustCall(function() {
      silentConsole.log('end event');
      assert.strictEqual(msg, data);
      server.close();
    }));
  });
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
