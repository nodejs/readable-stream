'use strict';

var _classCallCheck2;

function _load_classCallCheck() {
  return _classCallCheck2 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));
}

var _possibleConstructorReturn2;

function _load_possibleConstructorReturn() {
  return _possibleConstructorReturn2 = _interopRequireDefault(require('babel-runtime/helpers/possibleConstructorReturn'));
}

var _inherits2;

function _load_inherits() {
  return _inherits2 = _interopRequireDefault(require('babel-runtime/helpers/inherits'));
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
var stream = require('../../');

var Read = function (_stream$Readable) {
  (0, (_inherits2 || _load_inherits()).default)(Read, _stream$Readable);

  function Read() {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, Read);
    return (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _stream$Readable.apply(this, arguments));
  }

  Read.prototype._read = function _read(size) {
    this.push('x');
    this.push(null);
  };

  return Read;
}(stream.Readable);

var Write = function (_stream$Writable) {
  (0, (_inherits2 || _load_inherits()).default)(Write, _stream$Writable);

  function Write() {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, Write);
    return (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _stream$Writable.apply(this, arguments));
  }

  Write.prototype._write = function _write(buffer, encoding, cb) {
    this.emit('error', new Error('boom'));
    this.emit('alldone');
  };

  return Write;
}(stream.Writable);

var read = new Read();
var write = new Write();

write.once('error', function () {});
write.once('alldone', function (err) {
  require('tap').pass();
});

process.on('exit', function (c) {
  console.error('error thrown even with listener');
});

read.pipe(write);
;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});