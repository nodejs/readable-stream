'use strict';
var common = require('../common');

var stream = require('../../');
var inherits = require('inherits');

function MyWritable(fn, options) {
  stream.Writable.call(this, options);
  this.fn = fn;
};

inherits(MyWritable, stream.Writable);

MyWritable.prototype._write = function(chunk, encoding, callback) {
  this.fn(Buffer.isBuffer(chunk), typeof chunk, encoding);
  callback();
};

function defaultCondingIsUtf8(t) {
  t.plan(1);
  var m = new MyWritable(function(isBuffer, type, enc) {
    t.equal(enc, 'utf8');
  }, { decodeStrings: false });
  m.write('foo');
  m.end();
}

function changeDefaultEncodingToAscii(t) {
  t.plan(1);
  var m = new MyWritable(function(isBuffer, type, enc) {
    t.equal(enc, 'ascii');
  }, { decodeStrings: false });
  m.setDefaultEncoding('ascii');
  m.write('bar');
  m.end();
}

function changeDefaultEncodingToInvalidValue(t) {
  t.plan(1);
  t.throws(function () {
    var m = new MyWritable(function(isBuffer, type, enc) {
    }, { decodeStrings: false });
    m.setDefaultEncoding({});
    m.write('bar');
    m.end();
  }, TypeError);
}
function checkVairableCaseEncoding(t) {
  t.plan(1);
  var m = new MyWritable(function(isBuffer, type, enc) {
    t.equal(enc, 'ascii');
  }, { decodeStrings: false });
  m.setDefaultEncoding('AsCii');
  m.write('bar');
  m.end();
}
module.exports = function (t) {
  t.test('writable change default encoding', function (t) {
    t.test('defaultCondingIsUtf8', defaultCondingIsUtf8);
    t.test('changeDefaultEncodingToAscii', changeDefaultEncodingToAscii);
    t.test('changeDefaultEncodingToInvalidValue', changeDefaultEncodingToInvalidValue);
    t.test('checkVairableCaseEncoding', checkVairableCaseEncoding);
  });
}
