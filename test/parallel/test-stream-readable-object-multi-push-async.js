'use strict';

var _setImmediate2;

function _load_setImmediate() {
  return _setImmediate2 = _interopRequireDefault(require('babel-runtime/core-js/set-immediate'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

var common = require('../common');
var assert = require('assert/');

var _require = require('../../'),
    Readable = _require.Readable;

var MAX = 42;
var BATCH = 10;

{
  var readable = new Readable({
    objectMode: true,
    read: common.mustCall(function () {
      var _this = this;

      console.log('>> READ');
      fetchData(function (err, data) {
        if (err) {
          _this.destroy(err);
          return;
        }

        if (data.length === 0) {
          console.log('pushing null');
          _this.push(null);
          return;
        }

        console.log('pushing');
        data.forEach(function (d) {
          return _this.push(d);
        });
      });
    }, Math.floor(MAX / BATCH) + 2)
  });

  var i = 0;
  function fetchData(cb) {
    if (i > MAX) {
      setTimeout(cb, 10, null, []);
    } else {
      var array = [];
      var max = i + BATCH;
      for (; i < max; i++) {
        array.push(i);
      }
      setTimeout(cb, 10, null, array);
    }
  }

  readable.on('readable', function () {
    var data = void 0;
    console.log('readable emitted');
    while (data = readable.read()) {
      console.log(data);
    }
  });

  readable.on('end', common.mustCall(function () {
    assert.strictEqual(i, (Math.floor(MAX / BATCH) + 1) * BATCH);
  }));
}

{
  var _readable = new Readable({
    objectMode: true,
    read: common.mustCall(function () {
      var _this2 = this;

      console.log('>> READ');
      fetchData(function (err, data) {
        if (err) {
          _this2.destroy(err);
          return;
        }

        if (data.length === 0) {
          console.log('pushing null');
          _this2.push(null);
          return;
        }

        console.log('pushing');
        data.forEach(function (d) {
          return _this2.push(d);
        });
      });
    }, Math.floor(MAX / BATCH) + 2)
  });

  var _i = 0;
  function fetchData(cb) {
    if (_i > MAX) {
      setTimeout(cb, 10, null, []);
    } else {
      var array = [];
      var max = _i + BATCH;
      for (; _i < max; _i++) {
        array.push(_i);
      }
      setTimeout(cb, 10, null, array);
    }
  }

  _readable.on('data', function (data) {
    console.log('data emitted', data);
  });

  _readable.on('end', common.mustCall(function () {
    assert.strictEqual(_i, (Math.floor(MAX / BATCH) + 1) * BATCH);
  }));
}

{
  var _readable2 = new Readable({
    objectMode: true,
    read: common.mustCall(function () {
      var _this3 = this;

      console.log('>> READ');
      fetchData(function (err, data) {
        if (err) {
          _this3.destroy(err);
          return;
        }

        console.log('pushing');
        data.forEach(function (d) {
          return _this3.push(d);
        });

        if (data[BATCH - 1] >= MAX) {
          console.log('pushing null');
          _this3.push(null);
        }
      });
    }, Math.floor(MAX / BATCH) + 1)
  });

  var _i2 = 0;
  function fetchData(cb) {
    var array = [];
    var max = _i2 + BATCH;
    for (; _i2 < max; _i2++) {
      array.push(_i2);
    }
    setTimeout(cb, 10, null, array);
  }

  _readable2.on('data', function (data) {
    console.log('data emitted', data);
  });

  _readable2.on('end', common.mustCall(function () {
    assert.strictEqual(_i2, (Math.floor(MAX / BATCH) + 1) * BATCH);
  }));
}

{
  var _readable3 = new Readable({
    objectMode: true,
    read: common.mustNotCall()
  });

  _readable3.on('data', common.mustNotCall());

  _readable3.push(null);

  var nextTickPassed = false;
  process.nextTick(function () {
    nextTickPassed = true;
  });

  _readable3.on('end', common.mustCall(function () {
    assert.strictEqual(nextTickPassed, true);
  }));
}

{
  var _readable4 = new Readable({
    objectMode: true,
    read: common.mustCall()
  });

  _readable4.on('data', function (data) {
    console.log('data emitted', data);
  });

  _readable4.on('end', common.mustCall());

  (0, (_setImmediate2 || _load_setImmediate()).default)(function () {
    _readable4.push('aaa');
    _readable4.push(null);
  });
}
;require('tap').pass('sync run');