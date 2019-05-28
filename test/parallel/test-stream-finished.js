"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var _require = require('../../'),
    Writable = _require.Writable,
    Readable = _require.Readable,
    Transform = _require.Transform,
    finished = _require.finished;

var assert = require('assert/');

var fs = require('fs');

var promisify = require('util-promisify');

{
  var rs = new Readable({
    read: function read() {}
  });
  finished(rs, common.mustCall(function (err) {
    assert(!err, 'no error');
  }));
  rs.push(null);
  rs.resume();
}
{
  var ws = new Writable({
    write: function write(data, enc, cb) {
      cb();
    }
  });
  finished(ws, common.mustCall(function (err) {
    assert(!err, 'no error');
  }));
  ws.end();
}
{
  var tr = new Transform({
    transform: function transform(data, enc, cb) {
      cb();
    }
  });
  var finish = false;
  var ended = false;
  tr.on('end', function () {
    ended = true;
  });
  tr.on('finish', function () {
    finish = true;
  });
  finished(tr, common.mustCall(function (err) {
    assert(!err, 'no error');
    assert(finish);
    assert(ended);
  }));
  tr.end();
  tr.resume();
}
{
  var _rs = fs.createReadStream(__filename);

  _rs.resume();

  finished(_rs, common.mustCall());
}
{
  var run =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(function* () {
      var rs = fs.createReadStream(__filename);
      var done = common.mustCall();
      var ended = false;
      rs.resume();
      rs.on('end', function () {
        ended = true;
      });
      yield finishedPromise(rs);
      assert(ended);
      done();
    });

    return function run() {
      return _ref.apply(this, arguments);
    };
  }();

  var finishedPromise = promisify(finished);
  run();
}
{
  var _rs2 = fs.createReadStream('file-does-not-exist');

  finished(_rs2, common.mustCall(function (err) {
    assert.strictEqual(err.code, 'ENOENT');
  }));
}
{
  var _rs3 = new Readable();

  finished(_rs3, common.mustCall(function (err) {
    assert(!err, 'no error');
  }));

  _rs3.push(null);

  _rs3.emit('close'); // should not trigger an error


  _rs3.resume();
}
{
  var _rs4 = new Readable();

  finished(_rs4, common.mustCall(function (err) {
    assert(err, 'premature close error');
  }));

  _rs4.emit('close'); // should trigger error


  _rs4.push(null);

  _rs4.resume();
} // Test that calling returned function removes listeners

{
  var _ws = new Writable({
    write: function write(data, env, cb) {
      cb();
    }
  });

  var removeListener = finished(_ws, common.mustNotCall());
  removeListener();

  _ws.end();
}
{
  var _rs5 = new Readable();

  var removeListeners = finished(_rs5, common.mustNotCall());
  removeListeners();

  _rs5.emit('close');

  _rs5.push(null);

  _rs5.resume();
}
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