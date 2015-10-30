'use strict';
var common = require('../common');
var stream = require('../../');
module.exports = function (t) {
  t.test('pipe cleanup pause', function (t) {
    t.plan(3);
    var reader = new stream.Readable();
    var writer1 = new stream.Writable();
    var writer2 = new stream.Writable();

    // 560000 is chosen here because it is larger than the (default) highWaterMark
    // and will cause `.write()` to return false
    // See: https://github.com/nodejs/node/issues/2323
    var buffer = new Buffer(560000);

    reader._read = function() {};

    writer1._write = common.mustCall(function(chunk, encoding, cb) {
      this.emit('chunk-received');
      cb();
    }, 1);
    writer1.once('chunk-received', function() {
      reader.unpipe(writer1);
      reader.pipe(writer2);
      reader.push(buffer);
      setImmediate(function() {
        reader.push(buffer);
        setImmediate(function() {
          reader.push(buffer);
        });
      });
    });

    writer2._write = function(chunk, encoding, cb) {
      t.ok(true);
      cb();
    };

    reader.pipe(writer1);
    reader.push(buffer);
  });
};
