'use strict';

var _setImmediate2;

function _load_setImmediate() {
  return _setImmediate2 = _interopRequireDefault(require('babel-runtime/core-js/set-immediate'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  var firstError = false;
  writable.on('finish', common.mustCall(function () {
    assert.strictEqual(firstError, true);
  }));

  writable.on('prefinish', common.mustCall());

  writable.on('error', common.mustCall(function (er) {
    assert.strictEqual(er.message, 'write test error');
    firstError = true;
  }));

  writable.end('test');
}

{
  var _writable = new stream.Writable();

  _writable._write = function (chunks, encoding, cb) {
    (0, (_setImmediate2 || _load_setImmediate()).default)(cb, new Error('write test error'));
  };

  var _firstError = false;
  _writable.on('finish', common.mustCall(function () {
    assert.strictEqual(_firstError, true);
  }));

  _writable.on('prefinish', common.mustCall());

  _writable.on('error', common.mustCall(function (er) {
    assert.strictEqual(er.message, 'write test error');
    _firstError = true;
  }));

  _writable.end('test');
}

{
  var _writable2 = new stream.Writable();

  _writable2._write = function (chunks, encoding, cb) {
    cb(new Error('write test error'));
  };

  _writable2._writev = function (chunks, cb) {
    cb(new Error('writev test error'));
  };

  var _firstError2 = false;
  _writable2.on('finish', common.mustCall(function () {
    assert.strictEqual(_firstError2, true);
  }));

  _writable2.on('prefinish', common.mustCall());

  _writable2.on('error', common.mustCall(function (er) {
    assert.strictEqual(er.message, 'writev test error');
    _firstError2 = true;
  }));

  _writable2.cork();
  _writable2.write('test');

  (0, (_setImmediate2 || _load_setImmediate()).default)(function () {
    _writable2.end('test');
  });
}

{
  var _writable3 = new stream.Writable();

  _writable3._write = function (chunks, encoding, cb) {
    (0, (_setImmediate2 || _load_setImmediate()).default)(cb, new Error('write test error'));
  };

  _writable3._writev = function (chunks, cb) {
    (0, (_setImmediate2 || _load_setImmediate()).default)(cb, new Error('writev test error'));
  };

  var _firstError3 = false;
  _writable3.on('finish', common.mustCall(function () {
    assert.strictEqual(_firstError3, true);
  }));

  _writable3.on('prefinish', common.mustCall());

  _writable3.on('error', common.mustCall(function (er) {
    assert.strictEqual(er.message, 'writev test error');
    _firstError3 = true;
  }));

  _writable3.cork();
  _writable3.write('test');

  (0, (_setImmediate2 || _load_setImmediate()).default)(function () {
    _writable3.end('test');
  });
}

// Regression test for
// https://github.com/nodejs/node/issues/13812

{
  var rs = new stream.Readable();
  rs.push('ok');
  rs.push(null);
  rs._read = function () {};

  var ws = new stream.Writable();
  var _firstError4 = false;

  ws.on('finish', common.mustCall(function () {
    assert.strictEqual(_firstError4, true);
  }));
  ws.on('error', common.mustCall(function () {
    _firstError4 = true;
  }));

  ws._write = function (chunk, encoding, done) {
    (0, (_setImmediate2 || _load_setImmediate()).default)(done, new Error());
  };
  rs.pipe(ws);
}

{
  var _rs = new stream.Readable();
  _rs.push('ok');
  _rs.push(null);
  _rs._read = function () {};

  var _ws = new stream.Writable();

  _ws.on('finish', common.mustNotCall());
  _ws.on('error', common.mustCall());

  _ws._write = function (chunk, encoding, done) {
    done(new Error());
  };
  _rs.pipe(_ws);
}

{
  var w = new stream.Writable();
  w._write = function (chunk, encoding, cb) {
    process.nextTick(cb);
  };
  w.on('error', common.mustCall());
  w.on('prefinish', function () {
    w.write("shouldn't write in prefinish listener");
  });
  w.end();
}

{
  var _w = new stream.Writable();
  _w._write = function (chunk, encoding, cb) {
    process.nextTick(cb);
  };
  _w.on('error', common.mustCall());
  _w.on('finish', function () {
    _w.write("should't write in finish listener");
  });
  _w.end();
}
;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});