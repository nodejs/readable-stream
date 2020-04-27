"use strict";

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var stream = require('../../');

var assert = require('assert/');

var readable = new stream.Readable({
  read: function read() {}
});
var writables = [];

var _loop = function _loop(i) {
  var target = new stream.Writable({
    write: common.mustCall(function (chunk, encoding, callback) {
      target.output.push(chunk);
      callback();
    }, 1)
  });
  target.output = [];
  target.on('pipe', common.mustCall());
  readable.pipe(target);
  writables.push(target);
};

for (var i = 0; i < 5; i++) {
  _loop(i);
}

var input = bufferShim.from([1, 2, 3, 4, 5]);
readable.push(input); // The pipe() calls will postpone emission of the 'resume' event using nextTick,
// so no data will be available to the writable streams until then.

process.nextTick(common.mustCall(function () {
  var _iterator = _createForOfIteratorHelper(writables),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var target = _step.value;
      assert.deepStrictEqual(target.output, [input]);
      target.on('unpipe', common.mustCall());
      readable.unpipe(target);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  readable.push('something else'); // This does not get through.

  readable.push(null);
  readable.resume(); // Make sure the 'end' event gets emitted.
}));
readable.on('end', common.mustCall(function () {
  var _iterator2 = _createForOfIteratorHelper(writables),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var target = _step2.value;
      assert.deepStrictEqual(target.output, [input]);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}));
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