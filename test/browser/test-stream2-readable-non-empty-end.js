'use strict';
var common = require('../common');
var Readable = require('../../lib/_stream_readable');
module.exports = function (t) {
  t.test('non empty end', function (t) {
    t.plan(4);
    var len = 0;
    var chunks = new Array(10);
    for (var i = 1; i <= 10; i++) {
      chunks[i - 1] = new Buffer(i);
      len += i;
    }

    var test = new Readable();
    var n = 0;
    test._read = function(size) {
      var chunk = chunks[n++];
      setTimeout(function() {
        test.push(chunk === undefined ? null : chunk);
      });
    };

    test.on('end', thrower);
    function thrower() {
      throw new Error('this should not happen!');
    }

    var bytesread = 0;
    test.on('readable', function() {
      var b = len - bytesread - 1;
      var res = test.read(b);
      if (res) {
        bytesread += res.length;
        //console.error('br=%d len=%d', bytesread, len);
        setTimeout(next);
      }
      test.read(0);
    });
    test.read(0);

    function next() {
      // now let's make 'end' happen
      test.removeListener('end', thrower);

      test.on('end', function() {
        t.ok(true, 'end emitted');
      });

      // one to get the last byte
      var r = test.read();
      t.ok(r);
      t.equal(r.length, 1);
      r = test.read();
      t.equal(r, null);
    }
  });
}
