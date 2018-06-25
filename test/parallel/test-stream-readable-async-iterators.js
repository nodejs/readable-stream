'use strict';

var _setImmediate2;

function _load_setImmediate() {
  return _setImmediate2 = _interopRequireDefault(require('babel-runtime/core-js/set-immediate'));
}

var _promise;

function _load_promise() {
  return _promise = _interopRequireDefault(require('babel-runtime/core-js/promise'));
}

var _symbol;

function _load_symbol() {
  return _symbol = _interopRequireDefault(require('babel-runtime/core-js/symbol'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

var common = require('../common');

var _require = require('../../'),
    Readable = _require.Readable;

var assert = require('assert/');

common.crashOnUnhandledRejection();

async function tests() {
  await async function () {
    console.log('read without for..await');
    var max = 5;
    var readable = new Readable({
      objectMode: true,
      read: function () {}
    });

    var iter = readable[(_symbol || _load_symbol()).default.asyncIterator]();
    assert.strictEqual(iter.stream, readable);
    var values = [];
    for (var i = 0; i < max; i++) {
      values.push(iter.next());
    }
    (_promise || _load_promise()).default.all(values).then(common.mustCall(function (values) {
      values.forEach(common.mustCall(function (item, i) {
        return assert.strictEqual(item.value, 'hello-' + i);
      }, 5));
    }));

    readable.push('hello-0');
    readable.push('hello-1');
    readable.push('hello-2');
    readable.push('hello-3');
    readable.push('hello-4');
    readable.push(null);

    var last = await iter.next();
    assert.strictEqual(last.done, true);
  }();

  await async function () {
    console.log('read without for..await deferred');
    var readable = new Readable({
      objectMode: true,
      read: function () {}
    });

    var iter = readable[(_symbol || _load_symbol()).default.asyncIterator]();
    assert.strictEqual(iter.stream, readable);
    var values = [];
    for (var i = 0; i < 3; i++) {
      values.push(iter.next());
    }

    readable.push('hello-0');
    readable.push('hello-1');
    readable.push('hello-2');

    var k = 0;
    var results1 = await (_promise || _load_promise()).default.all(values);
    results1.forEach(common.mustCall(function (item) {
      return assert.strictEqual(item.value, 'hello-' + k++);
    }, 3));

    values = [];
    for (var _i = 0; _i < 2; _i++) {
      values.push(iter.next());
    }

    readable.push('hello-3');
    readable.push('hello-4');
    readable.push(null);

    var results2 = await (_promise || _load_promise()).default.all(values);
    results2.forEach(common.mustCall(function (item) {
      return assert.strictEqual(item.value, 'hello-' + k++);
    }, 2));

    var last = await iter.next();
    assert.strictEqual(last.done, true);
  }();

  await async function () {
    console.log('read without for..await with errors');
    var max = 3;
    var readable = new Readable({
      objectMode: true,
      read: function () {}
    });

    var iter = readable[(_symbol || _load_symbol()).default.asyncIterator]();
    assert.strictEqual(iter.stream, readable);
    var values = [];
    var errors = [];
    var i = void 0;
    for (i = 0; i < max; i++) {
      values.push(iter.next());
    }
    for (i = 0; i < 2; i++) {
      errors.push(iter.next());
    }

    readable.push('hello-0');
    readable.push('hello-1');
    readable.push('hello-2');

    var resolved = await (_promise || _load_promise()).default.all(values);

    resolved.forEach(common.mustCall(function (item, i) {
      return assert.strictEqual(item.value, 'hello-' + i);
    }, max));

    errors.forEach(function (promise) {
      promise.catch(common.mustCall(function (err) {
        assert.strictEqual(err.message, 'kaboom');
      }));
    });

    readable.destroy(new Error('kaboom'));
  }();

  await async function () {
    console.log('call next() after error');
    var readable = new Readable({
      read: function () {}
    });
    var iterator = readable[(_symbol || _load_symbol()).default.asyncIterator]();

    var err = new Error('kaboom');
    readable.destroy(new Error('kaboom'));
    await assert.rejects(iterator.next.bind(iterator), err);
  }();

  await async function () {
    console.log('read object mode');
    var max = 42;
    var readed = 0;
    var received = 0;
    var readable = new Readable({
      objectMode: true,
      read: function () {
        this.push('hello');
        if (++readed === max) {
          this.push(null);
        }
      }
    });

    for await (var k of readable) {
      received++;
      assert.strictEqual(k, 'hello');
    }

    assert.strictEqual(readed, received);
  }();

  await async function () {
    console.log('destroy sync');
    var readable = new Readable({
      objectMode: true,
      read: function () {
        this.destroy(new Error('kaboom from read'));
      }
    });

    var err = void 0;
    try {
      // eslint-disable-next-line no-unused-vars
      for await (var k of readable) {}
    } catch (e) {
      err = e;
    }
    assert.strictEqual(err.message, 'kaboom from read');
  }();

  await async function () {
    console.log('destroy async');
    var readable = new Readable({
      objectMode: true,
      read: function () {
        var _this = this;

        if (!this.pushed) {
          this.push('hello');
          this.pushed = true;

          (0, (_setImmediate2 || _load_setImmediate()).default)(function () {
            _this.destroy(new Error('kaboom'));
          });
        }
      }
    });

    var received = 0;

    var err = null;
    try {
      // eslint-disable-next-line no-unused-vars
      for await (var k of readable) {
        received++;
      }
    } catch (e) {
      err = e;
    }

    assert.strictEqual(err.message, 'kaboom');
    assert.strictEqual(received, 1);
  }();

  await async function () {
    console.log('destroyed by throw');
    var readable = new Readable({
      objectMode: true,
      read: function () {
        this.push('hello');
      }
    });

    var err = null;
    try {
      for await (var k of readable) {
        assert.strictEqual(k, 'hello');
        throw new Error('kaboom');
      }
    } catch (e) {
      err = e;
    }

    assert.strictEqual(err.message, 'kaboom');
    assert.strictEqual(readable.destroyed, true);
  }();

  await async function () {
    console.log('destroyed sync after push');
    var readable = new Readable({
      objectMode: true,
      read: function () {
        this.push('hello');
        this.destroy(new Error('kaboom'));
      }
    });

    var received = 0;

    var err = null;
    try {
      for await (var k of readable) {
        assert.strictEqual(k, 'hello');
        received++;
      }
    } catch (e) {
      err = e;
    }

    assert.strictEqual(err.message, 'kaboom');
    assert.strictEqual(received, 1);
  }();

  await async function () {
    console.log('push async');
    var max = 42;
    var readed = 0;
    var received = 0;
    var readable = new Readable({
      objectMode: true,
      read: function () {
        var _this2 = this;

        (0, (_setImmediate2 || _load_setImmediate()).default)(function () {
          _this2.push('hello');
          if (++readed === max) {
            _this2.push(null);
          }
        });
      }
    });

    for await (var k of readable) {
      received++;
      assert.strictEqual(k, 'hello');
    }

    assert.strictEqual(readed, received);
  }();

  await async function () {
    console.log('push binary async');
    var max = 42;
    var readed = 0;
    var readable = new Readable({
      read: function () {
        var _this3 = this;

        (0, (_setImmediate2 || _load_setImmediate()).default)(function () {
          _this3.push('hello');
          if (++readed === max) {
            _this3.push(null);
          }
        });
      }
    });

    var expected = '';
    readable.setEncoding('utf8');
    readable.pause();
    readable.on('data', function (chunk) {
      expected += chunk;
    });

    var data = '';
    for await (var k of readable) {
      data += k;
    }

    assert.strictEqual(data, expected);
  }();
}

// to avoid missing some tests if a promise does not resolve
tests().then(common.mustCall());
;require('tap').pass('sync run');