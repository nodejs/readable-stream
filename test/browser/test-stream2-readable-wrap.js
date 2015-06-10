'use strict';
var common = require('../common');

var Readable = require('../../lib/_stream_readable');
var Writable = require('../../lib/_stream_writable');
var EE = require('events').EventEmitter;
var run = 0;
function runTest(t, highWaterMark, objectMode, produce) {
  t.test('run #' + (++run), function (t) {
    var old = new EE();
    var r = new Readable({ highWaterMark: highWaterMark,
                           objectMode: objectMode });
    t.equal(r, r.wrap(old));

    var ended = false;
    r.on('end', function() {
      ended = true;
    });

    old.pause = function() {
      //console.error('old.pause()');
      old.emit('pause');
      flowing = false;
    };

    old.resume = function() {
      //console.error('old.resume()');
      old.emit('resume');
      flow();
    };

    var flowing;
    var chunks = 10;
    var oldEnded = false;
    var expected = [];
    function flow() {
      flowing = true;
      while (flowing && chunks-- > 0) {
        var item = produce();
        expected.push(item);
        //console.log('old.emit', chunks, flowing);
        old.emit('data', item);
        //console.log('after emit', chunks, flowing);
      }
      if (chunks <= 0) {
        oldEnded = true;
        //console.log('old end', chunks, flowing);
        old.emit('end');
      }
    }

    var w = new Writable({ highWaterMark: highWaterMark * 2,
                           objectMode: objectMode });
    var written = [];
    w._write = function(chunk, encoding, cb) {
      //console.log('_write', chunk);
      written.push(chunk);
      setTimeout(cb);
    };

    w.on('finish', function() {
      performAsserts();
    });

    r.pipe(w);

    flow();

    function performAsserts() {
      t.ok(ended);
      t.ok(oldEnded);
      t.deepEqual(written, expected);
      t.end();
    }
  });
}
module.exports = function (t) {
  t.test('readable wrap', function (t) {
    runTest(t, 100, false, function() { return new Buffer(100); });
    runTest(t, 10, false, function() { return new Buffer('xxxxxxxxxx'); });
    runTest(t, 1, true, function() { return { foo: 'bar' }; });

    var objectChunks = [ 5, 'a', false, 0, '', 'xyz', { x: 4 }, 7, [], 555 ];
    runTest(t, 1, true, function() { return objectChunks.shift(); });
  });
}
