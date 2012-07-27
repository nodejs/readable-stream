'use strict';
// a passthrough stream.
// whatever you .write(), you can then .read() later.
// this is not very useful on its own, but it's a handy
// base class for certain sorts of simple filters and
// transforms.

module.exports = PassThrough;

var Readable = require('./readable.js');
var util = require('util');

util.inherits(PassThrough, Readable);

var fromList = require('./from-list.js');

function PassThrough() {
  Readable.apply(this);

  this.buffer = [];
  this.length = 0;
}

// override this:
PassThrough.prototype.transform = function(c) {
  return c;
};

PassThrough.prototype.write = function(c) {
  var needEmitReadable = this.length === 0;

  c = this.transform(c);
  if (!c || !c.length) return true;

  this.buffer.push(c);
  this.length += c.length;
  if (needEmitReadable) this.emit('readable');
  return (this.length === 0);
};

PassThrough.prototype.end = function(c) {
  if (c) this.write(c);
  this.ended = true;
};

PassThrough.prototype.read = function(n) {
  if (!n || n >= this.length) n = this.length;
  var ret = fromList(n, this.buffer, this.length);
  this.length = Math.max(this.length - n, 0);
  if (this.length === 0) {
    var ev = this.ended ? 'end' : 'drain';
    process.nextTick(this.emit.bind(this, ev));
  }
  return ret;
};
