'use strict';

var _setImmediate2;

function _load_setImmediate() {
  return _setImmediate2 = _interopRequireDefault(require('babel-runtime/core-js/set-immediate'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');
var stream = require('../../');

var reader = new stream.Readable();
var writer1 = new stream.Writable();
var writer2 = new stream.Writable();

// 560000 is chosen here because it is larger than the (default) highWaterMark
// and will cause `.write()` to return false
// See: https://github.com/nodejs/node/issues/2323
var buffer = bufferShim.allocUnsafe(560000);

reader._read = function () {};

writer1._write = common.mustCall(function (chunk, encoding, cb) {
  this.emit('chunk-received');
  cb();
}, 1);
writer1.once('chunk-received', function () {
  reader.unpipe(writer1);
  reader.pipe(writer2);
  reader.push(buffer);
  (0, (_setImmediate2 || _load_setImmediate()).default)(function () {
    reader.push(buffer);
    (0, (_setImmediate2 || _load_setImmediate()).default)(function () {
      reader.push(buffer);
    });
  });
});

writer2._write = common.mustCall(function (chunk, encoding, cb) {
  cb();
}, 3);

reader.pipe(writer1);
reader.push(buffer);
;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});