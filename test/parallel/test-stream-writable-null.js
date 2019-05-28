"use strict";

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var assert = require('assert/');

var stream = require('../../');

var MyWritable =
/*#__PURE__*/
function (_stream$Writable) {
  _inheritsLoose(MyWritable, _stream$Writable);

  function MyWritable() {
    return _stream$Writable.apply(this, arguments) || this;
  }

  var _proto = MyWritable.prototype;

  _proto._write = function _write(chunk, encoding, callback) {
    assert.notStrictEqual(chunk, null);
    callback();
  };

  return MyWritable;
}(stream.Writable);

common.expectsError(function () {
  var m = new MyWritable({
    objectMode: true
  });
  m.write(null, function (err) {
    return assert.ok(err);
  });
}, {
  code: 'ERR_STREAM_NULL_VALUES',
  type: TypeError,
  message: 'May not write null values to stream'
});
{
  // Should not throw.
  var m = new MyWritable({
    objectMode: true
  }).on('error', assert);
  m.write(null, assert);
}
common.expectsError(function () {
  var m = new MyWritable();
  m.write(false, function (err) {
    return assert.ok(err);
  });
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  type: TypeError
});
{
  // Should not throw.
  var _m = new MyWritable().on('error', assert);

  _m.write(false, assert);
}
{
  // Should not throw.
  var _m2 = new MyWritable({
    objectMode: true
  });

  _m2.write(false, assert.ifError);
}
{
  // Should not throw.
  var _m3 = new MyWritable({
    objectMode: true
  }).on('error', function (e) {
    assert.ifError(e || new Error('should not get here'));
  });

  _m3.write(false, assert.ifError);
}
;

(function () {
  var t = require('tap');

  t.pass('sync run');
})();

var _list = process.listeners('uncaughtException');

process.removeAllListeners('uncaughtException');

_list.pop();

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});