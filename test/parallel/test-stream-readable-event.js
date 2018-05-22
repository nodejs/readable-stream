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

var Readable = require('../../').Readable;

{
  // First test, not reading when the readable is added.
  // make sure that on('readable', ...) triggers a readable event.
  var r = new Readable({
    highWaterMark: 3
  });

  r._read = common.mustNotCall();

  // This triggers a 'readable' event, which is lost.
  r.push(bufferShim.from('blerg'));

  setTimeout(function () {
    // we're testing what we think we are
    assert(!r._readableState.reading);
    r.on('readable', common.mustCall());
  }, 1);
}

{
  // second test, make sure that readable is re-emitted if there's
  // already a length, while it IS reading.

  var _r = new Readable({
    highWaterMark: 3
  });

  _r._read = common.mustCall();

  // This triggers a 'readable' event, which is lost.
  _r.push(bufferShim.from('bl'));

  setTimeout(function () {
    // assert we're testing what we think we are
    assert(_r._readableState.reading);
    _r.on('readable', common.mustCall());
  }, 1);
}

{
  // Third test, not reading when the stream has not passed
  // the highWaterMark but *has* reached EOF.
  var _r2 = new Readable({
    highWaterMark: 30
  });

  _r2._read = common.mustNotCall();

  // This triggers a 'readable' event, which is lost.
  _r2.push(bufferShim.from('blerg'));
  _r2.push(null);

  setTimeout(function () {
    // assert we're testing what we think we are
    assert(!_r2._readableState.reading);
    _r2.on('readable', common.mustCall());
  }, 1);
}

{
  // pushing a empty string in non-objectMode should
  // trigger next `read()`.
  var underlyingData = ['', 'x', 'y', '', 'z'];
  var expected = underlyingData.filter(function (data) {
    return data;
  });
  var result = [];

  var _r3 = new Readable({
    encoding: 'utf8'
  });
  _r3._read = function () {
    var _this = this;

    process.nextTick(function () {
      if (!underlyingData.length) {
        _this.push(null);
      } else {
        _this.push(underlyingData.shift());
      }
    });
  };

  _r3.on('readable', function () {
    var data = _r3.read();
    if (data !== null) result.push(data);
  });

  _r3.on('end', common.mustCall(function () {
    assert.deepStrictEqual(result, expected);
  }));
}
;require('tap').pass('sync run');