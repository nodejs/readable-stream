'use strict';
var common = require('../common');

var Transform = require('../../').Transform;
module.exports = function (t) {
  t.test('transform split objectmode', function (t) {
    t.plan(10);
    var parser = new Transform({ readableObjectMode : true });

    t.ok(parser._readableState.objectMode, 'parser 1');
    t.notOk(parser._writableState.objectMode, 'parser 2');
    t.equals(parser._readableState.highWaterMark, 16, 'parser 3');
    t.equals(parser._writableState.highWaterMark, (16 * 1024), 'parser 4');

    parser._transform = function(chunk, enc, callback) {
      callback(null, { val : chunk[0] });
    };

    var parsed;

    parser.on('data', function(obj) {
      parsed = obj;
    });

    parser.end(new Buffer([42]));

    parser.on('end', function() {
      t.equals(parsed.val, 42, 'parser ended');
    });


    var serializer = new Transform({ writableObjectMode : true });

    t.notOk(serializer._readableState.objectMode, 'serializer 1');
    t.ok(serializer._writableState.objectMode, 'serializer 2');
    t.equals(serializer._readableState.highWaterMark, (16 * 1024), 'serializer 3');
    t.equals(serializer._writableState.highWaterMark, 16, 'serializer 4');

    serializer._transform = function(obj, _, callback) {
      callback(null, new Buffer([obj.val]));
    };

    var serialized;

    serializer.on('data', function(chunk) {
      serialized = chunk;
    });

    serializer.write({ val : 42 });

    serializer.on('end', function() {
      t.equals(serialized[0], 42, 'searlizer ended');
    });
    setImmediate(function () {
      serializer.end();
    });
  });
}
