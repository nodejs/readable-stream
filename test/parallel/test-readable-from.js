"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _awaitAsyncGenerator(value) { return new _AwaitValue(value); }

function _wrapAsyncGenerator(fn) { return function () { return new _AsyncGenerator(fn.apply(this, arguments)); }; }

function _AsyncGenerator(gen) { var front, back; function send(key, arg) { return new Promise(function (resolve, reject) { var request = { key: key, arg: arg, resolve: resolve, reject: reject, next: null }; if (back) { back = back.next = request; } else { front = back = request; resume(key, arg); } }); } function resume(key, arg) { try { var result = gen[key](arg); var value = result.value; var wrappedAwait = value instanceof _AwaitValue; Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) { if (wrappedAwait) { resume(key === "return" ? "return" : "next", arg); return; } settle(result.done ? "return" : "normal", arg); }, function (err) { resume("throw", err); }); } catch (err) { settle("throw", err); } } function settle(type, value) { switch (type) { case "return": front.resolve({ value: value, done: true }); break; case "throw": front.reject(value); break; default: front.resolve({ value: value, done: false }); break; } front = front.next; if (front) { resume(front.key, front.arg); } else { back = null; } } this._invoke = send; if (typeof gen.return !== "function") { this.return = undefined; } }

_AsyncGenerator.prototype[typeof Symbol === "function" && Symbol.asyncIterator || "@@asyncIterator"] = function () { return this; };

_AsyncGenerator.prototype.next = function (arg) { return this._invoke("next", arg); };

_AsyncGenerator.prototype.throw = function (arg) { return this._invoke("throw", arg); };

_AsyncGenerator.prototype.return = function (arg) { return this._invoke("return", arg); };

function _AwaitValue(value) { this.wrapped = value; }

function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }

