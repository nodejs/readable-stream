"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


require('../common');

var assert = require('assert/');

var stream = require('../../');

var writable = new stream.Writable();

function testStates(ending, finished, ended) {
  assert.strictEqual(writable._writableState.ending, ending);
  assert.strictEqual(writable._writableState.finished, finished);
  assert.strictEqual(writable._writableState.ended, ended);
}

writable._write = function (chunk, encoding, cb) {
  // ending, finished, ended start in false.
  testStates(false, false, false);
  cb();
};

writable.on('finish', function () {
  // ending, finished, ended = true.
  testStates(true, true, true);
});
var result = writable.end('testing function end()', function () {
  // ending, finished, ended = true.
  testStates(true, true, true);
}); // end returns the writable instance

assert.strictEqual(result, writable); // ending, ended = true.
// finished = false.

testStates(true, false, true);
;

(function () {
  var t = require('tap');

  t.pass('sync run');
})();

var _list = process.listeners('uncaughtException');

process.removeAllListeners('uncaughtException');

_list.pop();

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});