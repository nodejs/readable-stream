'use strict';
var common = require('../common');

var stream = require('../../');
module.exports = function (t) {
  t.test('is paused', function (t) {
    var readable = new stream.Readable();

    // _read is a noop, here.
    readable._read = Function();

    // default state of a stream is not "paused"
    t.notOk(readable.isPaused());

    // make the stream start flowing...
    readable.on('data', Function());

    // still not paused.
    t.notOk(readable.isPaused());

    readable.pause();
    t.ok(readable.isPaused());
    readable.resume();
    t.notOk(readable.isPaused());
    t.end();
  });
}
