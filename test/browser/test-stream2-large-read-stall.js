'use strict';
var common = require('../common');
module.exports = function (t) {
  t.test('large object read stall', function (t) {

// If everything aligns so that you do a read(n) of exactly the
// remaining buffer, then make sure that 'end' still emits.

    var READSIZE = 100;
    var PUSHSIZE = 20;
    var PUSHCOUNT = 1000;
    var HWM = 50;

    var Readable = require('../../').Readable;
    var r = new Readable({
      highWaterMark: HWM
    });
    var rs = r._readableState;

    r._read = push;

    r.on('readable', function() {
      ;false && console.error('>> readable');
      do {
        ;false && console.error('  > read(%d)', READSIZE);
        var ret = r.read(READSIZE);
        ;false && console.error('  < %j (%d remain)', ret && ret.length, rs.length);
      } while (ret && ret.length === READSIZE);

      ;false && console.error('<< after read()',
                    ret && ret.length,
                    rs.needReadable,
                    rs.length);
    });

    var endEmitted = false;
    r.on('end', function() {
      t.equal(pushes, PUSHCOUNT + 1);
      t.end();
      ;false && console.error('end');
    });

    var pushes = 0;
    function push() {
      if (pushes > PUSHCOUNT)
        return;

      if (pushes++ === PUSHCOUNT) {
        ;false && console.error('   push(EOF)');
        return r.push(null);
      }

      ;false && console.error('   push #%d', pushes);
      if (r.push(new Buffer(PUSHSIZE)))
        setTimeout(push);
    }

    // start the flow
    var ret = r.read(0);

  });
}
