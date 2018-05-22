/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');

var _require = require('../../'),
    Readable = _require.Readable,
    Writable = _require.Writable,
    PassThrough = _require.PassThrough;

{
  var ticks = 17;

  var rs = new Readable({
    objectMode: true,
    read: function () {
      if (ticks-- > 0) return process.nextTick(function () {
        return rs.push({});
      });
      rs.push({});
      rs.push(null);
    }
  });

  var ws = new Writable({
    highWaterMark: 0,
    objectMode: true,
    write: function (data, end, cb) {
      return setImmediate(cb);
    }
  });

  rs.on('end', common.mustCall());
  ws.on('finish', common.mustCall());
  rs.pipe(ws);
}

{
  var missing = 8;

  var _rs = new Readable({
    objectMode: true,
    read: function () {
      if (missing--) _rs.push({});else _rs.push(null);
    }
  });

  var pt = _rs.pipe(new PassThrough({ objectMode: true, highWaterMark: 2 })).pipe(new PassThrough({ objectMode: true, highWaterMark: 2 }));

  pt.on('end', function () {
    wrapper.push(null);
  });

  var wrapper = new Readable({
    objectMode: true,
    read: function () {
      process.nextTick(function () {
        var data = pt.read();
        if (data === null) {
          pt.once('readable', function () {
            data = pt.read();
            if (data !== null) wrapper.push(data);
          });
        } else {
          wrapper.push(data);
        }
      });
    }
  });

  wrapper.resume();
  wrapper.on('end', common.mustCall());
}
;require('tap').pass('sync run');