function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function _return(value) { var ret = this.s.return; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, throw: function _throw(value) { var thr = this.s.return; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var _require = require('../common'),
    mustCall = _require.mustCall;

var once = require('events.once');

var _require2 = require('../../'),
    Readable = _require2.Readable;

var _require3 = require('assert/'),
    strictEqual = _require3.strictEqual;

function toReadableBasicSupport() {
  return _toReadableBasicSupport.apply(this, arguments);
}

function _toReadableBasicSupport() {
  _toReadableBasicSupport = _asyncToGenerator(function* () {
    function generate() {
      return _generate.apply(this, arguments);
    }

    function _generate() {
      _generate = _wrapAsyncGenerator(function* () {
        yield 'a';
        yield 'b';
        yield 'c';
      });
      return _generate.apply(this, arguments);
    }

    var stream = Readable.from(generate());
    var expected = ['a', 'b', 'c'];
    var _iteratorAbruptCompletion = false;
    var _didIteratorError = false;

    var _iteratorError;

    try {
      for (var _iterator = _asyncIterator(stream), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false) {
        var chunk = _step.value;
        strictEqual(chunk, expected.shift());
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
  });
  return _toReadableBasicSupport.apply(this, arguments);
}

function toReadableSyncIterator() {
  return _toReadableSyncIterator.apply(this, arguments);
}

function _toReadableSyncIterator() {
  _toReadableSyncIterator = _asyncToGenerator(function* () {
    function* generate() {
      yield 'a';
      yield 'b';
      yield 'c';
    }

    var stream = Readable.from(generate());
    var expected = ['a', 'b', 'c'];
    var _iteratorAbruptCompletion2 = false;
    var _didIteratorError2 = false;

    var _iteratorError2;

    try {
      for (var _iterator2 = _asyncIterator(stream), _step2; _iteratorAbruptCompletion2 = !(_step2 = yield _iterator2.next()).done; _iteratorAbruptCompletion2 = false) {
        var chunk = _step2.value;
        strictEqual(chunk, expected.shift());
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
  });
  return _toReadableSyncIterator.apply(this, arguments);
}

function toReadablePromises() {
  return _toReadablePromises.apply(this, arguments);
}

function _toReadablePromises() {
  _toReadablePromises = _asyncToGenerator(function* () {
    var promises = [Promise.resolve('a'), Promise.resolve('b'), Promise.resolve('c')];
    var stream = Readable.from(promises);
    var expected = ['a', 'b', 'c'];
    var _iteratorAbruptCompletion3 = false;
    var _didIteratorError3 = false;

    var _iteratorError3;

    try {
      for (var _iterator3 = _asyncIterator(stream), _step3; _iteratorAbruptCompletion3 = !(_step3 = yield _iterator3.next()).done; _iteratorAbruptCompletion3 = false) {
        var chunk = _step3.value;
        strictEqual(chunk, expected.shift());
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
  });
  return _toReadablePromises.apply(this, arguments);
}

function toReadableString() {
  return _toReadableString.apply(this, arguments);
}

function _toReadableString() {
  _toReadableString = _asyncToGenerator(function* () {
    var stream = Readable.from('abc');
    var expected = ['a', 'b', 'c'];
    var _iteratorAbruptCompletion4 = false;
    var _didIteratorError4 = false;

    var _iteratorError4;

    try {
      for (var _iterator4 = _asyncIterator(stream), _step4; _iteratorAbruptCompletion4 = !(_step4 = yield _iterator4.next()).done; _iteratorAbruptCompletion4 = false) {
        var chunk = _step4.value;
        strictEqual(chunk, expected.shift());
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
  });
  return _toReadableString.apply(this, arguments);
}

function toReadableOnData() {
  return _toReadableOnData.apply(this, arguments);
}

function _toReadableOnData() {
  _toReadableOnData = _asyncToGenerator(function* () {
    function generate() {
      return _generate2.apply(this, arguments);
    }

    function _generate2() {
      _generate2 = _wrapAsyncGenerator(function* () {
        yield 'a';
        yield 'b';
        yield 'c';
      });
      return _generate2.apply(this, arguments);
    }

    var stream = Readable.from(generate());
    var iterations = 0;
    var expected = ['a', 'b', 'c'];
    stream.on('data', function (chunk) {
      iterations++;
      strictEqual(chunk, expected.shift());
    });
    yield once(stream, 'end');
    strictEqual(iterations, 3);
  });
  return _toReadableOnData.apply(this, arguments);
}

function toReadableOnDataNonObject() {
  return _toReadableOnDataNonObject.apply(this, arguments);
}

function _toReadableOnDataNonObject() {
  _toReadableOnDataNonObject = _asyncToGenerator(function* () {
    function generate() {
      return _generate3.apply(this, arguments);
    }

    function _generate3() {
      _generate3 = _wrapAsyncGenerator(function* () {
        yield 'a';
        yield 'b';
        yield 'c';
      });
      return _generate3.apply(this, arguments);
    }

    var stream = Readable.from(generate(), {
      objectMode: false
    });
    var iterations = 0;
    var expected = ['a', 'b', 'c'];
    stream.on('data', function (chunk) {
      iterations++;
      strictEqual(chunk instanceof Buffer, true);
      strictEqual(chunk.toString(), expected.shift());
    });
    yield once(stream, 'end');
    strictEqual(iterations, 3);
  });
  return _toReadableOnDataNonObject.apply(this, arguments);
}

function destroysTheStreamWhenThrowing() {
  return _destroysTheStreamWhenThrowing.apply(this, arguments);
}

function _destroysTheStreamWhenThrowing() {
  _destroysTheStreamWhenThrowing = _asyncToGenerator(function* () {
    function generate() {
      return _generate4.apply(this, arguments);
    }

    function _generate4() {
      _generate4 = _wrapAsyncGenerator(function* () {
        throw new Error('kaboom');
      });
      return _generate4.apply(this, arguments);
    }

    var stream = Readable.from(generate());
    stream.read();

    try {
      yield once(stream, 'error');
    } catch (err) {
      strictEqual(err.message, 'kaboom');
      strictEqual(stream.destroyed, true);
    }
  });
  return _destroysTheStreamWhenThrowing.apply(this, arguments);
}

function asTransformStream() {
  return _asTransformStream.apply(this, arguments);
}

function _asTransformStream() {
  _asTransformStream = _asyncToGenerator(function* () {
    function generate(_x) {
      return _generate5.apply(this, arguments);
    }

    function _generate5() {
      _generate5 = _wrapAsyncGenerator(function* (stream) {
        var _iteratorAbruptCompletion6 = false;
        var _didIteratorError6 = false;

        var _iteratorError6;

        try {
          for (var _iterator6 = _asyncIterator(stream), _step6; _iteratorAbruptCompletion6 = !(_step6 = yield _awaitAsyncGenerator(_iterator6.next())).done; _iteratorAbruptCompletion6 = false) {
            var chunk = _step6.value;
            yield chunk.toUpperCase();
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (_iteratorAbruptCompletion6 && _iterator6.return != null) {
              yield _awaitAsyncGenerator(_iterator6.return());
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }
      });
      return _generate5.apply(this, arguments);
    }

    var source = new Readable({
      objectMode: true,
      read: function read() {
        this.push('a');
        this.push('b');
        this.push('c');
        this.push(null);
      }
    });
    var stream = Readable.from(generate(source));
    var expected = ['A', 'B', 'C'];
    var _iteratorAbruptCompletion5 = false;
    var _didIteratorError5 = false;

    var _iteratorError5;

    try {
      for (var _iterator5 = _asyncIterator(stream), _step5; _iteratorAbruptCompletion5 = !(_step5 = yield _iterator5.next()).done; _iteratorAbruptCompletion5 = false) {
        var chunk = _step5.value;
        strictEqual(chunk, expected.shift());
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
  });
  return _asTransformStream.apply(this, arguments);
}

Promise.all([toReadableBasicSupport(), toReadableSyncIterator(), toReadablePromises(), toReadableString(), toReadableOnData(), toReadableOnDataNonObject(), destroysTheStreamWhenThrowing(), asTransformStream()]).then(mustCall());
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