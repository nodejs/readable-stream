'use strict';

var _possibleConstructorReturn2;

function _load_possibleConstructorReturn() {
  return _possibleConstructorReturn2 = _interopRequireDefault(require('babel-runtime/helpers/possibleConstructorReturn'));
}

var _inherits2;

function _load_inherits() {
  return _inherits2 = _interopRequireDefault(require('babel-runtime/helpers/inherits'));
}

var _classCallCheck2;

function _load_classCallCheck() {
  return _classCallCheck2 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));
}

var _createClass2;

function _load_createClass() {
  return _createClass2 = _interopRequireDefault(require('babel-runtime/helpers/createClass'));
}

var _symbol;

function _load_symbol() {
  return _symbol = _interopRequireDefault(require('babel-runtime/core-js/symbol'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*<replacement>*/
require('babel-polyfill');
var util = require('util');
for (var i in util) {
  exports[i] = util[i];
} /*</replacement>*/ /* eslint-disable node-core/required-modules */
'use strict';

/*<replacement>*/
var objectKeys = objectKeys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

// An HTTP/2 testing tool used to create mock frames for direct testing
// of HTTP/2 endpoints.

var kFrameData = (0, (_symbol || _load_symbol()).default)('frame-data');
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

var Frame = function () {
  function Frame(length, type, flags, id) {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, Frame);

    this[kFrameData] = Buffer.alloc(9);
    write24BE(this[kFrameData], 0, length);
    write8(this[kFrameData], 3, type);
    write8(this[kFrameData], 4, flags);
    write32BE(this[kFrameData], 5, id);
  }

  (0, (_createClass2 || _load_createClass()).default)(Frame, [{
    key: 'data',
    get: function () {
      return this[kFrameData];
    }
  }]);
  return Frame;
}();

var SettingsFrame = function (_Frame) {
  (0, (_inherits2 || _load_inherits()).default)(SettingsFrame, _Frame);

  function SettingsFrame() {
    var ack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, SettingsFrame);

    var flags = 0;
    if (ack) flags |= FLAG_ACK;
    return (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _Frame.call(this, 0, 4, flags, 0));
  }

  return SettingsFrame;
}(Frame);

var DataFrame = function (_Frame2) {
  (0, (_inherits2 || _load_inherits()).default)(DataFrame, _Frame2);

  function DataFrame(id, payload) {
    var padlen = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var final = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, DataFrame);

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

    var _this2 = (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _Frame2.call(this, len, 0, flags, id));

    buffers.unshift(_this2[kFrameData]);
    _this2[kFrameData] = Buffer.concat(buffers);
    return _this2;
  }

  return DataFrame;
}(Frame);

var HeadersFrame = function (_Frame3) {
  (0, (_inherits2 || _load_inherits()).default)(HeadersFrame, _Frame3);

  function HeadersFrame(id, payload) {
    var padlen = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var final = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, HeadersFrame);

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

    var _this3 = (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _Frame3.call(this, len, 1, flags, id));

    buffers.unshift(_this3[kFrameData]);
    _this3[kFrameData] = Buffer.concat(buffers);
    return _this3;
  }

  return HeadersFrame;
}(Frame);

var PingFrame = function (_Frame4) {
  (0, (_inherits2 || _load_inherits()).default)(PingFrame, _Frame4);

  function PingFrame() {
    var ack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, PingFrame);

    var buffers = [Buffer.alloc(8)];

    var _this4 = (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _Frame4.call(this, 8, 6, ack ? 1 : 0, 0));

    buffers.unshift(_this4[kFrameData]);
    _this4[kFrameData] = Buffer.concat(buffers);
    return _this4;
  }

  return PingFrame;
}(Frame);

var AltSvcFrame = function (_Frame5) {
  (0, (_inherits2 || _load_inherits()).default)(AltSvcFrame, _Frame5);

  function AltSvcFrame(size) {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, AltSvcFrame);

    var buffers = [Buffer.alloc(size)];

    var _this5 = (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, _Frame5.call(this, size, 10, 0, 0));

    buffers.unshift(_this5[kFrameData]);
    _this5[kFrameData] = Buffer.concat(buffers);
    return _this5;
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