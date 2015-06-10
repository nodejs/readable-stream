'use strict';
var common = require('../common');
var R = require('../../lib/_stream_readable');
var W = require('../../lib/_stream_writable');
module.exports = function (t) {
  t.test('base64 single char read end', function (t) {
  t.plan(1);
  var src = new R({encoding: 'base64'});
  var dst = new W();
  var hasRead = false;
  var accum = [];
  var timeout;

  src._read = function(n) {
    if(!hasRead) {
      hasRead = true;
      process.nextTick(function() {
        src.push(new Buffer('1'));
        src.push(null);
      });
    };
  };

  dst._write = function(chunk, enc, cb) {
    accum.push(chunk);
    cb();
  };

  src.on('end', function() {
    t.equal(Buffer.concat(accum) + '', 'MQ==');
    clearTimeout(timeout);
  });

  src.pipe(dst);

  timeout = setTimeout(function() {
    assert.fail('timed out waiting for _write');
  }, 100);

})
}
