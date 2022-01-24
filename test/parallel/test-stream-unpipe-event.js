"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

if (process.version.indexOf('v0.8') === 0) {
  process.exit(0);
}
/*<replacement>*/


var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var assert = require('assert/');

var _require = require('../../'),
    Writable = _require.Writable,
    Readable = _require.Readable;

var NullWriteable = /*#__PURE__*/function (_Writable) {
  _inherits(NullWriteable, _Writable);

  var _super = _createSuper(NullWriteable);

  function NullWriteable() {
    _classCallCheck(this, NullWriteable);

    return _super.apply(this, arguments);
  }

  _createClass(NullWriteable, [{
    key: "_write",
    value: function _write(chunk, encoding, callback) {
      return callback();
    }
  }]);

  return NullWriteable;
}(Writable);

var QuickEndReadable = /*#__PURE__*/function (_Readable) {
  _inherits(QuickEndReadable, _Readable);

  var _super2 = _createSuper(QuickEndReadable);

  function QuickEndReadable() {
    _classCallCheck(this, QuickEndReadable);

    return _super2.apply(this, arguments);
  }

  _createClass(QuickEndReadable, [{
    key: "_read",
    value: function _read() {
      this.push(null);
    }
  }]);

  return QuickEndReadable;
}(Readable);

var NeverEndReadable = /*#__PURE__*/function (_Readable2) {
  _inherits(NeverEndReadable, _Readable2);

  var _super3 = _createSuper(NeverEndReadable);

  function NeverEndReadable() {
    _classCallCheck(this, NeverEndReadable);

    return _super3.apply(this, arguments);
  }

  _createClass(NeverEndReadable, [{
    key: "_read",
    value: function _read() {}
  }]);

  return NeverEndReadable;
}(Readable);

{
  var dest = new NullWriteable();
  var src = new QuickEndReadable();
  dest.on('pipe', common.mustCall());
  dest.on('unpipe', common.mustCall());
  src.pipe(dest);
  setImmediate(function () {
    assert.strictEqual(src._readableState.pipesCount, 0);
  });
}
{
  var _dest = new NullWriteable();

  var _src = new NeverEndReadable();

  _dest.on('pipe', common.mustCall());

  _dest.on('unpipe', common.mustNotCall('unpipe should not have been emitted'));

  _src.pipe(_dest);

  setImmediate(function () {
    assert.strictEqual(_src._readableState.pipesCount, 1);
  });
}
{
  var _dest2 = new NullWriteable();

  var _src2 = new NeverEndReadable();

  _dest2.on('pipe', common.mustCall());

  _dest2.on('unpipe', common.mustCall());

  _src2.pipe(_dest2);

  _src2.unpipe(_dest2);

  setImmediate(function () {
    assert.strictEqual(_src2._readableState.pipesCount, 0);
  });
}
{
  var _dest3 = new NullWriteable();

  var _src3 = new QuickEndReadable();

  _dest3.on('pipe', common.mustCall());

  _dest3.on('unpipe', common.mustCall());

  _src3.pipe(_dest3, {
    end: false
  });

  setImmediate(function () {
    assert.strictEqual(_src3._readableState.pipesCount, 0);
  });
}
{
  var _dest4 = new NullWriteable();

  var _src4 = new NeverEndReadable();

  _dest4.on('pipe', common.mustCall());

  _dest4.on('unpipe', common.mustNotCall('unpipe should not have been emitted'));

  _src4.pipe(_dest4, {
    end: false
  });

  setImmediate(function () {
    assert.strictEqual(_src4._readableState.pipesCount, 1);
  });
}
{
  var _dest5 = new NullWriteable();

  var _src5 = new NeverEndReadable();

  _dest5.on('pipe', common.mustCall());

  _dest5.on('unpipe', common.mustCall());

  _src5.pipe(_dest5, {
    end: false
  });

  _src5.unpipe(_dest5);

  setImmediate(function () {
    assert.strictEqual(_src5._readableState.pipesCount, 0);
  });
}
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