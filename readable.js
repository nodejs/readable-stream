'use strict';

module.exports = Readable;

var Stream = require('stream');
var util = require('util');
var fromList = require('./from-list.js');

util.inherits(Readable, Stream);

function ReadableOptions(options, stream) {
  options = options || {};
  this.bufferSize = options.bufferSize || 16 * 1024;
  this.lowWaterMark = options.lowWaterMark || 1024;
  this.buffer = [];
  this.length = 0;
  this.pipes = [];
  this.flowing = false;
  this.ended = false;
  this.bufferSize = 0;
  this.stream = stream;
}

function Readable(options) {
  this._readableOptions = new ReadableOptions(options, this);
  Stream.apply(this);
}

// you can override either this method, or _read(n, cb) below.
Readable.prototype.read = function(n) {
  var opt = this._readableOptions;

  if (opt.length === 0 && opt.ended) {
    process.nextTick(this.emit.bind(this, 'end'));
    return null;
  }

  if (isNaN(n) || n <= 0)
    n = opt.bufferSize || opt.length;

  // XXX: controversial.
  // don't have that much.  return null, unless we've ended.
  if (n > opt.length) {
    if (!opt.ended)
      return null;
    else
      n = opt.length;
  }

  var ret = n > 0 ? fromList(n, opt.buffer, opt.length) : null;
  opt.length -= n;

  if (!opt.ended && opt.length < opt.lowWaterMark) {
    // call internal read method
    this._read(this.bufferSize, function onread(er, chunk) {
      if (er)
        return this.emit('error', er);

      if (!chunk || !chunk.length) {
        opt.ended = true;
        if (opt.length === 0)
          this.emit('end');
        return;
      }

      opt.length += chunk.length;
      opt.buffer.push(chunk);
      if (opt.length < opt.lowWaterMark) {
        this._read(opt.bufferSize, onread.bind(this));
      }
      // now we have something to call this.read() to get.
      this.emit('readable');
    }.bind(this));
  }

  return ret;
};

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n, cb) {
  process.nextTick(cb.bind(this, new Error('not implemented')));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var opt = this._readableOptions;
  opt.pipes.push(dest);

  if ((!pipeOpts || pipeOpts.end !== false) &&
      dest !== process.stdout && 
      dest !== process.stderr) {
    src.once('end', onend);
    dest.on('unpipe', function(readable) {
      if (readable === src)
        src.removeListener('end', onend);
    });
  }

  function onend() {
    dest.end();
  }

  dest.emit('pipe', src);

  // start the flow.
  if (!opt.flowing)
    process.nextTick(flow.bind(src));

  return dest;
};

function flow(src) {
  if (!src)
    src = this;

  var opt = src._readableOptions;
  var chunk;
  var dest;
  var needDrain = 0;

  function ondrain() {
    needDrain--;
    if (needDrain === 0)
      flow(src);
  }

  while (opt.pipes.length &&
         null !== (chunk = src.read())) {
    opt.pipes.forEach(function(dest, i, list) {
      var written = dest.write(chunk);
      if (false === written) {
        needDrain++;
        dest.once('drain', ondrain);
      }
    });
    src.emit('data', chunk);

    // if anyone needs a drain, then we have to wait for that.
    if (needDrain > 0)
      return;
  }

  // if every destination was unpiped, either before entering this
  // function, or in the while loop, then stop flowing.
  //
  // NB: This is a pretty rare edge case.
  if (opt.pipes.length === 0) {
    opt.flowing = false;

    // if there were data event listeners added, then switch to old mode.
    if (this.listeners('data').length)
      emitDataEvents(this);
    return;
  }

  // at this point, no one needed a drain, so we just ran out of data
  // on the next readable event, start it over again.
  src.once('readable', flow);
}

Readable.prototype.unpipe = function(dest) {
  var opt = this._readableOptions;
  if (!dest) {
    // remove all of them.
    opt.pipes.forEach(function(dest, i, list) {
      dest.emit('unpipe', this);
    }, this);
    opt.pipes.length = 0;
  } else {
    var i = opt.pipes.indexOf(dest);
    if (i !== -1) {
      dest.emit('unpipe', this);
      opt.pipes.splice(i, 1);
    }
  }
  return this;
};

// kludge for on('data', fn) consumers.  Sad.
// This is *not* part of the new readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.on = function(ev, fn) {
  // https://github.com/isaacs/readable-stream/issues/16
  // if we're already flowing, then no need to set up data events.
  if (ev === 'data' && !this._readableOptions.flowing)
    emitDataEvents(this);

  return Stream.prototype.on.call(this, ev, fn);
};
Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  emitDataEvents(this);
  return this.resume();
};

Readable.prototype.pause = function() {
  emitDataEvents(this);
  return this.pause();
};

function emitDataEvents(stream) {
  var opt = stream._readableOptions;

  if (opt.flowing) {
    // https://github.com/isaacs/readable-stream/issues/16
    throw new Error('Cannot switch to old mode now.');
  }

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
    if (c === null)
      readable = false;
  });

  stream.pause = function() {
    paused = true;
  };

  stream.resume = function() {
    paused = false;
    if (readable)
      stream.emit('readable');
  };
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var opt = this._readableOptions;
  var paused = false;

  stream.on('end', function() {
    opt.ended = true;
    if (opt.length === 0)
      this.emit('end');
  }.bind(this));

  stream.on('data', function(chunk) {
    opt.buffer.push(chunk);
    opt.length += chunk.length;
    this.emit('readable');

    // if not consumed, then pause the stream.
    if (opt.length > opt.lowWaterMark && !paused) {
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
    if (opt.length === 0)
      return null;

    if (isNaN(n) || n <= 0)
      n = opt.bufferSize || opt.length;

    if (n > opt.length) {
      if (!opt.ended)
        return null;
      else
        n = opt.length;
    }

    var ret = fromList(n, opt.buffer, opt.length);
    opt.length -= n;

    if (opt.length < opt.lowWaterMark && paused) {
      stream.resume();
      paused = false;
    }

    if (opt.length === 0 && ended)
      process.nextTick(this.emit.bind(this, 'end'));

    return ret;
  };
};
