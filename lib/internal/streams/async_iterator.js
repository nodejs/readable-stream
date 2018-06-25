'use strict';

/*<replacement>*/

var _promise;

function _load_promise() {
  return _promise = _interopRequireDefault(require('babel-runtime/core-js/promise'));
}

var _createClass2;

function _load_createClass() {
  return _createClass2 = _interopRequireDefault(require('babel-runtime/helpers/createClass'));
}

var _classCallCheck2;

function _load_classCallCheck() {
  return _classCallCheck2 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));
}

var _symbol;

function _load_symbol() {
  return _symbol = _interopRequireDefault(require('babel-runtime/core-js/symbol'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pna = require('process-nextick-args');
/*</replacement>*/

var kLastResolve = (0, (_symbol || _load_symbol()).default)('lastResolve');
var kLastReject = (0, (_symbol || _load_symbol()).default)('lastReject');
var kError = (0, (_symbol || _load_symbol()).default)('error');
var kEnded = (0, (_symbol || _load_symbol()).default)('ended');
var kLastPromise = (0, (_symbol || _load_symbol()).default)('lastPromise');
var kHandlePromise = (0, (_symbol || _load_symbol()).default)('handlePromise');
var kStream = (0, (_symbol || _load_symbol()).default)('stream');

var AsyncIteratorRecord = function AsyncIteratorRecord(value, done) {
  (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, AsyncIteratorRecord);

  this.done = done;
  this.value = value;
};

function readAndResolve(iter) {
  var resolve = iter[kLastResolve];
  if (resolve !== null) {
    var data = iter[kStream].read();
    // we defer if data is null
    // we can be expecting either 'end' or
    // 'error'
    if (data !== null) {
      iter[kLastPromise] = null;
      iter[kLastResolve] = null;
      iter[kLastReject] = null;
      resolve(new AsyncIteratorRecord(data, false));
    }
  }
}

function onReadable(iter) {
  // we wait for the next tick, because it might
  // emit an error with process.nextTick
  pna.nextTick(readAndResolve, iter);
}

function onEnd(iter) {
  var resolve = iter[kLastResolve];
  if (resolve !== null) {
    iter[kLastPromise] = null;
    iter[kLastResolve] = null;
    iter[kLastReject] = null;
    resolve(new AsyncIteratorRecord(null, true));
  }
  iter[kEnded] = true;
}

function onError(iter, err) {
  var reject = iter[kLastReject];
  // reject if we are waiting for data in the Promise
  // returned by next() and store the error
  if (reject !== null) {
    iter[kLastPromise] = null;
    iter[kLastResolve] = null;
    iter[kLastReject] = null;
    reject(err);
  }
  iter[kError] = err;
}

function wrapForNext(lastPromise, iter) {
  return function (resolve, reject) {
    lastPromise.then(function () {
      iter[kHandlePromise](resolve, reject);
    }, reject);
  };
}

var ReadableAsyncIterator = function () {
  function ReadableAsyncIterator(stream) {
    var _this = this;

    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, ReadableAsyncIterator);

    this[kStream] = stream;
    this[kLastResolve] = null;
    this[kLastReject] = null;
    this[kError] = null;
    this[kEnded] = false;
    this[kLastPromise] = null;

    stream.on('readable', onReadable.bind(null, this));
    stream.on('end', onEnd.bind(null, this));
    stream.on('error', onError.bind(null, this));

    // the function passed to new Promise
    // is cached so we avoid allocating a new
    // closure at every run
    this[kHandlePromise] = function (resolve, reject) {
      var data = _this[kStream].read();
      if (data) {
        _this[kLastPromise] = null;
        _this[kLastResolve] = null;
        _this[kLastReject] = null;
        resolve(new AsyncIteratorRecord(data, false));
      } else {
        _this[kLastResolve] = resolve;
        _this[kLastReject] = reject;
      }
    };
  }

  ReadableAsyncIterator.prototype.next = function next() {
    // if we have detected an error in the meanwhile
    // reject straight away
    var error = this[kError];
    if (error !== null) {
      return (_promise || _load_promise()).default.reject(error);
    }

    if (this[kEnded]) {
      return (_promise || _load_promise()).default.resolve(new AsyncIteratorRecord(null, true));
    }

    // if we have multiple next() calls
    // we will wait for the previous Promise to finish
    // this logic is optimized to support for await loops,
    // where next() is only called once at a time
    var lastPromise = this[kLastPromise];
    var promise = void 0;

    if (lastPromise) {
      promise = new (_promise || _load_promise()).default(wrapForNext(lastPromise, this));
    } else {
      // fast path needed to support multiple this.push()
      // without triggering the next() queue
      var data = this[kStream].read();
      if (data !== null) {
        return (_promise || _load_promise()).default.resolve(new AsyncIteratorRecord(data, false));
      }

      promise = new (_promise || _load_promise()).default(this[kHandlePromise]);
    }

    this[kLastPromise] = promise;

    return promise;
  };

  ReadableAsyncIterator.prototype.return = function _return() {
    var _this2 = this;

    // destroy(err, cb) is a private API
    // we can guarantee we have that here, because we control the
    // Readable class this is attached to
    return new (_promise || _load_promise()).default(function (resolve, reject) {
      _this2[kStream].destroy(null, function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(new AsyncIteratorRecord(null, true));
      });
    });
  };

  (0, (_createClass2 || _load_createClass()).default)(ReadableAsyncIterator, [{
    key: 'stream',
    get: function () {
      return this[kStream];
    }
  }]);
  return ReadableAsyncIterator;
}();

module.exports = ReadableAsyncIterator;