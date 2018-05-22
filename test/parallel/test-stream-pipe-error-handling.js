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
var Stream = require('stream').Stream;

{
  var source = new Stream();
  var dest = new Stream();

  source.pipe(dest);

  var gotErr = null;
  source.on('error', function (err) {
    gotErr = err;
  });

  var err = new Error('This stream turned into bacon.');
  source.emit('error', err);
  assert.strictEqual(gotErr, err);
}

{
  var _source = new Stream();
  var _dest = new Stream();

  _source.pipe(_dest);

  var _err = new Error('This stream turned into bacon.');

  var _gotErr = null;
  try {
    _source.emit('error', _err);
  } catch (e) {
    _gotErr = e;
  }

  assert.strictEqual(_gotErr, _err);
}

{
  var R = require('../../').Readable;
  var W = require('../../').Writable;

  var r = new R();
  var w = new W();
  var removed = false;

  r._read = common.mustCall(function () {
    setTimeout(common.mustCall(function () {
      assert(removed);
      assert.throws(function () {
        w.emit('error', new Error('fail'));
      }, /^Error: fail$/);
    }), 1);
  });

  w.on('error', myOnError);
  r.pipe(w);
  w.removeListener('error', myOnError);
  removed = true;

  function myOnError() {
    throw new Error('this should not happen');
  }
}

{
  var _R = require('../../').Readable;
  var _W = require('../../').Writable;

  var _r = new _R();
  var _w = new _W();
  var _removed = false;

  _r._read = common.mustCall(function () {
    setTimeout(common.mustCall(function () {
      assert(_removed);
      _w.emit('error', new Error('fail'));
    }), 1);
  });

  _w.on('error', common.mustCall());
  _w._write = function () {};

  _r.pipe(_w);
  // Removing some OTHER random listener should not do anything
  _w.removeListener('error', function () {});
  _removed = true;
}
;require('tap').pass('sync run');