'use strict';
var common = require('../common');
var Readable = require('../../').Readable;
module.exports = function (t) {
  t.test('push order', function (t) {
    t.plan(1);
    var s = new Readable({
      highWaterMark: 20,
      encoding: 'ascii'
    });

    var list = ['1', '2', '3', '4', '5', '6'];

    s._read = function(n) {
      var one = list.shift();
      if (!one) {
        s.push(null);
      } else {
        var two = list.shift();
        s.push(one);
        s.push(two);
      }
    };

    var v = s.read(0);

    // ACTUALLY [1, 3, 5, 6, 4, 2]

    setTimeout(function() {
      t.equals(s._readableState.buffer.join(','), '1,2,3,4,5,6');
    });
  });
}
