function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');
var stream = require('../../');

var Writable = function (_stream$Writable) {
  _inherits(Writable, _stream$Writable);

  function Writable() {
    _classCallCheck(this, Writable);

    var _this = _possibleConstructorReturn(this, _stream$Writable.call(this));

    _this.prependListener = undefined;
    return _this;
  }

  Writable.prototype._write = function _write(chunk, end, cb) {
    cb();
  };

  return Writable;
}(stream.Writable);

var Readable = function (_stream$Readable) {
  _inherits(Readable, _stream$Readable);

  function Readable() {
    _classCallCheck(this, Readable);

    return _possibleConstructorReturn(this, _stream$Readable.apply(this, arguments));
  }

  Readable.prototype._read = function _read() {
    this.push(null);
  };

  return Readable;
}(stream.Readable);

var w = new Writable();
w.on('pipe', common.mustCall());

var r = new Readable();
r.pipe(w);