'use strict';

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');

var _require = require('../../'),
    Readable = _require.Readable,
    PassThrough = _require.PassThrough;

function test(r) {
  var wrapper = new Readable({
    read: function () {
      var data = r.read();

      if (data) {
        wrapper.push(data);
        return;
      }

      r.once('readable', function () {
        data = r.read();
        if (data) {
          wrapper.push(data);
        }
        // else the end event should fire
      });
    }
  });

  r.once('end', function () {
    wrapper.push(null);
  });

  wrapper.resume();
  wrapper.once('end', common.mustCall());
}

{
  var source = new Readable({
    read: function () {}
  });
  source.push('foo');
  source.push('bar');
  source.push(null);

  var pt = source.pipe(new PassThrough());
  test(pt);
}

{
  // This is the underlying cause of the above test case.
  var pushChunks = ['foo', 'bar'];
  var r = new Readable({
    read: function () {
      var chunk = pushChunks.shift();
      if (chunk) {
        // synchronous call
        r.push(chunk);
      } else {
        // asynchronous call
        process.nextTick(function () {
          return r.push(null);
        });
      }
    }
  });

  test(r);
}
;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});