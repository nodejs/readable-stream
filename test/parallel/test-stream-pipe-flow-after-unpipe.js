/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');

var _require = require('../../'),
    Readable = _require.Readable,
    Writable = _require.Writable;

// Tests that calling .unpipe() un-blocks a stream that is paused because
// it is waiting on the writable side to finish a write().

var rs = new Readable({
  highWaterMark: 1,
  // That this gets called at least 20 times is the real test here.
  read: common.mustCallAtLeast(function () {
    return rs.push('foo');
  }, 20)
});

var ws = new Writable({
  highWaterMark: 1,
  write: common.mustCall(function () {
    // Ignore the callback, this write() simply never finishes.
    setImmediate(function () {
      return rs.unpipe(ws);
    });
  })
});

var chunks = 0;
rs.on('data', common.mustCallAtLeast(function () {
  chunks++;
  if (chunks >= 20) rs.pause(); // Finish this test.
}));

rs.pipe(ws);
;require('tap').pass('sync run');