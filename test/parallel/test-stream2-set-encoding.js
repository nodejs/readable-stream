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
var R = require('../../lib/_stream_readable');
var util = require('util');

util.inherits(TestReader, R);

function TestReader(n, opts) {
  R.call(this, opts);

  this.pos = 0;
  this.len = n || 100;
}

TestReader.prototype._read = function (n) {
  setTimeout(function () {

    if (this.pos >= this.len) {
      // double push(null) to test eos handling
      this.push(null);
      return this.push(null);
    }

    n = Math.min(n, this.len - this.pos);
    if (n <= 0) {
      // double push(null) to test eos handling
      this.push(null);
      return this.push(null);
    }

    this.pos += n;
    var ret = bufferShim.alloc(n, 'a');

    return this.push(ret);
  }.bind(this), 1);
};

{
  // Verify utf8 encoding
  var tr = new TestReader(100);
  tr.setEncoding('utf8');
  var out = [];
  var expect = ['aaaaaaaaaa', 'aaaaaaaaaa', 'aaaaaaaaaa', 'aaaaaaaaaa', 'aaaaaaaaaa', 'aaaaaaaaaa', 'aaaaaaaaaa', 'aaaaaaaaaa', 'aaaaaaaaaa', 'aaaaaaaaaa'];

  tr.on('readable', function flow() {
    var chunk = void 0;
    while (null !== (chunk = tr.read(10))) {
      out.push(chunk);
    }
  });

  tr.on('end', common.mustCall(function () {
    assert.deepStrictEqual(out, expect);
  }));
}

{
  // Verify hex encoding
  var _tr = new TestReader(100);
  _tr.setEncoding('hex');
  var _out = [];
  var _expect = ['6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161'];

  _tr.on('readable', function flow() {
    var chunk = void 0;
    while (null !== (chunk = _tr.read(10))) {
      _out.push(chunk);
    }
  });

  _tr.on('end', common.mustCall(function () {
    assert.deepStrictEqual(_out, _expect);
  }));
}

{
  // Verify hex encoding with read(13)
  var _tr2 = new TestReader(100);
  _tr2.setEncoding('hex');
  var _out2 = [];
  var _expect2 = ['6161616161616', '1616161616161', '6161616161616', '1616161616161', '6161616161616', '1616161616161', '6161616161616', '1616161616161', '6161616161616', '1616161616161', '6161616161616', '1616161616161', '6161616161616', '1616161616161', '6161616161616', '16161'];

  _tr2.on('readable', function flow() {
    var chunk = void 0;
    while (null !== (chunk = _tr2.read(13))) {
      _out2.push(chunk);
    }
  });

  _tr2.on('end', common.mustCall(function () {
    assert.deepStrictEqual(_out2, _expect2);
  }));
}

{
  // Verify base64 encoding
  var _tr3 = new TestReader(100);
  _tr3.setEncoding('base64');
  var _out3 = [];
  var _expect3 = ['YWFhYWFhYW', 'FhYWFhYWFh', 'YWFhYWFhYW', 'FhYWFhYWFh', 'YWFhYWFhYW', 'FhYWFhYWFh', 'YWFhYWFhYW', 'FhYWFhYWFh', 'YWFhYWFhYW', 'FhYWFhYWFh', 'YWFhYWFhYW', 'FhYWFhYWFh', 'YWFhYWFhYW', 'FhYQ=='];

  _tr3.on('readable', function flow() {
    var chunk = void 0;
    while (null !== (chunk = _tr3.read(10))) {
      _out3.push(chunk);
    }
  });

  _tr3.on('end', common.mustCall(function () {
    assert.deepStrictEqual(_out3, _expect3);
  }));
}

{
  // Verify utf8 encoding
  var _tr4 = new TestReader(100, { encoding: 'utf8' });
  var _out4 = [];
  var _expect4 = ['aaaaaaaaaa', 'aaaaaaaaaa', 'aaaaaaaaaa', 'aaaaaaaaaa', 'aaaaaaaaaa', 'aaaaaaaaaa', 'aaaaaaaaaa', 'aaaaaaaaaa', 'aaaaaaaaaa', 'aaaaaaaaaa'];

  _tr4.on('readable', function flow() {
    var chunk = void 0;
    while (null !== (chunk = _tr4.read(10))) {
      _out4.push(chunk);
    }
  });

  _tr4.on('end', common.mustCall(function () {
    assert.deepStrictEqual(_out4, _expect4);
  }));
}

{
  // Verify hex encoding
  var _tr5 = new TestReader(100, { encoding: 'hex' });
  var _out5 = [];
  var _expect5 = ['6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161', '6161616161'];

  _tr5.on('readable', function flow() {
    var chunk = void 0;
    while (null !== (chunk = _tr5.read(10))) {
      _out5.push(chunk);
    }
  });

  _tr5.on('end', common.mustCall(function () {
    assert.deepStrictEqual(_out5, _expect5);
  }));
}

{
  // Verify hex encoding with read(13)
  var _tr6 = new TestReader(100, { encoding: 'hex' });
  var _out6 = [];
  var _expect6 = ['6161616161616', '1616161616161', '6161616161616', '1616161616161', '6161616161616', '1616161616161', '6161616161616', '1616161616161', '6161616161616', '1616161616161', '6161616161616', '1616161616161', '6161616161616', '1616161616161', '6161616161616', '16161'];

  _tr6.on('readable', function flow() {
    var chunk = void 0;
    while (null !== (chunk = _tr6.read(13))) {
      _out6.push(chunk);
    }
  });

  _tr6.on('end', common.mustCall(function () {
    assert.deepStrictEqual(_out6, _expect6);
  }));
}

{
  // Verify base64 encoding
  var _tr7 = new TestReader(100, { encoding: 'base64' });
  var _out7 = [];
  var _expect7 = ['YWFhYWFhYW', 'FhYWFhYWFh', 'YWFhYWFhYW', 'FhYWFhYWFh', 'YWFhYWFhYW', 'FhYWFhYWFh', 'YWFhYWFhYW', 'FhYWFhYWFh', 'YWFhYWFhYW', 'FhYWFhYWFh', 'YWFhYWFhYW', 'FhYWFhYWFh', 'YWFhYWFhYW', 'FhYQ=='];

  _tr7.on('readable', function flow() {
    var chunk = void 0;
    while (null !== (chunk = _tr7.read(10))) {
      _out7.push(chunk);
    }
  });

  _tr7.on('end', common.mustCall(function () {
    assert.deepStrictEqual(_out7, _expect7);
  }));
}

{
  // Verify chaining behavior
  var _tr8 = new TestReader(100);
  assert.deepStrictEqual(_tr8.setEncoding('utf8'), _tr8);
}