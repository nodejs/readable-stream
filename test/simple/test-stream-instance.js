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

var PlatformStream = require('stream');
var Stream = require('../../');
var assert = require('assert');



(function first() {
  // Make sure that Stream is instanceof the
  // node version stream
  assert(new Stream() instanceof PlatformStream);
})();

(function second() {
  // Make sure that Stream.Readable is instanceof the
  // node version stream
  assert(new Stream.Readable() instanceof PlatformStream);
})();

(function third() {
  // Make sure that Stream.Writable is instanceof the
  // node version stream
  assert(new Stream.Writable() instanceof PlatformStream);
})();


(function fourth() {
  // Make sure that Stream.Duplex is instanceof the
  // node version stream
  assert(new Stream.Duplex() instanceof PlatformStream);
})();


(function fifth() {
  // Make sure that Stream.Transform is instanceof the
  // node version stream
  assert(new Stream.Transform() instanceof PlatformStream);
})();

(function sixth() {
  // Make sure that Stream.PassThrough is instanceof the
  // node version stream
  assert(new Stream.PassThough() instanceof PlatformStream);
})();

