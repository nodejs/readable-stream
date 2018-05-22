function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');
var assert = require('assert/');

var stream = require('../../');

var MyWritable = function (_stream$Writable) {
  _inherits(MyWritable, _stream$Writable);

  function MyWritable(opt) {
    _classCallCheck(this, MyWritable);

    return _possibleConstructorReturn(this, _stream$Writable.call(this, opt));
  }

  MyWritable.prototype._write = function _write(chunk, encoding, callback) {
    assert.notStrictEqual(chunk, null);
    callback();
  };

  return MyWritable;
}(stream.Writable);

common.expectsError(function () {
  var m = new MyWritable({ objectMode: true });
  m.write(null, function (err) {
    return assert.ok(err);
  });
}, {
  code: 'ERR_STREAM_NULL_VALUES',
  type: TypeError,
  message: 'May not write null values to stream'
});

{
  // Should not throw.
  var m = new MyWritable({ objectMode: true }).on('error', assert);
  m.write(null, assert);
}

common.expectsError(function () {
  var m = new MyWritable();
  m.write(false, function (err) {
    return assert.ok(err);
  });
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  type: TypeError
});

{
  // Should not throw.
  var _m = new MyWritable().on('error', assert);
  _m.write(false, assert);
}

{
  // Should not throw.
  var _m2 = new MyWritable({ objectMode: true });
  _m2.write(false, assert.ifError);
}

{
  // Should not throw.
  var _m3 = new MyWritable({ objectMode: true }).on('error', function (e) {
    assert.ifError(e || new Error('should not get here'));
  });
  _m3.write(false, assert.ifError);
}
;require('tap').pass('sync run');