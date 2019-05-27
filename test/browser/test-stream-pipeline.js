"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

var common = require('../common');

var _require = require('../../'),
    Writable = _require.Writable,
    Readable = _require.Readable,
    Transform = _require.Transform,
    finished = _require.finished,
    pipeline = _require.pipeline;

module.exports = function (t) {
  t.test('pipeline', function (t) {
    var finished = false;
    var processed = [];
    var expected = [bufferShim.from('a'), bufferShim.from('b'),
      bufferShim.from('c')];
    var read = new Readable({
      read: function read() {
      }
    });
    var write = new Writable({
      write: function write(data, enc, cb) {
        processed.push(data);
        cb();
      }
    });
    write.on('finish', function () {
      finished = true;
    });

    for (var i = 0; i < expected.length; i++) {
      read.push(expected[i]);
    }

    read.push(null);
    pipeline(read, write, common.mustCall(function (err) {
      t.ok(!err, 'no error');
      t.ok(finished);
      t.deepEqual(processed, expected);
      t.end();
    }));
  });
  t.test('pipeline missing args', function (t) {
    var _read = new Readable({
      read: function read() {
      }
    });

    t.throws(function () {
      pipeline(_read, function () {
      });
    }, /ERR_MISSING_ARGS/);
    t.throws(function () {
      pipeline(function () {
      });
    }, /ERR_MISSING_ARGS/);
    t.throws(function () {
      pipeline();
    }, /ERR_MISSING_ARGS/);
    t.end();
  });
  t.test('pipeline error', function (t) {
    var _read2 = new Readable({
      read: function read() {
      }
    });

    var _write = new Writable({
      write: function write(data, enc, cb) {
        cb();
      }
    });

    _read2.push('data');

    setImmediate(function () {
      return _read2.destroy();
    });
    pipeline(_read2, _write, common.mustCall(function (err) {
      t.ok(err, 'should have an error');
      t.end();
    }));
  });
  t.test('pipeline destroy', function () {
    var _read3 = new Readable({
      read: function read() {
      }
    });

    var _write2 = new Writable({
      write: function write(data, enc, cb) {
        cb();
      }
    });

    _read3.push('data');

    setImmediate(function () {
      return _read3.destroy(new Error('kaboom'));
    });
    var dst = pipeline(_read3, _write2, common.mustCall(function (err) {
      t.equal(err.message, 'kaboom');
      t.end();
    }));
    t.equal(dst, _write2);
  });
};
