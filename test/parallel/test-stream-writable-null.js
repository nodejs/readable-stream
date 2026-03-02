/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/
require('../common');
var assert = require('assert/');

var stream = require('../../');
var util = require('util');

function MyWritable(options) {
  stream.Writable.call(this, options);
}

util.inherits(MyWritable, stream.Writable);

MyWritable.prototype._write = function (chunk, encoding, callback) {
  assert.notStrictEqual(chunk, null);
  callback();
};

assert.throws(function () {
  var m = new MyWritable({ objectMode: true });
  m.write(null, function (err) {
    return assert.ok(err);
  });
}, TypeError, 'May not write null values to stream');
assert.doesNotThrow(function () {
  var m = new MyWritable({ objectMode: true }).on('error', function (e) {
    assert.ok(e);
  });
  m.write(null, function (err) {
    assert.ok(err);
  });
});

assert.throws(function () {
  var m = new MyWritable();
  m.write(false, function (err) {
    return assert.ok(err);
  });
}, TypeError, 'Invalid non-string/buffer chunk');
assert.doesNotThrow(function () {
  var m = new MyWritable().on('error', function (e) {
    assert.ok(e);
  });
  m.write(false, function (err) {
    assert.ok(err);
  });
});

assert.doesNotThrow(function () {
  var m = new MyWritable({ objectMode: true });
  m.write(false, function (err) {
    return assert.ifError(err);
  });
});
assert.doesNotThrow(function () {
  var m = new MyWritable({ objectMode: true }).on('error', function (e) {
    assert.ifError(e || new Error('should not get here'));
  });
  m.write(false, function (err) {
    assert.ifError(err);
  });
});