/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/
require('../common');
var stream = require('../../');
var assert = require('assert/');
var util = require('util');

function Writable() {
  this.writable = true;
  require('stream').Stream.call(this);
}
util.inherits(Writable, require('stream').Stream);

function Readable() {
  this.readable = true;
  require('stream').Stream.call(this);
}
util.inherits(Readable, require('stream').Stream);

var passed = false;

var w = new Writable();
w.on('pipe', function (src) {
  passed = true;
});

var r = new Readable();
r.pipe(w);

assert.ok(passed);