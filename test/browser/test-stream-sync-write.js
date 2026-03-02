require('../common');
var inherits = require('inherits');
var stream = require('../../');
var WritableStream = stream.Writable;
module.exports = function(t) {
  t.test('should bea ble to write sync', function(t) {
    var InternalStream = function() {
      WritableStream.call(this);
    };
    inherits(InternalStream, WritableStream);

    InternalStream.prototype._write = function(chunk, encoding, callback) {
      callback();
    };

    var internalStream = new InternalStream();



    var ExternalStream = function(writable) {
      this._writable = writable;
      WritableStream.call(this);
    };
    inherits(ExternalStream, WritableStream);

    ExternalStream.prototype._write = function(chunk, encoding, callback) {
      this._writable.write(chunk, encoding, callback);
    };



    var externalStream = new ExternalStream(internalStream);

    for (var i = 0; i < 2000; i++) {
      externalStream.write(i.toString());
    }
    t.end();
  });
}
