"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

const common = require('../common');
const _require = require('../../'),
  Writable = _require.Writable,
  Readable = _require.Readable,
  Transform = _require.Transform,
  finished = _require.finished;
const assert = require('assert/');
const fs = require('fs');
const promisify = require('util-promisify');
{
  const rs = new Readable({
    read() {}
  });
  finished(rs, common.mustCall(err => {
    assert(!err, 'no error');
  }));
  rs.push(null);
  rs.resume();
}
{
  const ws = new Writable({
    write(data, enc, cb) {
      cb();
    }
  });
  finished(ws, common.mustCall(err => {
    assert(!err, 'no error');
  }));
  ws.end();
}
{
  const tr = new Transform({
    transform(data, enc, cb) {
      cb();
    }
  });
  let finish = false;
  let ended = false;
  tr.on('end', () => {
    ended = true;
  });
  tr.on('finish', () => {
    finish = true;
  });
  finished(tr, common.mustCall(err => {
    assert(!err, 'no error');
    assert(finish);
    assert(ended);
  }));
  tr.end();
  tr.resume();
}
{
  const rs = fs.createReadStream(__filename);
  rs.resume();
  finished(rs, common.mustCall());
}
{
  const finishedPromise = promisify(finished);
  function run() {
    return _run.apply(this, arguments);
  }
  function _run() {
    _run = _asyncToGenerator(function* () {
      const rs = fs.createReadStream(__filename);
      const done = common.mustCall();
      let ended = false;
      rs.resume();
      rs.on('end', () => {
        ended = true;
      });
      yield finishedPromise(rs);
      assert(ended);
      done();
    });
    return _run.apply(this, arguments);
  }
  run();
}
{
  const rs = fs.createReadStream('file-does-not-exist');
  finished(rs, common.mustCall(err => {
    assert.strictEqual(err.code, 'ENOENT');
  }));
}
{
  const rs = new Readable();
  finished(rs, common.mustCall(err => {
    assert(!err, 'no error');
  }));
  rs.push(null);
  rs.emit('close'); // should not trigger an error
  rs.resume();
}
{
  const rs = new Readable();
  finished(rs, common.mustCall(err => {
    assert(err, 'premature close error');
  }));
  rs.emit('close'); // should trigger error
  rs.push(null);
  rs.resume();
}

// Test that calling returned function removes listeners
{
  const ws = new Writable({
    write(data, env, cb) {
      cb();
    }
  });
  const removeListener = finished(ws, common.mustNotCall());
  removeListener();
  ws.end();
}
{
  const rs = new Readable();
  const removeListeners = finished(rs, common.mustNotCall());
  removeListeners();
  rs.emit('close');
  rs.push(null);
  rs.resume();
}
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));