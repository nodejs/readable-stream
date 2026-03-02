require('../common');
var util = require('util');
var stream = require('../../');
var WritableStream = stream.Writable;


var InternalStream = function() {
    WritableStream.call(this);
};
util.inherits(InternalStream, WritableStream);

InternalStream.prototype._write = function(chunk, encoding, callback) {
    callback();
};

var internalStream = new InternalStream();



var ExternalStream = function(writable) {
    this._writable = writable;
    WritableStream.call(this);
};
util.inherits(ExternalStream, WritableStream);

ExternalStream.prototype._write = function(chunk, encoding, callback) {
    this._writable.write(chunk, encoding, callback);
};



var externalStream = new ExternalStream(internalStream);

for (var i = 0; i < 2000; i++) {
    externalStream.write(i.toString());
}
