"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _asyncIterator(iterable) { var method; if (typeof Symbol === "function") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError("Object is not async iterable"); }

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var _require = require('../../'),
    Readable = _require.Readable,
    PassThrough = _require.PassThrough,
    pipeline = _require.pipeline;

var assert = require('assert/');

function tests() {
  return _tests.apply(this, arguments);
} // to avoid missing some tests if a promise does not resolve


function _tests() {
  _tests = _asyncToGenerator(function* () {
    {
      var AsyncIteratorPrototype = Object.getPrototypeOf(function () {});
      var rs = new Readable({});
      assert.strictEqual(Object.getPrototypeOf(Object.getPrototypeOf(rs[Symbol.asyncIterator]())), AsyncIteratorPrototype);
    }
    yield _asyncToGenerator(function* () {
      var readable = new Readable({
        objectMode: true,
        read: function () {}
      });
      readable.push(0);
      readable.push(1);
      readable.push(null);
      var iter = readable[Symbol.asyncIterator]();
      assert.strictEqual((yield iter.next()).value, 0);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;

      var _iteratorError;

      try {
        for (var _iterator = _asyncIterator(iter), _step, _value; _step = yield _iterator.next(), _iteratorNormalCompletion = _step.done, _value = yield _step.value, !_iteratorNormalCompletion; _iteratorNormalCompletion = true) {
          var d = _value;
          assert.strictEqual(d, 1);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            yield _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    })();
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
      var i;

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
        var success = false;
        f().then(function () {
          success = true;
          throw new Error('should not succeeed');
        }).catch(function (e2) {
          if (success) {
            throw e2;
          }

          assert.strictEqual(e.message, e2.message);
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
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;

      var _iteratorError2;

      try {
        for (var _iterator2 = _asyncIterator(readable), _step2, _value2; _step2 = yield _iterator2.next(), _iteratorNormalCompletion2 = _step2.done, _value2 = yield _step2.value, !_iteratorNormalCompletion2; _iteratorNormalCompletion2 = true) {
          var k = _value2;
          received++;
          assert.strictEqual(k, 'hello');
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            yield _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
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
      var err;

      try {
        // eslint-disable-next-line no-unused-vars
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;

        var _iteratorError3;

        try {
          for (var _iterator3 = _asyncIterator(readable), _step3, _value3; _step3 = yield _iterator3.next(), _iteratorNormalCompletion3 = _step3.done, _value3 = yield _step3.value, !_iteratorNormalCompletion3; _iteratorNormalCompletion3 = true) {
            var k = _value3;
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
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
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;

        var _iteratorError4;

        try {
          for (var _iterator4 = _asyncIterator(readable), _step4, _value4; _step4 = yield _iterator4.next(), _iteratorNormalCompletion4 = _step4.done, _value4 = yield _step4.value, !_iteratorNormalCompletion4; _iteratorNormalCompletion4 = true) {
            var k = _value4;
            received++;
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
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
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;

        var _iteratorError5;

        try {
          for (var _iterator5 = _asyncIterator(readable), _step5, _value5; _step5 = yield _iterator5.next(), _iteratorNormalCompletion5 = _step5.done, _value5 = yield _step5.value, !_iteratorNormalCompletion5; _iteratorNormalCompletion5 = true) {
            var k = _value5;
            assert.strictEqual(k, 'hello');
            throw new Error('kaboom');
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
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
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;

        var _iteratorError6;

        try {
          for (var _iterator6 = _asyncIterator(readable), _step6, _value6; _step6 = yield _iterator6.next(), _iteratorNormalCompletion6 = _step6.done, _value6 = yield _step6.value, !_iteratorNormalCompletion6; _iteratorNormalCompletion6 = true) {
            var k = _value6;
            assert.strictEqual(k, 'hello');
            received++;
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
              yield _iterator6.return();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
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
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;

      var _iteratorError7;

      try {
        for (var _iterator7 = _asyncIterator(readable), _step7, _value7; _step7 = yield _iterator7.next(), _iteratorNormalCompletion7 = _step7.done, _value7 = yield _step7.value, !_iteratorNormalCompletion7; _iteratorNormalCompletion7 = true) {
          var k = _value7;
          received++;
          assert.strictEqual(k, 'hello');
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
            yield _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
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
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;

      var _iteratorError8;

      try {
        for (var _iterator8 = _asyncIterator(readable), _step8, _value8; _step8 = yield _iterator8.next(), _iteratorNormalCompletion8 = _step8.done, _value8 = yield _step8.value, !_iteratorNormalCompletion8; _iteratorNormalCompletion8 = true) {
          var k = _value8;
          data += k;
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
            yield _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      assert.strictEqual(data, expected);
    })();
    yield _asyncToGenerator(function* () {
      console.log('.next() on destroyed stream');
      var readable = new Readable({
        read: function () {// no-op
        }
      });
      readable.destroy();

      var _ref14 = yield readable[Symbol.asyncIterator]().next(),
          done = _ref14.done;

      assert.strictEqual(done, true);
    })();
    yield _asyncToGenerator(function* () {
      console.log('.next() on pipelined stream');
      var readable = new Readable({
        read: function () {// no-op
        }
      });
      var passthrough = new PassThrough();
      var err = new Error('kaboom');
      pipeline(readable, passthrough, common.mustCall(function (e) {
        assert.strictEqual(e, err);
      }));
      readable.destroy(err);

      try {
        yield readable[Symbol.asyncIterator]().next();
      } catch (e) {
        assert.strictEqual(e, err);
      }
    })();
    yield _asyncToGenerator(function* () {
      console.log('iterating on an ended stream completes');
      var r = new Readable({
        objectMode: true,
        read: function () {
          this.push('asdf');
          this.push('hehe');
          this.push(null);
        }
      }); // eslint-disable-next-line no-unused-vars

      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;

      var _iteratorError9;

      try {
        for (var _iterator9 = _asyncIterator(r), _step9, _value9; _step9 = yield _iterator9.next(), _iteratorNormalCompletion9 = _step9.done, _value9 = yield _step9.value, !_iteratorNormalCompletion9; _iteratorNormalCompletion9 = true) {
          var a = _value9;
        } // eslint-disable-next-line no-unused-vars

      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
            yield _iterator9.return();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }

      var _iteratorNormalCompletion10 = true;
      var _didIteratorError10 = false;

      var _iteratorError10;

      try {
        for (var _iterator10 = _asyncIterator(r), _step10, _value10; _step10 = yield _iterator10.next(), _iteratorNormalCompletion10 = _step10.done, _value10 = yield _step10.value, !_iteratorNormalCompletion10; _iteratorNormalCompletion10 = true) {
          var b = _value10;
        }
      } catch (err) {
        _didIteratorError10 = true;
        _iteratorError10 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion10 && _iterator10.return != null) {
            yield _iterator10.return();
          }
        } finally {
          if (_didIteratorError10) {
            throw _iteratorError10;
          }
        }
      }
    })();
    yield _asyncToGenerator(function* () {
      console.log('destroy mid-stream does not error');
      var r = new Readable({
        objectMode: true,
        read: function () {
          this.push('asdf');
          this.push('hehe');
        }
      }); // eslint-disable-next-line no-unused-vars

      var _iteratorNormalCompletion11 = true;
      var _didIteratorError11 = false;

      var _iteratorError11;

      try {
        for (var _iterator11 = _asyncIterator(r), _step11, _value11; _step11 = yield _iterator11.next(), _iteratorNormalCompletion11 = _step11.done, _value11 = yield _step11.value, !_iteratorNormalCompletion11; _iteratorNormalCompletion11 = true) {
          var a = _value11;
          r.destroy(null);
        }
      } catch (err) {
        _didIteratorError11 = true;
        _iteratorError11 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion11 && _iterator11.return != null) {
            yield _iterator11.return();
          }
        } finally {
          if (_didIteratorError11) {
            throw _iteratorError11;
          }
        }
      }
    })();
  });
  return _tests.apply(this, arguments);
}

tests().then(common.mustCall(), common.mustNotCall(console.log));
;

require('tap').pass('sync run');

var _list = process.listeners('uncaughtException');

process.removeAllListeners('uncaughtException');

_list.pop();

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});