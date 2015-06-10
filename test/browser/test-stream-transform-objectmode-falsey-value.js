'use strict';
var common = require('../common');

var stream = require('../../');
var PassThrough = stream.PassThrough;
module.exports = function (t) {
  t.test('transform objectmode falsey value', function (t) {
    var src = new PassThrough({ objectMode: true });
    var tx = new PassThrough({ objectMode: true });
    var dest = new PassThrough({ objectMode: true });

    var expect = [ -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
    var results = [];
    dest.on('end', function() {
      t.deepEqual(results, expect);
      t.end();
    });

    dest.on('data', function(x) {
      results.push(x);
    });

    src.pipe(tx).pipe(dest);

    var i = -1;
    var int = setInterval(function() {
      if (i > 10) {
        src.end();
        clearInterval(int);
      } else {
        t.ok(true);
        src.write(i++);
      }
    }, 10);
  });
}
