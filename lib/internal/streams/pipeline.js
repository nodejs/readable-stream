// Ported from https://github.com/mafintosh/pump with
// permission from the author, Mathias Buus (@mafintosh).
'use strict';

var eos;

function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;
    callback.apply(void 0, arguments);
  };
}

var _require$codes = require('../../../errors').codes,
    ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS,
    ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;


var PassThrough;
var createReadableStreamAsyncIterator;

function noop(err) {
  // Rethrow the error if it exists to avoid swallowing it
  if (err) throw err;
}

function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}

function destroyer(stream, reading, writing, callback) {
  callback = once(callback);
  var closed = false;
  stream.on('close', function () {
    closed = true;
  });
  if (eos === undefined) eos = require('./end-of-stream');
  eos(stream, {
    readable: reading,
    writable: writing
  }, function (err) {
    if (err) return callback(err);
    closed = true;
    callback();
  });
  var destroyed = false;
  return function (err) {
    if (closed) return;
    if (destroyed) return;
    destroyed = true; // request.destroy just do .end - .abort is what we want

    if (isRequest(stream)) return stream.abort();
    if (typeof stream.destroy === 'function') return stream.destroy();
    callback(err || new ERR_STREAM_DESTROYED('pipe'));
  };
}

function call(fn) {
  fn();
}

function pipe(from, to) {
  return from.pipe(to);
}

function popCallback(streams) {
  if (!streams.length) return noop;
  if (typeof streams[streams.length - 1] !== 'function') return noop;
  return streams.pop();
}

function isPromise(obj) {
  return !!(obj && typeof obj.then === 'function');
}

function isReadable(obj) {
  return !!(obj && typeof obj.pipe === 'function');
}

function isWritable(obj) {
  return !!(obj && typeof obj.write === 'function');
}

function isStream(obj) {
  return isReadable(obj) || isWritable(obj);
}

function isIterable(obj, isAsync) {
  if (!obj) return false;
  // core-js here ? symbols are only a problem in IE
  // i would suggest to do our part by dropping IE support
  // that's the most human thing to do ~~ Sceat
  // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
  if (isAsync === true) return typeof obj[Symbol.asyncIterator] === 'function';
  if (isAsync === false) return typeof obj[Symbol.iterator] === 'function';
  return typeof obj[Symbol.asyncIterator] === 'function' ||
    typeof obj[Symbol.iterator] === 'function';
}

function makeAsyncIterable(val) {
  if (isIterable(val)) {
    return val;
  } else if (isReadable(val)) {
    // Legacy streams are not Iterable.
    return fromReadable(val);
  } else {
    throw new ERR_INVALID_ARG_TYPE(
      'val', ['Readable', 'Iterable', 'AsyncIterable'], val);
  }
}

// again this would need a polyfill for IE
async function* fromReadable(val) {
  if (!createReadableStreamAsyncIterator) {
    createReadableStreamAsyncIterator =
      require('./async_iterator');
  }
  yield* createReadableStreamAsyncIterator(val);
}

async function pump(iterable, writable, finish) {
  var error;
  try {
    for await (var chunk of iterable) {
      if (!writable.write(chunk)) {
        if (writable.destroyed) return;
        await new Promise(resolve => { writable.once('drain', resolve) })
      }
    }
    writable.end();
  } catch (err) {
    error = err;
  } finally {
    finish(error);
  }
}

function pipeline(...streams) {
  const callback = once(popCallback(streams));

  if (Array.isArray(streams[0])) streams = streams[0];

  if (streams.length < 2) {
    throw new ERR_MISSING_ARGS('streams');
  }

  var error;
  var value;
  var destroys = [];

  var finishCount = 0;

  function finish(err) {
    var final = --finishCount === 0;

    if (err && (!error || error.code === 'ERR_STREAM_PREMATURE_CLOSE')) {
      error = err;
    }

    if (!error && !final) {
      return;
    }

    while (destroys.length) {
      destroys.shift()(error);
    }

    if (final) {
      callback(error, value);
    }
  }

  var ret;
  for (var i = 0; i < streams.length; i++) {
    var stream = streams[i];
    var reading = i < streams.length - 1;
    var writing = i > 0;

    if (isStream(stream)) {
      finishCount++;
      destroys.push(destroyer(stream, reading, writing, finish));
    }

    if (i === 0) {
      if (typeof stream === 'function') {
        ret = stream();
        if (!isIterable(ret)) {
          throw new ERR_INVALID_RETURN_VALUE(
            'Iterable, AsyncIterable or Stream', 'source', ret);
        }
      } else if (isIterable(stream) || isReadable(stream)) {
        ret = stream;
      } else {
        throw new ERR_INVALID_ARG_TYPE(
          'source', ['Stream', 'Iterable', 'AsyncIterable', 'Function'],
          stream);
      }
    } else if (typeof stream === 'function') {
      ret = makeAsyncIterable(ret);
      ret = stream(ret);

      if (reading) {
        if (!isIterable(ret, true)) {
          throw new ERR_INVALID_RETURN_VALUE(
            'AsyncIterable', `transform[${i - 1}]`, ret);
        }
      } else {
        if (!PassThrough) {
          PassThrough = require('../../_stream_passthrough');
        }

        // If the last argument to pipeline is not a stream
        // we must create a proxy stream so that pipeline(...)
        // always returns a stream which can be further
        // composed through `.pipe(stream)`.

        var pt = new PassThrough({
          objectMode: true
        });
        if (isPromise(ret)) {
          ret
            .then((val) => {
              value = val;
              pt.end(val);
            }, (err) => {
              pt.destroy(err);
            });
        } else if (isIterable(ret, true)) {
          finishCount++;
          pump(ret, pt, finish);
        } else {
          throw new ERR_INVALID_RETURN_VALUE(
            'AsyncIterable or Promise', 'destination', ret);
        }

        ret = pt;

        finishCount++;
        destroys.push(destroyer(ret, false, true, finish));
      }
    } else if (isStream(stream)) {
      if (isReadable(ret)) {
        ret.pipe(stream);

        // Compat. Before node v10.12.0 stdio used to throw an error so
        // pipe() did/does not end() stdio destinations.
        // Now they allow it but "secretly" don't close the underlying fd.
        if (stream === process && process.stdout ||
            stream === process && process.stderr) {
          ret.on('end', () => stream.end());
        }
      } else {
        ret = makeAsyncIterable(ret);

        finishCount++;
        pump(ret, stream, finish);
      }
      ret = stream;
    } else {
      var name = reading ? `transform[${i - 1}]` : 'destination';
      throw new ERR_INVALID_ARG_TYPE(
        name, ['Stream', 'Function'], ret);
    }
  }

  // TODO(ronag): Consider returning a Duplex proxy if the first argument
  // is a writable. Would improve composability.
  // See, https://github.com/nodejs/node/issues/32020
  return ret;
}

module.exports = pipeline;