"use strict";


var common = require('../common');

var _require = require('../../'),
    Writable = _require.Writable,
    Readable = _require.Readable,
    Transform = _require.Transform,
    finished = _require.finished;

module.exports = function (t) {
  t.test('readable finished', function (t) {

    var rs = new Readable({
      read: function read() {}
    });
    finished(rs, common.mustCall(function (err) {
      t.ok(!err, 'no error');
      t.end();
    }));
    rs.push(null);
    rs.resume();
  });
  t.test('writable finished', function (t) {
    var ws = new Writable({
      write: function write(data, enc, cb) {
        cb();
      }
    });
    finished(ws, common.mustCall(function (err) {
      t.ok(!err, 'no error');
      t.end();
    }));
    ws.end();
  });
  t.test('transform finished', function (t) {
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
      t.ok(!err, 'no error');
      t.ok(finish);
      t.ok(ended);
      t.end();
    }));
    tr.end();
    tr.resume();
  });
};
