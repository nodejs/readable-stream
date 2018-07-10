'use strict';

var tests = function () {
  var _ref = _asyncToGenerator(function* () {
    yield _asyncToGenerator(function* () {
      console.log('read without for..await');
      var max = 5;
      var readable = new Readable({
        objectMode: true,
        read: function () {}
      });

      var iter = readable[Symbol.asyncIterator]();
      assert.strictEqual(iter.stream, readable);
      var values = [];
      for (var i = 0; i < max; i++) {
        values.push(iter.next());
      }
      Promise.all(values).then(common.mustCall(function (values) {
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

      var last = yield iter.next();
      assert.strictEqual(last.done, true);
    })();

    yield _asyncToGenerator(function* () {
      console.log('read without for..await deferred');
      var readable = new Readable({
        objectMode: true,
        read: function () {}
      });

      var iter = readable[Symbol.asyncIterator]();
      assert.strictEqual(iter.stream, readable);
      var values = [];
      for (var i = 0; i < 3; i++) {
        values.push(iter.next());
      }

      readable.push('hello-0');
      readable.push('hello-1');
      readable.push('hello-2');

      var k = 0;
      var results1 = yield Promise.all(values);
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

      var results2 = yield Promise.all(values);
      results2.forEach(common.mustCall(function (item) {
        return assert.strictEqual(item.value, 'hello-' + k++);
      }, 2));

      var last = yield iter.next();
      assert.strictEqual(last.done, true);
    })();

    yield _asyncToGenerator(function* () {
      console.log('read without for..await with errors');
      var max = 3;
      var readable = new Readable({
        objectMode: true,
        read: function () {}
      });

      var iter = readable[Symbol.asyncIterator]();
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

      var resolved = yield Promise.all(values);

      resolved.forEach(common.mustCall(function (item, i) {
        return assert.strictEqual(item.value, 'hello-' + i);
      }, max));

      errors.forEach(function (promise) {
        promise.catch(common.mustCall(function (err) {
          assert.strictEqual(err.message, 'kaboom');
        }));
      });

      readable.destroy(new Error('kaboom'));
    })();

    yield _asyncToGenerator(function* () {
      console.log('call next() after error');
      var readable = new Readable({
        read: function () {}
      });
      var iterator = readable[Symbol.asyncIterator]();

      var err = new Error('kaboom');
      readable.destroy(new Error('kaboom'));
      yield function (f, e) {
        var success = false;f().then(function () {
          success = true;throw new Error('should not succeeed');
        }).catch(function (e2) {
          if (success) {
            throw e2;
          }assert.strictEqual(e.message, e2.message);
        });
      }(iterator.next.bind(iterator), err);
    })();

    yield _asyncToGenerator(function* () {
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

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _asyncIterator(readable), _step, _value; _step = yield _iterator.next(), _iteratorNormalCompletion = _step.done, _value = yield _step.value, !_iteratorNormalCompletion; _iteratorNormalCompletion = true) {
          var k = _value;

          received++;
          assert.strictEqual(k, 'hello');
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            yield _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      assert.strictEqual(readed, received);
    })();

    yield _asyncToGenerator(function* () {
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
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _asyncIterator(readable), _step2, _value2; _step2 = yield _iterator2.next(), _iteratorNormalCompletion2 = _step2.done, _value2 = yield _step2.value, !_iteratorNormalCompletion2; _iteratorNormalCompletion2 = true) {
            var k = _value2;
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              yield _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      } catch (e) {
        err = e;
      }
      assert.strictEqual(err.message, 'kaboom from read');
    })();

    yield _asyncToGenerator(function* () {
      console.log('destroy async');
      var readable = new Readable({
        objectMode: true,
        read: function () {
          var _this = this;

          if (!this.pushed) {
            this.push('hello');
            this.pushed = true;

            setImmediate(function () {
              _this.destroy(new Error('kaboom'));
            });
          }
        }
      });

      var received = 0;

      var err = null;
      try {
        // eslint-disable-next-line no-unused-vars
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = _asyncIterator(readable), _step3, _value3; _step3 = yield _iterator3.next(), _iteratorNormalCompletion3 = _step3.done, _value3 = yield _step3.value, !_iteratorNormalCompletion3; _iteratorNormalCompletion3 = true) {
            var k = _value3;

            received++;
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              yield _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      } catch (e) {
        err = e;
      }

      assert.strictEqual(err.message, 'kaboom');
      assert.strictEqual(received, 1);
    })();

    yield _asyncToGenerator(function* () {
      console.log('destroyed by throw');
      var readable = new Readable({
        objectMode: true,
        read: function () {
          this.push('hello');
        }
      });

      var err = null;
      try {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = _asyncIterator(readable), _step4, _value4; _step4 = yield _iterator4.next(), _iteratorNormalCompletion4 = _step4.done, _value4 = yield _step4.value, !_iteratorNormalCompletion4; _iteratorNormalCompletion4 = true) {
            var k = _value4;

            assert.strictEqual(k, 'hello');
            throw new Error('kaboom');
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              yield _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      } catch (e) {
        err = e;
      }

      assert.strictEqual(err.message, 'kaboom');
      assert.strictEqual(readable.destroyed, true);
    })();

    yield _asyncToGenerator(function* () {
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
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = _asyncIterator(readable), _step5, _value5; _step5 = yield _iterator5.next(), _iteratorNormalCompletion5 = _step5.done, _value5 = yield _step5.value, !_iteratorNormalCompletion5; _iteratorNormalCompletion5 = true) {
            var k = _value5;

            assert.strictEqual(k, 'hello');
            received++;
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              yield _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
      } catch (e) {
        err = e;
      }

      assert.strictEqual(err.message, 'kaboom');
      assert.strictEqual(received, 1);
    })();

    yield _asyncToGenerator(function* () {
      console.log('push async');
      var max = 42;
      var readed = 0;
      var received = 0;
      var readable = new Readable({
        objectMode: true,
        read: function () {
          var _this2 = this;

          setImmediate(function () {
            _this2.push('hello');
            if (++readed === max) {
              _this2.push(null);
            }
          });
        }
      });

      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = _asyncIterator(readable), _step6, _value6; _step6 = yield _iterator6.next(), _iteratorNormalCompletion6 = _step6.done, _value6 = yield _step6.value, !_iteratorNormalCompletion6; _iteratorNormalCompletion6 = true) {
          var k = _value6;

          received++;
          assert.strictEqual(k, 'hello');
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            yield _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      assert.strictEqual(readed, received);
    })();

    yield _asyncToGenerator(function* () {
      console.log('push binary async');
      var max = 42;
      var readed = 0;
      var readable = new Readable({
        read: function () {
          var _this3 = this;

          setImmediate(function () {
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
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = _asyncIterator(readable), _step7, _value7; _step7 = yield _iterator7.next(), _iteratorNormalCompletion7 = _step7.done, _value7 = yield _step7.value, !_iteratorNormalCompletion7; _iteratorNormalCompletion7 = true) {
          var k = _value7;

          data += k;
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            yield _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      assert.strictEqual(data, expected);
    })();
  });

  return function tests() {
    return _ref.apply(this, arguments);
  };
}();

// to avoid missing some tests if a promise does not resolve


function _asyncIterator(iterable) { if (typeof Symbol === "function") { if (Symbol.asyncIterator) { var method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { return iterable[Symbol.iterator](); } } throw new TypeError("Object is not async iterable"); }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

var common = require('../common');

var _require = require('../../'),
    Readable = _require.Readable;

var assert = require('assert/');

common.crashOnUnhandledRejection();

tests().then(common.mustCall());
;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});