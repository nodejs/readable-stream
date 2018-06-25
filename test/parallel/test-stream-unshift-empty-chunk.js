'use strict';

var _setImmediate2;

function _load_setImmediate() {
  return _setImmediate2 = _interopRequireDefault(require('babel-runtime/core-js/set-immediate'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
require('../common');
var assert = require('assert/');

// This test verifies that stream.unshift(bufferShim.alloc(0)) or
// stream.unshift('') does not set state.reading=false.
var Readable = require('../../').Readable;

var r = new Readable();
var nChunks = 10;
var chunk = bufferShim.alloc(10, 'x');

r._read = function (n) {
  (0, (_setImmediate2 || _load_setImmediate()).default)(function () {
    r.push(--nChunks === 0 ? null : chunk);
  });
};

var readAll = false;
var seen = [];
r.on('readable', function () {
  var chunk = void 0;
  while (chunk = r.read()) {
    seen.push(chunk.toString());
    // simulate only reading a certain amount of the data,
    // and then putting the rest of the chunk back into the
    // stream, like a parser might do.  We just fill it with
    // 'y' so that it's easy to see which bits were touched,
    // and which were not.
    var putBack = bufferShim.alloc(readAll ? 0 : 5, 'y');
    readAll = !readAll;
    r.unshift(putBack);
  }
});

var expect = ['xxxxxxxxxx', 'yyyyy', 'xxxxxxxxxx', 'yyyyy', 'xxxxxxxxxx', 'yyyyy', 'xxxxxxxxxx', 'yyyyy', 'xxxxxxxxxx', 'yyyyy', 'xxxxxxxxxx', 'yyyyy', 'xxxxxxxxxx', 'yyyyy', 'xxxxxxxxxx', 'yyyyy', 'xxxxxxxxxx', 'yyyyy'];

r.on('end', function () {
  assert.deepStrictEqual(seen, expect);
  require('tap').pass();
});
;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});