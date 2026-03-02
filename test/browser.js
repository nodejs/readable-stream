if (!global.console) {
  global.console = {};
}
if (!global.console.log) {
  global.console.log = function () {};
}
if (!global.console.error) {
  global.console.error = global.console.log;
}
if (!global.console.info) {
  global.console.info = global.console.log;
}
var test = require('tape');

test('streams', function (t) {
  require('./browser/test-stream-big-packet')(t);
  require('./browser/test-stream-big-push')(t);
  require('./browser/test-stream-duplex')(t);
  require('./browser/test-stream-end-paused')(t);
  require('./browser/test-stream-ispaused')(t);
  require('./browser/test-stream-pipe-after-end')(t);
  require('./browser/test-stream-pipe-cleanup')(t);
  require('./browser/test-stream-pipe-cleanup-pause')(t);
  require('./browser/test-stream-pipe-error-handling')(t);
  require('./browser/test-stream-pipe-event')(t);
  require('./browser/test-stream-push-order')(t);
  require('./browser/test-stream-push-strings')(t);
  require('./browser/test-stream-readable-constructor-set-methods')(t);
  require('./browser/test-stream-readable-event')(t);
  require('./browser/test-stream-transform-constructor-set-methods')(t);
  require('./browser/test-stream-transform-objectmode-falsey-value')(t);
  require('./browser/test-stream-transform-split-objectmode')(t);
  require('./browser/test-stream-unshift-empty-chunk')(t);
  require('./browser/test-stream-unshift-read-race')(t);
  require('./browser/test-stream-writable-change-default-encoding')(t);
  require('./browser/test-stream-writable-constructor-set-methods')(t);
  require('./browser/test-stream-writable-decoded-encoding')(t);
  require('./browser/test-stream-writev')(t);
  require('./browser/test-stream-sync-write')(t);
  require('./browser/test-stream-pipe-without-listenerCount');
});

test('streams 2', function (t) {
  require('./browser/test-stream2-base64-single-char-read-end')(t);
  require('./browser/test-stream2-compatibility')(t);
  require('./browser/test-stream2-large-read-stall')(t);
  require('./browser/test-stream2-objects')(t);
  require('./browser/test-stream2-pipe-error-handling')(t);
  require('./browser/test-stream2-pipe-error-once-listener')(t);
  require('./browser/test-stream2-push')(t);
  require('./browser/test-stream2-readable-empty-buffer-no-eof')(t);
  require('./browser/test-stream2-readable-from-list')(t);
  require('./browser/test-stream2-transform')(t);
  require('./browser/test-stream2-set-encoding')(t);
  require('./browser/test-stream2-readable-legacy-drain')(t);
  require('./browser/test-stream2-readable-wrap-empty')(t);
  require('./browser/test-stream2-readable-non-empty-end')(t);
  require('./browser/test-stream2-readable-wrap')(t);
  require('./browser/test-stream2-unpipe-drain')(t);
  require('./browser/test-stream2-writable')(t);
});
test('streams 3', function (t) {
  require('./browser/test-stream3-pause-then-read')(t);
});
