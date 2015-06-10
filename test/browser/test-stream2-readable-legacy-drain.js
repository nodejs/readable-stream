'use strict';
var common = require('../common');

var Stream = require('../../');
var Readable = require('../../').Readable;
module.exports = function (t) {
  t.test('readable legacy drain', function (t) {
    var r = new Readable();
    var N = 256;
    var reads = 0;
    r._read = function(n) {
      return r.push(++reads === N ? null : new Buffer(1));
    };
    t.plan(2);
    r.on('end', function() {
      t.ok(true, 'rended');
    });

    var w = new Stream();
    w.writable = true;
    var writes = 0;
    var buffered = 0;
    w.write = function(c) {
      writes += c.length;
      buffered += c.length;
      process.nextTick(drain);
      return false;
    };

    function drain() {
      if(buffered > 3) {
        t.ok(false, 'to much buffer');
      }
      buffered = 0;
      w.emit('drain');
    }


    w.end = function() {
      t.ok(true, 'wended');
    };

    // Just for kicks, let's mess with the drain count.
    // This verifies that even if it gets negative in the
    // pipe() cleanup function, we'll still function properly.
    r.on('readable', function() {
      w.emit('drain');
    });

    r.pipe(w);
});
}
