/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/
require('../common');
var R = require('../../lib/_stream_readable');
var W = require('../../lib/_stream_writable');
var assert = require('assert/');

var util = require('util');

var ondataCalled = 0;

function TestReader() {
  R.apply(this);
  this._buffer = bufferShim.alloc(100, 'x');

  this.on('data', function () {
    ondataCalled++;
  });
}

util.inherits(TestReader, R);

TestReader.prototype._read = function (n) {
  this.push(this._buffer);
  this._buffer = bufferShim.alloc(0);
};

var reader = new TestReader();
setImmediate(function () {
  assert.equal(ondataCalled, 1);
  console.log('ok');
  reader.push(null);
});

function TestWriter() {
  W.apply(this);
  this.write('foo');
  this.end();
}

util.inherits(TestWriter, W);

TestWriter.prototype._write = function (chunk, enc, cb) {
  cb();
};

var writer = new TestWriter();

process.on('exit', function () {
  assert.strictEqual(reader.readable, false);
  assert.strictEqual(writer.writable, false);
  console.log('ok');
});