var test = require('tap').test;
var W = require('../writable.js');

var util = require('util');
util.inherits(TestWriter, W);

function TestWriter() {
  W.apply(this, arguments);
  this.buffer = [];
}

TestWriter.prototype._write = function(chunk, cb) {
  // simulate a small unpredictable latency
  setTimeout(function() {
    this.buffer.push(chunk);
    cb();
  }.bind(this), Math.floor(Math.random() * 10));
};

var chunks = new Array(50);
for (var i = 0; i < chunks.length; i++) {
  chunks[i] = new Array(i + 1).join('x');
}

test('write fast', function(t) {
  var tw = new TestWriter({
    lowWaterMark: 5,
    highWaterMark: 100
  });

  tw.on('finish', function() {
    t.same(tw.buffer, chunks, 'got chunks in the right order');
    t.end();
  });

  chunks.forEach(function(chunk) {
    // screw backpressure.  Just buffer it all up.
    tw.write(chunk);
  });
  tw.end();
});

test('write slow', function(t) {
  var tw = new TestWriter({
    lowWaterMark: 5,
    highWaterMark: 100
  });

  tw.on('finish', function() {
    t.same(tw.buffer, chunks, 'got chunks in the right order');
    t.end();
  });

  var i = 0;
  (function W() {
    tw.write(chunks[i++]);
    if (i < chunks.length)
      setTimeout(W, 10);
    else
      tw.end();
  })();
});

test('write backpressure', function(t) {
  var tw = new TestWriter({
    lowWaterMark: 5,
    highWaterMark: 100
  });

  tw.on('finish', function() {
    t.same(tw.buffer, chunks, 'got chunks in the right order');
    t.end();
  });

  var i = 0;
  (function W() {
    do {
      var ret = tw.write(chunks[i++]);
    } while (ret !== false);

    if (i < chunks.length)
      tw.once('drain', W);
    else
      tw.end();
  })();
});
