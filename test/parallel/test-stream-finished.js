'use strict';

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var _require2 = require('util'),
    promisify = _require2.promisify;

common.crashOnUnhandledRejection();

{
  var rs = new Readable({
    read: function () {}
  });

  finished(rs, common.mustCall(function (err) {
    assert(!err, 'no error');
  }));

  rs.push(null);
  rs.resume();
}

{
  var ws = new Writable({
    write: function (data, enc, cb) {
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
    transform: function (data, enc, cb) {
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
  var run = function () {
    var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
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
}
;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});