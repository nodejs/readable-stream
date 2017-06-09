/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

var common = require('../common');
var assert = require('assert/');
var stream = require('../../');

// ensure consistency between the finish event when using cork()
// and writev and when not using them

{
  var writable = new stream.Writable();

  writable._write = function (chunks, encoding, cb) {
    cb(new Error('write test error'));
  };

  writable.on('finish', common.mustCall());

  writable.on('prefinish', common.mustCall());

  writable.on('error', common.mustCall(function (er) {
    assert.strictEqual(er.message, 'write test error');
  }));

  writable.end('test');
}

{
  var _writable = new stream.Writable();

  _writable._write = function (chunks, encoding, cb) {
    cb(new Error('write test error'));
  };

  _writable._writev = function (chunks, cb) {
    cb(new Error('writev test error'));
  };

  _writable.on('finish', common.mustCall());

  _writable.on('prefinish', common.mustCall());

  _writable.on('error', common.mustCall(function (er) {
    assert.strictEqual(er.message, 'writev test error');
  }));

  _writable.cork();
  _writable.write('test');

  setImmediate(function () {
    _writable.end('test');
  });
}