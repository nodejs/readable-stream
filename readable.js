'use strict';

module.exports = Readable;

var Stream = require('stream');
var util = require('util');

util.inherits(Readable, Stream);

function Readable(stream) {
  if (stream) this.wrap(stream);
  Stream.apply(this);
}

// override this method.
Readable.prototype.read = function(n) {
  return null;
};

Readable.prototype.pipe = function(dest, opt) {
  if (!(opt && opt.end === false || dest === process.stdout ||
        dest === process.stderr)) {
    this.on('end', dest.end.bind(dest));
  }

  dest.emit('pipe', this);

  flow.call(this);

  function flow() {
    var chunk;
    while (chunk = this.read()) {
      var written = dest.write(chunk);
      if (false === written) {
        dest.once('drain', flow.bind(this));
        return;
      }
    }
    this.once('readable', flow);
  }

  return dest;
};

// kludge for on('data', fn) consumers.  Sad.
// This is *not* part of the new readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.on = function(ev, fn) {
  if (ev === 'data') emitDataEvents(this);
  return Stream.prototype.on.call(this, ev, fn);
};
Readable.prototype.addListener = Readable.prototype.on;

function emitDataEvents(stream) {
  var paused = false;
  var readable = false;

  // convert to an old-style stream.
  stream.readable = true;
  stream.pipe = Stream.prototype.pipe;
  stream.on = stream.addEventListener = Stream.prototype.on;

  stream.on('readable', function() {
    readable = true;
    var c;
    while (!paused && (c = stream.read())) {
      stream.emit('data', c);
    }
    if (c === null) readable = false;
  });

  stream.pause = function() {
    paused = true;
  };

  stream.resume = function() {
    paused = false;
    if (readable) stream.emit('readable');
  };
}

// wrap an old-style stream
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  this._buffer = [];
  this._bufferLength = 0;
  var paused = false;
  var ended = false;

  stream.on('end', function() {
    ended = true;
    if (this._bufferLength === 0) {
      this.emit('end');
    }
  }.bind(this));

  stream.on('data', function(chunk) {
    this._buffer.push(chunk);
    this._bufferLength += chunk.length;
    this.emit('readable');
    // if not consumed, then pause the stream.
    if (this._bufferLength > 0 && !paused) {
      paused = true;
      stream.pause();
    }
  }.bind(this));

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (typeof stream[i] === 'function' &&
        typeof this[i] === 'undefined') {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }}(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  events.forEach(function(ev) {
    stream.on(ev, this.emit.bind(this, ev));
  }.bind(this));

  // consume some bytes.  if not all is consumed, then
  // pause the underlying stream.
  this.read = function(n) {
    if (this._bufferLength === 0) return null;

    if (isNaN(n) || n <= 0) n = this._bufferLength;

    var ret = fromList(n, this._buffer, this._bufferLength);
    this._bufferLength = Math.max(0, this._bufferLength - n);

    if (this._bufferLength === 0) {
      if (paused) {
        stream.resume();
        paused = false;
      }
      if (ended) {
        process.nextTick(this.emit.bind(this, 'end'));
      }
    }
    return ret;
  };
};
