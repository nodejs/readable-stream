// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');
var assert = require('assert/');

var Stream = require('../../');
var Readable = require('../../').Readable;

var r = new Readable();
var N = 256;
var reads = 0;
r._read = function (n) {
  return r.push(++reads === N ? null : bufferShim.allocUnsafe(1));
};

r.on('end', common.mustCall());

var w = new Stream();
w.writable = true;
var buffered = 0;
w.write = function (c) {
  buffered += c.length;
  process.nextTick(drain);
  return false;
};

function drain() {
  assert(buffered <= 3);
  buffered = 0;
  w.emit('drain');
}

w.end = common.mustCall();

// Just for kicks, let's mess with the drain count.
// This verifies that even if it gets negative in the
// pipe() cleanup function, we'll still function properly.
r.on('readable', function () {
  w.emit('drain');
});

r.pipe(w);