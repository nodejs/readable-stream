'use strict';

module.exports = Readable;

var Stream = require('stream');
var util = require('util');
var fromList = require('./from-list.js');

util.inherits(Readable, Stream);

function Readable(options) {
  options = options || {};
  this.bufferSize = options.bufferSize || 16 * 1024;
  this.lowWaterMark = options.lowWaterMark || 1024;
  this.buffer = [];
  this.length = 0;
  this._pipes = [];
  this._flowing = false;
  Stream.apply(this);
}

// you can override either this method, or _read(n, cb) below.
Readable.prototype.read = function(n) {
  if (this.length === 0 && this.ended) {
    process.nextTick(this.emit.bind(this, 'end'));
    return null;
  }

  if (isNaN(n) || n <= 0) n = this.length;
  n = Math.min(n, this.length);

  var ret = n > 0 ? fromList(n, this.buffer, this.length) : null;
  this.length -= n;

  if (!this.ended && this.length < this.lowWaterMark) {
    this._read(this.bufferSize, function onread(er, chunk) {
      if (er) return this.emit('error', er);

      if (!chunk || !chunk.length) {
        this.ended = true;
        if (this.length === 0) this.emit('end');
        return;
      }

      this.length += chunk.length;
      this.buffer.push(chunk);
      if (this.length < this.lowWaterMark) {
        this._read(this.bufferSize, onread.bind(this));
      }
      this.emit('readable');
    }.bind(this));
  }

  return ret;
};

// abstract method.  to be overridden in specific implementation classes.
Readable.prototype._read = function(n, cb) {
  process.nextTick(cb.bind(this, new Error('not implemented')));
};

Readable.prototype.pipe = function(dest, opt) {
  var src = this;
  src._pipes.push(dest);
  if ((!opt || opt.end !== false) &&
      dest !== process.stdout && 
      dest !== process.stderr) {
    src.once('end', onend);
    dest.on('unpipe', function(readable) {
      if (readable === src) {
        src.removeListener('end', onend);
      }
    });
  }

  dest.emit('pipe', src);
  if (!src._flowing) process.nextTick(flow.bind(src));
  return dest;

  function onend() {
    dest.end();
  }
};

function flow(src) {
  if (!src) src = this;
  var chunk;
  var dest;
  var needDrain = 0;
  while (chunk = src.read()) {
    src._pipes.forEach(function(dest, i, list) {
      var written = dest.write(chunk);
      if (false === written) {
        needDrain++;
        dest.once('drain', ondrain);
      }
    });
    if (needDrain > 0) return;
  }

  src.once('readable', flow);

  function ondrain() {
    needDrain--;
    if (needDrain === 0) {
      flow(src);
    }
  }
}

Readable.prototype.unpipe = function(dest) {
  if (!dest) {
    // remove all of them.
    this._pipes.forEach(function(dest, i, list) {
      dest.emit('unpipe', this);
    }, this);
    this._pipes.length = 0;
  } else {
    var i = this._pipes.indexOf(dest);
    if (i !== -1) {
      dest.emit('unpipe', this);
      this._pipes.splice(i, 1);
    }
  }
  return this;
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
  this.buffer = [];
  this.length = 0;
  var paused = false;
  var ended = false;

  stream.on('end', function() {
    ended = true;
    if (this.length === 0) {
      this.emit('end');
    }
  }.bind(this));

  stream.on('data', function(chunk) {
    this.buffer.push(chunk);
    this.length += chunk.length;
    this.emit('readable');
    // if not consumed, then pause the stream.
    if (this.length > this.lowWaterMark && !paused) {
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
    if (this.length === 0) return null;

    if (isNaN(n) || n <= 0) n = this.length;

    var ret = fromList(n, this.buffer, this.length);
    this.length = Math.max(0, this.length - n);

    if (this.length < this.lowWaterMark && paused) {
      stream.resume();
      paused = false;
    }

    if (this.length === 0 && ended) {
      process.nextTick(this.emit.bind(this, 'end'));
    }
    return ret;
  };
};
