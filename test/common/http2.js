"use strict";

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*<replacement>*/
require('@babel/polyfill');

var util = require('util');

for (var i in util) {
  exports[i] = util[i];
}
/*</replacement>*/

/* eslint-disable node-core/required-modules */


'use strict';
/*<replacement>*/


var objectKeys = objectKeys || function (obj) {
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  return keys;
};
/*</replacement>*/
// An HTTP/2 testing tool used to create mock frames for direct testing
// of HTTP/2 endpoints.


var kFrameData = Symbol('frame-data');
var FLAG_EOS = 0x1;
var FLAG_ACK = 0x1;
var FLAG_EOH = 0x4;
var FLAG_PADDED = 0x8;
var PADDING = Buffer.alloc(255);
var kClientMagic = Buffer.from('505249202a20485454502f322' + 'e300d0a0d0a534d0d0a0d0a', 'hex');
var kFakeRequestHeaders = Buffer.from('828684410f7777772e65' + '78616d706c652e636f6d', 'hex');
var kFakeResponseHeaders = Buffer.from('4803333032580770726976617465611d' + '4d6f6e2c203231204f63742032303133' + '2032303a31333a323120474d546e1768' + '747470733a2f2f7777772e6578616d70' + '6c652e636f6d', 'hex');

function isUint32(val) {
  return val >>> 0 === val;
}

function isUint24(val) {
  return val >>> 0 === val && val <= 0xFFFFFF;
}

function isUint8(val) {
  return val >>> 0 === val && val <= 0xFF;
}

function write32BE(array, pos, val) {
  if (!isUint32(val)) throw new RangeError('val is not a 32-bit number');
  array[pos++] = val >> 24 & 0xff;
  array[pos++] = val >> 16 & 0xff;
  array[pos++] = val >> 8 & 0xff;
  array[pos++] = val & 0xff;
}

function write24BE(array, pos, val) {
  if (!isUint24(val)) throw new RangeError('val is not a 24-bit number');
  array[pos++] = val >> 16 & 0xff;
  array[pos++] = val >> 8 & 0xff;
  array[pos++] = val & 0xff;
}

function write8(array, pos, val) {
  if (!isUint8(val)) throw new RangeError('val is not an 8-bit number');
  array[pos] = val;
}

var Frame = /*#__PURE__*/function () {
  function Frame(length, type, flags, id) {
    _classCallCheck(this, Frame);

    this[kFrameData] = Buffer.alloc(9);
    write24BE(this[kFrameData], 0, length);
    write8(this[kFrameData], 3, type);
    write8(this[kFrameData], 4, flags);
    write32BE(this[kFrameData], 5, id);
  }

  _createClass(Frame, [{
    key: "data",
    get: function get() {
      return this[kFrameData];
    }
  }]);

  return Frame;
}();

var SettingsFrame = /*#__PURE__*/function (_Frame) {
  _inherits(SettingsFrame, _Frame);

  var _super = _createSuper(SettingsFrame);

  function SettingsFrame() {
    var ack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    _classCallCheck(this, SettingsFrame);

    var flags = 0;
    if (ack) flags |= FLAG_ACK;
    return _super.call(this, 0, 4, flags, 0);
  }

  return SettingsFrame;
}(Frame);

var DataFrame = /*#__PURE__*/function (_Frame2) {
  _inherits(DataFrame, _Frame2);

  var _super2 = _createSuper(DataFrame);

  function DataFrame(id, payload) {
    var _this;

    var padlen = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var final = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    _classCallCheck(this, DataFrame);

    var len = payload.length;
    var flags = 0;
    if (final) flags |= FLAG_EOS;
    var buffers = [payload];

    if (padlen > 0) {
      buffers.unshift(Buffer.from([padlen]));
      buffers.push(PADDING.slice(0, padlen));
      len += padlen + 1;
      flags |= FLAG_PADDED;
    }

    _this = _super2.call(this, len, 0, flags, id);
    buffers.unshift(_this[kFrameData]);
    _this[kFrameData] = Buffer.concat(buffers);
    return _this;
  }

  return DataFrame;
}(Frame);

var HeadersFrame = /*#__PURE__*/function (_Frame3) {
  _inherits(HeadersFrame, _Frame3);

  var _super3 = _createSuper(HeadersFrame);

  function HeadersFrame(id, payload) {
    var _this2;

    var padlen = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var final = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    _classCallCheck(this, HeadersFrame);

    var len = payload.length;
    var flags = FLAG_EOH;
    if (final) flags |= FLAG_EOS;
    var buffers = [payload];

    if (padlen > 0) {
      buffers.unshift(Buffer.from([padlen]));
      buffers.push(PADDING.slice(0, padlen));
      len += padlen + 1;
      flags |= FLAG_PADDED;
    }

    _this2 = _super3.call(this, len, 1, flags, id);
    buffers.unshift(_this2[kFrameData]);
    _this2[kFrameData] = Buffer.concat(buffers);
    return _this2;
  }

  return HeadersFrame;
}(Frame);

var PingFrame = /*#__PURE__*/function (_Frame4) {
  _inherits(PingFrame, _Frame4);

  var _super4 = _createSuper(PingFrame);

  function PingFrame() {
    var _this3;

    var ack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    _classCallCheck(this, PingFrame);

    var buffers = [Buffer.alloc(8)];
    _this3 = _super4.call(this, 8, 6, ack ? 1 : 0, 0);
    buffers.unshift(_this3[kFrameData]);
    _this3[kFrameData] = Buffer.concat(buffers);
    return _this3;
  }

  return PingFrame;
}(Frame);

var AltSvcFrame = /*#__PURE__*/function (_Frame5) {
  _inherits(AltSvcFrame, _Frame5);

  var _super5 = _createSuper(AltSvcFrame);

  function AltSvcFrame(size) {
    var _this4;

    _classCallCheck(this, AltSvcFrame);

    var buffers = [Buffer.alloc(size)];
    _this4 = _super5.call(this, size, 10, 0, 0);
    buffers.unshift(_this4[kFrameData]);
    _this4[kFrameData] = Buffer.concat(buffers);
    return _this4;
  }

  return AltSvcFrame;
}(Frame);

module.exports = {
  Frame: Frame,
  AltSvcFrame: AltSvcFrame,
  DataFrame: DataFrame,
  HeadersFrame: HeadersFrame,
  SettingsFrame: SettingsFrame,
  PingFrame: PingFrame,
  kFakeRequestHeaders: kFakeRequestHeaders,
  kFakeResponseHeaders: kFakeResponseHeaders,
  kClientMagic: kClientMagic
};

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}