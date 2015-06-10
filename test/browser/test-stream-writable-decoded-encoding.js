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

function decodeStringsTrue(t) {
  t.plan(3);
  var m = new MyWritable(function(isBuffer, type, enc) {
    t.ok(isBuffer);
    t.equal(type, 'object');
    t.equal(enc, 'buffer');
    //console.log('ok - decoded string is decoded');
  }, { decodeStrings: true });
  m.write('some-text', 'utf8');
  m.end();
}

function decodeStringsFalse(t) {
  t.plan(3);
  var m = new MyWritable(function(isBuffer, type, enc) {
    t.notOk(isBuffer);
    t.equal(type, 'string');
    t.equal(enc, 'utf8');
    //console.log('ok - un-decoded string is not decoded');
  }, { decodeStrings: false });
  m.write('some-text', 'utf8');
  m.end();
}
module.exports = function (t) {
  t.test('decodeStringsTrue', decodeStringsTrue);
  t.test('decodeStringsFalse', decodeStringsFalse);
}
