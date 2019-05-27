"use strict";

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var stream = require('../../');

var Writable =
/*#__PURE__*/
function (_stream$Writable) {
  _inheritsLoose(Writable, _stream$Writable);

  function Writable() {
    var _this;

    _this = _stream$Writable.call(this) || this;
    _this.prependListener = undefined;
    return _this;
  }

  var _proto = Writable.prototype;

  _proto._write = function _write(chunk, end, cb) {
    cb();
  };

  return Writable;
}(stream.Writable);

var Readable =
/*#__PURE__*/
function (_stream$Readable) {
  _inheritsLoose(Readable, _stream$Readable);

  function Readable() {
    return _stream$Readable.apply(this, arguments) || this;
  }

  var _proto2 = Readable.prototype;

  _proto2._read = function _read() {
    this.push(null);
  };

  return Readable;
}(stream.Readable);

var w = new Writable();
w.on('pipe', common.mustCall());
var r = new Readable();
r.pipe(w);
;

(function () {
  var t = require('tap');

  t.pass('sync run');
})();

var _list = process.listeners('uncaughtException');

process.removeAllListeners('uncaughtException');

_list.pop();

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});