// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

'use strict';

module.exports = Writable

var util = require('util');
var Stream = require('stream');

util.inherits(Writable, Stream);

function WritableState(options) {
  options = options || {};
  this.highWaterMark = options.highWaterMark || 16 * 1024;
  this.lowWaterMark = options.lowWaterMark || 1024;
  this.needDrain = false;
  this.ended = false;
  this.ending = false;

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  this.writing = false;
  this.buffer = [];
}

function Writable(options) {
  this._writableState = new WritableState(options);

  // legacy.
  this.writable = true;

  Stream.call(this);
}

// Override this method for sync streams
// override the _write(chunk, cb) method for async streams
Writable.prototype.write = function(chunk, encoding) {
  var state = this._writableState;
  if (state.ended) {
    this.emit('error', new Error('write after end'));
    return;
  }

  if (typeof chunk === 'string' && encoding)
    chunk = new Buffer(chunk, encoding);

  var ret = state.length >= state.highWaterMark;
  if (ret === false)
    state.needDrain = true;

  var l = chunk.length;
  state.length += l;

  if (state.writing) {
    state.buffer.push(chunk);
    return ret;
  }

  state.writing = true;
  this._write(chunk, function writecb(er) {
    state.writing = false;
    if (er) {
      this.emit('error', er);
      return;
    }
    state.length -= l;

    if (state.length === 0 && (state.ended || state.ending)) {
      // emit 'finish' at the very end.
      this.emit('finish');
      return;
    }

    // if there's something in the buffer waiting, then do that, too.
    if (state.buffer.length) {
      chunk = state.buffer.shift();
      l = chunk.length;
      state.writing = true;
      this._write(chunk, writecb.bind(this));
    }

    if (state.length < state.lowWaterMark && state.needDrain) {
      // Must force callback to be called on nextTick, so that we don't
      // emit 'drain' before the write() consumer gets the 'false' return
      // value, and has a chance to attach a 'drain' listener.
      process.nextTick(function() {
        if (!state.needDrain)
          return;
        state.needDrain = false;
        this.emit('drain');
      }.bind(this));
    }

  }.bind(this));

  return ret;
};

Writable.prototype._write = function(chunk, cb) {
  process.nextTick(cb.bind(this, new Error('not implemented')));
};

Writable.prototype.end = function(chunk, encoding) {
  var state = this._writableState;
  state.ending = true;
  if (chunk)
    this.write(chunk, encoding);
  else if (state.length === 0)
    this.emit('finish');
  state.ended = true;
};
