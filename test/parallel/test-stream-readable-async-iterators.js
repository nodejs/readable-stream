"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function _return(value) { var ret = this.s.return; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, throw: function _throw(value) { var thr = this.s.return; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }
/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

const common = require('../common');
const _require = require('../../'),
  Readable = _require.Readable,
  PassThrough = _require.PassThrough,
  pipeline = _require.pipeline;
const assert = require('assert/');
function tests() {
  return _tests.apply(this, arguments);
} // to avoid missing some tests if a promise does not resolve
function _tests() {
  _tests = _asyncToGenerator(function* () {
    {
      const AsyncIteratorPrototype = Object.getPrototypeOf(function () {});
      const rs = new Readable({});
      assert.strictEqual(Object.getPrototypeOf(Object.getPrototypeOf(rs[Symbol.asyncIterator]())), AsyncIteratorPrototype);
    }
    {
      const readable = new Readable({
        objectMode: true,
        read() {}
      });
      readable.push(0);
      readable.push(1);
      readable.push(null);
      const iter = readable[Symbol.asyncIterator]();
      assert.strictEqual((yield iter.next()).value, 0);
      var _iteratorAbruptCompletion = false;
      var _didIteratorError = false;
      var _iteratorError;
      try {
        for (var _iterator = _asyncIterator(iter), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false) {
          const d = _step.value;
          {
            assert.strictEqual(d, 1);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (_iteratorAbruptCompletion && _iterator.return != null) {
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
      const max = 5;
      const readable = new Readable({
        objectMode: true,
        read() {}
      });
      const iter = readable[Symbol.asyncIterator]();
      assert.strictEqual(iter.stream, readable);
      const values = [];
      for (let i = 0; i < max; i++) {
        values.push(iter.next());
      }
      Promise.all(values).then(common.mustCall(values => {
        values.forEach(common.mustCall((item, i) => assert.strictEqual(item.value, 'hello-' + i), 5));
      }));
      readable.push('hello-0');
      readable.push('hello-1');
      readable.push('hello-2');
      readable.push('hello-3');
      readable.push('hello-4');
      readable.push(null);
      const last = yield iter.next();
      assert.strictEqual(last.done, true);
    }
    {
      console.log('read without for..await deferred');
      const readable = new Readable({
        objectMode: true,
        read() {}
      });
      const iter = readable[Symbol.asyncIterator]();
      assert.strictEqual(iter.stream, readable);
      let values = [];
      for (let i = 0; i < 3; i++) {
        values.push(iter.next());
      }
      readable.push('hello-0');
      readable.push('hello-1');
      readable.push('hello-2');
      let k = 0;
      const results1 = yield Promise.all(values);
      results1.forEach(common.mustCall(item => assert.strictEqual(item.value, 'hello-' + k++), 3));
      values = [];
      for (let i = 0; i < 2; i++) {
        values.push(iter.next());
      }
      readable.push('hello-3');
      readable.push('hello-4');
      readable.push(null);
      const results2 = yield Promise.all(values);
      results2.forEach(common.mustCall(item => assert.strictEqual(item.value, 'hello-' + k++), 2));
      const last = yield iter.next();
      assert.strictEqual(last.done, true);
    }
    {
      console.log('read without for..await with errors');
      const max = 3;
      const readable = new Readable({
        objectMode: true,
        read() {}
      });
      const iter = readable[Symbol.asyncIterator]();
      assert.strictEqual(iter.stream, readable);
      const values = [];
      const errors = [];
      let i;
      for (i = 0; i < max; i++) {
        values.push(iter.next());
      }
      for (i = 0; i < 2; i++) {
        errors.push(iter.next());
      }
      readable.push('hello-0');
      readable.push('hello-1');
      readable.push('hello-2');
      const resolved = yield Promise.all(values);
      resolved.forEach(common.mustCall((item, i) => assert.strictEqual(item.value, 'hello-' + i), max));
      errors.forEach(promise => {
        promise.catch(common.mustCall(err => {
          assert.strictEqual(err.message, 'kaboom');
        }));
      });
      readable.destroy(new Error('kaboom'));
    }
    {
      console.log('call next() after error');
      const readable = new Readable({
        read() {}
      });
      const iterator = readable[Symbol.asyncIterator]();
      const err = new Error('kaboom');
      readable.destroy(new Error('kaboom'));
      yield function (f, e) {
        let success = false;
        f().then(function () {
          success = true;
          throw new Error('should not succeed');
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
      const max = 42;
      let readed = 0;
      let received = 0;
      const readable = new Readable({
        objectMode: true,
        read() {
          this.push('hello');
          if (++readed === max) {
            this.push(null);
          }
        }
      });
      var _iteratorAbruptCompletion2 = false;
      var _didIteratorError2 = false;
      var _iteratorError2;
      try {
        for (var _iterator2 = _asyncIterator(readable), _step2; _iteratorAbruptCompletion2 = !(_step2 = yield _iterator2.next()).done; _iteratorAbruptCompletion2 = false) {
          const k = _step2.value;
          {
            received++;
            assert.strictEqual(k, 'hello');
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (_iteratorAbruptCompletion2 && _iterator2.return != null) {
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
      const readable = new Readable({
        objectMode: true,
        read() {
          this.destroy(new Error('kaboom from read'));
        }
      });
      let err;
      try {
        // eslint-disable-next-line no-unused-vars
        var _iteratorAbruptCompletion3 = false;
        var _didIteratorError3 = false;
        var _iteratorError3;
        try {
          for (var _iterator3 = _asyncIterator(readable), _step3; _iteratorAbruptCompletion3 = !(_step3 = yield _iterator3.next()).done; _iteratorAbruptCompletion3 = false) {
            const k = _step3.value;
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (_iteratorAbruptCompletion3 && _iterator3.return != null) {
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
    }
    {
      console.log('destroy async');
      const readable = new Readable({
        objectMode: true,
        read() {
          if (!this.pushed) {
            this.push('hello');
            this.pushed = true;
            setImmediate(() => {
              this.destroy(new Error('kaboom'));
            });
          }
        }
      });
      let received = 0;
      let err = null;
      try {
        // eslint-disable-next-line no-unused-vars
        var _iteratorAbruptCompletion4 = false;
        var _didIteratorError4 = false;
        var _iteratorError4;
        try {
          for (var _iterator4 = _asyncIterator(readable), _step4; _iteratorAbruptCompletion4 = !(_step4 = yield _iterator4.next()).done; _iteratorAbruptCompletion4 = false) {
            const k = _step4.value;
            {
              received++;
            }
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (_iteratorAbruptCompletion4 && _iterator4.return != null) {
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
    }
    {
      console.log('destroyed by throw');
      const readable = new Readable({
        objectMode: true,
        read() {
          this.push('hello');
        }
      });
      let err = null;
      try {
        var _iteratorAbruptCompletion5 = false;
        var _didIteratorError5 = false;
        var _iteratorError5;
        try {
          for (var _iterator5 = _asyncIterator(readable), _step5; _iteratorAbruptCompletion5 = !(_step5 = yield _iterator5.next()).done; _iteratorAbruptCompletion5 = false) {
            const k = _step5.value;
            {
              assert.strictEqual(k, 'hello');
              throw new Error('kaboom');
            }
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (_iteratorAbruptCompletion5 && _iterator5.return != null) {
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
    }
    {
      console.log('destroyed sync after push');
      const readable = new Readable({
        objectMode: true,
        read() {
          this.push('hello');
          this.destroy(new Error('kaboom'));
        }
      });
      let received = 0;
      let err = null;
      try {
        var _iteratorAbruptCompletion6 = false;
        var _didIteratorError6 = false;
        var _iteratorError6;
        try {
          for (var _iterator6 = _asyncIterator(readable), _step6; _iteratorAbruptCompletion6 = !(_step6 = yield _iterator6.next()).done; _iteratorAbruptCompletion6 = false) {
            const k = _step6.value;
            {
              assert.strictEqual(k, 'hello');
              received++;
            }
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (_iteratorAbruptCompletion6 && _iterator6.return != null) {
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
    }
    {
      console.log('push async');
      const max = 42;
      let readed = 0;
      let received = 0;
      const readable = new Readable({
        objectMode: true,
        read() {
          setImmediate(() => {
            this.push('hello');
            if (++readed === max) {
              this.push(null);
            }
          });
        }
      });
      var _iteratorAbruptCompletion7 = false;
      var _didIteratorError7 = false;
      var _iteratorError7;
      try {
        for (var _iterator7 = _asyncIterator(readable), _step7; _iteratorAbruptCompletion7 = !(_step7 = yield _iterator7.next()).done; _iteratorAbruptCompletion7 = false) {
          const k = _step7.value;
          {
            received++;
            assert.strictEqual(k, 'hello');
          }
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (_iteratorAbruptCompletion7 && _iterator7.return != null) {
            yield _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }
      assert.strictEqual(readed, received);
    }
    {
      console.log('push binary async');
      const max = 42;
      let readed = 0;
      const readable = new Readable({
        read() {
          setImmediate(() => {
            this.push('hello');
            if (++readed === max) {
              this.push(null);
            }
          });
        }
      });
      let expected = '';
      readable.setEncoding('utf8');
      readable.pause();
      readable.on('data', chunk => {
        expected += chunk;
      });
      let data = '';
      var _iteratorAbruptCompletion8 = false;
      var _didIteratorError8 = false;
      var _iteratorError8;
      try {
        for (var _iterator8 = _asyncIterator(readable), _step8; _iteratorAbruptCompletion8 = !(_step8 = yield _iterator8.next()).done; _iteratorAbruptCompletion8 = false) {
          const k = _step8.value;
          {
            data += k;
          }
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (_iteratorAbruptCompletion8 && _iterator8.return != null) {
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
      const readable = new Readable({
        read() {
          // no-op
        }
      });
      readable.destroy();
      const _yield$readable$Symbo = yield readable[Symbol.asyncIterator]().next(),
        done = _yield$readable$Symbo.done;
      assert.strictEqual(done, true);
    }
    {
      console.log('.next() on pipelined stream');
      const readable = new Readable({
        read() {
          // no-op
        }
      });
      const passthrough = new PassThrough();
      const err = new Error('kaboom');
      pipeline(readable, passthrough, common.mustCall(e => {
        assert.strictEqual(e, err);
      }));
      readable.destroy(err);
      try {
        yield readable[Symbol.asyncIterator]().next();
      } catch (e) {
        assert.strictEqual(e, err);
      }
    }
    {
      console.log('iterating on an ended stream completes');
      const r = new Readable({
        objectMode: true,
        read() {
          this.push('asdf');
          this.push('hehe');
          this.push(null);
        }
      });
      // eslint-disable-next-line no-unused-vars
      var _iteratorAbruptCompletion9 = false;
      var _didIteratorError9 = false;
      var _iteratorError9;
      try {
        for (var _iterator9 = _asyncIterator(r), _step9; _iteratorAbruptCompletion9 = !(_step9 = yield _iterator9.next()).done; _iteratorAbruptCompletion9 = false) {
          const a = _step9.value;
        }
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (_iteratorAbruptCompletion9 && _iterator9.return != null) {
            yield _iterator9.return();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }
      var _iteratorAbruptCompletion10 = false;
      var _didIteratorError10 = false;
      var _iteratorError10;
      try {
        for (var _iterator10 = _asyncIterator(r), _step10; _iteratorAbruptCompletion10 = !(_step10 = yield _iterator10.next()).done; _iteratorAbruptCompletion10 = false) {
          const b = _step10.value;
        }
      } catch (err) {
        _didIteratorError10 = true;
        _iteratorError10 = err;
      } finally {
        try {
          if (_iteratorAbruptCompletion10 && _iterator10.return != null) {
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
      const r = new Readable({
        objectMode: true,
        read() {
          this.push('asdf');
          this.push('hehe');
        }
      });

      // eslint-disable-next-line no-unused-vars
      var _iteratorAbruptCompletion11 = false;
      var _didIteratorError11 = false;
      var _iteratorError11;
      try {
        for (var _iterator11 = _asyncIterator(r), _step11; _iteratorAbruptCompletion11 = !(_step11 = yield _iterator11.next()).done; _iteratorAbruptCompletion11 = false) {
          const a = _step11.value;
          {
            r.destroy(null);
          }
        }
      } catch (err) {
        _didIteratorError11 = true;
        _iteratorError11 = err;
      } finally {
        try {
          if (_iteratorAbruptCompletion11 && _iterator11.return != null) {
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
      const r = new Readable({
        objectMode: true,
        read() {}
      });
      const b = r[Symbol.asyncIterator]();
      const c = b.next();
      const d = b.next();
      r.push(null);
      assert.deepStrictEqual(yield c, {
        done: true,
        value: undefined
      });
      assert.deepStrictEqual(yield d, {
        done: true,
        value: undefined
      });
    }
    {
      console.log('all next promises must be resolved on destroy');
      const r = new Readable({
        objectMode: true,
        read() {}
      });
      const b = r[Symbol.asyncIterator]();
      const c = b.next();
      const d = b.next();
      r.destroy();
      assert.deepStrictEqual(yield c, {
        done: true,
        value: undefined
      });
      assert.deepStrictEqual(yield d, {
        done: true,
        value: undefined
      });
    }
    {
      console.log('all next promises must be resolved on destroy with error');
      const r = new Readable({
        objectMode: true,
        read() {}
      });
      const b = r[Symbol.asyncIterator]();
      const c = b.next();
      const d = b.next();
      const err = new Error('kaboom');
      r.destroy(err);
      yield Promise.all([_asyncToGenerator(function* () {
        let e;
        try {
          yield c;
        } catch (_e) {
          e = _e;
        }
        assert.strictEqual(e, err);
      })(), _asyncToGenerator(function* () {
        let e;
        try {
          yield d;
        } catch (_e) {
          e = _e;
        }
        assert.strictEqual(e, err);
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
_list.forEach(e => process.on('uncaughtException', e));