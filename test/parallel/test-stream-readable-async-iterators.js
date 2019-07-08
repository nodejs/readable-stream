"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _asyncIterator(iterable) { var method; if (typeof Symbol !== "undefined") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError("Object is not async iterable"); }

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
    {
      var readable = new Readable({
        objectMode: true,
        read: function read() {}
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
    }
    {
      console.log('read without for..await');
      var max = 5;

      var _readable = new Readable({
        objectMode: true,
        read: function read() {}
      });

      var _iter = _readable[Symbol.asyncIterator]();

      assert.strictEqual(_iter.stream, _readable);
      var values = [];

      for (var i = 0; i < max; i++) {
        values.push(_iter.next());
      }

      Promise.all(values).then(common.mustCall(function (values) {
        values.forEach(common.mustCall(function (item, i) {
          return assert.strictEqual(item.value, 'hello-' + i);
        }, 5));
      }));

      _readable.push('hello-0');

      _readable.push('hello-1');

      _readable.push('hello-2');

      _readable.push('hello-3');

      _readable.push('hello-4');

      _readable.push(null);

      var last = yield _iter.next();
      assert.strictEqual(last.done, true);
    }
    {
      console.log('read without for..await deferred');

      var _readable2 = new Readable({
        objectMode: true,
        read: function read() {}
      });

      var _iter2 = _readable2[Symbol.asyncIterator]();

      assert.strictEqual(_iter2.stream, _readable2);
      var _values = [];

      for (var _i = 0; _i < 3; _i++) {
        _values.push(_iter2.next());
      }

      _readable2.push('hello-0');

      _readable2.push('hello-1');

      _readable2.push('hello-2');

      var k = 0;
      var results1 = yield Promise.all(_values);
      results1.forEach(common.mustCall(function (item) {
        return assert.strictEqual(item.value, 'hello-' + k++);
      }, 3));
      _values = [];

      for (var _i2 = 0; _i2 < 2; _i2++) {
        _values.push(_iter2.next());
      }

      _readable2.push('hello-3');

      _readable2.push('hello-4');

      _readable2.push(null);

      var results2 = yield Promise.all(_values);
      results2.forEach(common.mustCall(function (item) {
        return assert.strictEqual(item.value, 'hello-' + k++);
      }, 2));

      var _last = yield _iter2.next();

      assert.strictEqual(_last.done, true);
    }
    {
      console.log('read without for..await with errors');
      var _max = 3;

      var _readable3 = new Readable({
        objectMode: true,
        read: function read() {}
      });

      var _iter3 = _readable3[Symbol.asyncIterator]();

      assert.strictEqual(_iter3.stream, _readable3);
      var _values2 = [];
      var errors = [];

      var _i3;

      for (_i3 = 0; _i3 < _max; _i3++) {
        _values2.push(_iter3.next());
      }

      for (_i3 = 0; _i3 < 2; _i3++) {
        errors.push(_iter3.next());
      }

      _readable3.push('hello-0');

      _readable3.push('hello-1');

      _readable3.push('hello-2');

      var resolved = yield Promise.all(_values2);
      resolved.forEach(common.mustCall(function (item, i) {
        return assert.strictEqual(item.value, 'hello-' + i);
      }, _max));
      errors.forEach(function (promise) {
        promise.catch(common.mustCall(function (err) {
          assert.strictEqual(err.message, 'kaboom');
        }));
      });

      _readable3.destroy(new Error('kaboom'));
    }
    {
      console.log('call next() after error');

      var _readable4 = new Readable({
        read: function read() {}
      });

      var iterator = _readable4[Symbol.asyncIterator]();

      var err = new Error('kaboom');

      _readable4.destroy(new Error('kaboom'));

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
    }
    {
      console.log('read object mode');
      var _max2 = 42;
      var readed = 0;
      var received = 0;

      var _readable5 = new Readable({
        objectMode: true,
        read: function read() {
          this.push('hello');

          if (++readed === _max2) {
            this.push(null);
          }
        }
      });

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;

      var _iteratorError2;

      try {
        for (var _iterator2 = _asyncIterator(_readable5), _step2, _value2; _step2 = yield _iterator2.next(), _iteratorNormalCompletion2 = _step2.done, _value2 = yield _step2.value, !_iteratorNormalCompletion2; _iteratorNormalCompletion2 = true) {
          var _k = _value2;
          received++;
          assert.strictEqual(_k, 'hello');
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
    }
    {
      console.log('destroy sync');

      var _readable6 = new Readable({
        objectMode: true,
        read: function read() {
          this.destroy(new Error('kaboom from read'));
        }
      });

      var _err;

      try {
        // eslint-disable-next-line no-unused-vars
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;

        var _iteratorError3;

        try {
          for (var _iterator3 = _asyncIterator(_readable6), _step3, _value3; _step3 = yield _iterator3.next(), _iteratorNormalCompletion3 = _step3.done, _value3 = yield _step3.value, !_iteratorNormalCompletion3; _iteratorNormalCompletion3 = true) {
            var _k2 = _value3;
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
        _err = e;
      }

      assert.strictEqual(_err.message, 'kaboom from read');
    }
    {
      console.log('destroy async');

      var _readable7 = new Readable({
        objectMode: true,
        read: function read() {
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

      var _received = 0;
      var _err2 = null;

      try {
        // eslint-disable-next-line no-unused-vars
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;

        var _iteratorError4;

        try {
          for (var _iterator4 = _asyncIterator(_readable7), _step4, _value4; _step4 = yield _iterator4.next(), _iteratorNormalCompletion4 = _step4.done, _value4 = yield _step4.value, !_iteratorNormalCompletion4; _iteratorNormalCompletion4 = true) {
            var _k3 = _value4;
            _received++;
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
        _err2 = e;
      }

      assert.strictEqual(_err2.message, 'kaboom');
      assert.strictEqual(_received, 1);
    }
    {
      console.log('destroyed by throw');

      var _readable8 = new Readable({
        objectMode: true,
        read: function read() {
          this.push('hello');
        }
      });

      var _err3 = null;

      try {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;

        var _iteratorError5;

        try {
          for (var _iterator5 = _asyncIterator(_readable8), _step5, _value5; _step5 = yield _iterator5.next(), _iteratorNormalCompletion5 = _step5.done, _value5 = yield _step5.value, !_iteratorNormalCompletion5; _iteratorNormalCompletion5 = true) {
            var _k4 = _value5;
            assert.strictEqual(_k4, 'hello');
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
        _err3 = e;
      }

      assert.strictEqual(_err3.message, 'kaboom');
      assert.strictEqual(_readable8.destroyed, true);
    }
    {
      console.log('destroyed sync after push');

      var _readable9 = new Readable({
        objectMode: true,
        read: function read() {
          this.push('hello');
          this.destroy(new Error('kaboom'));
        }
      });

      var _received2 = 0;
      var _err4 = null;

      try {
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;

        var _iteratorError6;

        try {
          for (var _iterator6 = _asyncIterator(_readable9), _step6, _value6; _step6 = yield _iterator6.next(), _iteratorNormalCompletion6 = _step6.done, _value6 = yield _step6.value, !_iteratorNormalCompletion6; _iteratorNormalCompletion6 = true) {
            var _k5 = _value6;
            assert.strictEqual(_k5, 'hello');
            _received2++;
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
        _err4 = e;
      }

      assert.strictEqual(_err4.message, 'kaboom');
      assert.strictEqual(_received2, 1);
    }
    {
      console.log('push async');
      var _max3 = 42;
      var _readed = 0;
      var _received3 = 0;

      var _readable10 = new Readable({
        objectMode: true,
        read: function read() {
          var _this2 = this;

          setImmediate(function () {
            _this2.push('hello');

            if (++_readed === _max3) {
              _this2.push(null);
            }
          });
        }
      });

      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;

      var _iteratorError7;

      try {
        for (var _iterator7 = _asyncIterator(_readable10), _step7, _value7; _step7 = yield _iterator7.next(), _iteratorNormalCompletion7 = _step7.done, _value7 = yield _step7.value, !_iteratorNormalCompletion7; _iteratorNormalCompletion7 = true) {
          var _k6 = _value7;
          _received3++;
          assert.strictEqual(_k6, 'hello');
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

      assert.strictEqual(_readed, _received3);
    }
    {
      console.log('push binary async');
      var _max4 = 42;
      var _readed2 = 0;

      var _readable11 = new Readable({
        read: function read() {
          var _this3 = this;

          setImmediate(function () {
            _this3.push('hello');

            if (++_readed2 === _max4) {
              _this3.push(null);
            }
          });
        }
      });

      var expected = '';

      _readable11.setEncoding('utf8');

      _readable11.pause();

      _readable11.on('data', function (chunk) {
        expected += chunk;
      });

      var data = '';
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;

      var _iteratorError8;

      try {
        for (var _iterator8 = _asyncIterator(_readable11), _step8, _value8; _step8 = yield _iterator8.next(), _iteratorNormalCompletion8 = _step8.done, _value8 = yield _step8.value, !_iteratorNormalCompletion8; _iteratorNormalCompletion8 = true) {
          var _k7 = _value8;
          data += _k7;
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
    }
    {
      console.log('.next() on destroyed stream');

      var _readable12 = new Readable({
        read: function read() {// no-op
        }
      });

      _readable12.destroy();

      var _ref = yield _readable12[Symbol.asyncIterator]().next(),
          done = _ref.done;

      assert.strictEqual(done, true);
    }
    {
      console.log('.next() on pipelined stream');

      var _readable13 = new Readable({
        read: function read() {// no-op
        }
      });

      var passthrough = new PassThrough();

      var _err5 = new Error('kaboom');

      pipeline(_readable13, passthrough, common.mustCall(function (e) {
        assert.strictEqual(e, _err5);
      }));

      _readable13.destroy(_err5);

      try {
        yield _readable13[Symbol.asyncIterator]().next();
      } catch (e) {
        assert.strictEqual(e, _err5);
      }
    }
    {
      console.log('iterating on an ended stream completes');
      var r = new Readable({
        objectMode: true,
        read: function read() {
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
    }
    {
      console.log('destroy mid-stream does not error');

      var _r = new Readable({
        objectMode: true,
        read: function read() {
          this.push('asdf');
          this.push('hehe');
        }
      }); // eslint-disable-next-line no-unused-vars


      var _iteratorNormalCompletion11 = true;
      var _didIteratorError11 = false;

      var _iteratorError11;

      try {
        for (var _iterator11 = _asyncIterator(_r), _step11, _value11; _step11 = yield _iterator11.next(), _iteratorNormalCompletion11 = _step11.done, _value11 = yield _step11.value, !_iteratorNormalCompletion11; _iteratorNormalCompletion11 = true) {
          var _a = _value11;

          _r.destroy(null);
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
    }
    {
      console.log('all next promises must be resolved on end');

      var _r2 = new Readable({
        objectMode: true,
        read: function read() {}
      });

      var _b = _r2[Symbol.asyncIterator]();

      var c = _b.next();

      var _d = _b.next();

      _r2.push(null);

      assert.deepStrictEqual((yield c), {
        done: true,
        value: undefined
      });
      assert.deepStrictEqual((yield _d), {
        done: true,
        value: undefined
      });
    }
    {
      console.log('all next promises must be resolved on destroy');

      var _r3 = new Readable({
        objectMode: true,
        read: function read() {}
      });

      var _b2 = _r3[Symbol.asyncIterator]();

      var _c = _b2.next();

      var _d2 = _b2.next();

      _r3.destroy();

      assert.deepStrictEqual((yield _c), {
        done: true,
        value: undefined
      });
      assert.deepStrictEqual((yield _d2), {
        done: true,
        value: undefined
      });
    }
    {
      console.log('all next promises must be resolved on destroy with error');

      var _r4 = new Readable({
        objectMode: true,
        read: function read() {}
      });

      var _b3 = _r4[Symbol.asyncIterator]();

      var _c2 = _b3.next();

      var _d3 = _b3.next();

      var _err6 = new Error('kaboom');

      _r4.destroy(_err6);

      yield Promise.all([_asyncToGenerator(function* () {
        var e;

        try {
          yield _c2;
        } catch (_e) {
          e = _e;
        }

        assert.strictEqual(e, _err6);
      })(), _asyncToGenerator(function* () {
        var e;

        try {
          yield _d3;
        } catch (_e) {
          e = _e;
        }

        assert.strictEqual(e, _err6);
      })()]);
    }
  });
  return _tests.apply(this, arguments);
}

tests().then(common.mustCall(), common.mustNotCall(console.log));
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