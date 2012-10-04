var R = require('../readable.js');
var test = require('tap').test;
var util = require('util');

util.inherits(TestReader, R);

function TestReader(n, opts) {
  R.call(this, util._extend({
    bufferSize: 5
  }, opts));

  this.pos = 0;
  this.len = n || 100;
}

TestReader.prototype._read = function(n, cb) {
  setTimeout(function() {

    if (this.pos >= this.len) {
      return cb();
    }

    n = Math.min(n, this.len - this.pos);
    if (n <= 0) {
      return cb();
    }

    this.pos += n;
    var ret = new Buffer(n);
    ret.fill('a');

    return cb(null, ret);
  }.bind(this), 10);
};

test('setEncoding utf8', function(t) {
  var tr = new TestReader(100);
  tr.setEncoding('utf8');
  var out = [];
  var expect =
    [ 'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa' ];

  tr.on('readable', function flow() {
    var chunk;
    while (null !== (chunk = tr.read(10)))
      out.push(chunk);
  });

  tr.on('end', function() {
    t.same(out, expect);
    t.end();
  });

  // just kick it off.
  tr.emit('readable');
});


test('setEncoding hex', function(t) {
  var tr = new TestReader(100);
  tr.setEncoding('hex');
  var out = [];
  var expect =
    [ '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161' ];

  tr.on('readable', function flow() {
    var chunk;
    while (null !== (chunk = tr.read(10)))
      out.push(chunk);
  });

  tr.on('end', function() {
    t.same(out, expect);
    t.end();
  });

  // just kick it off.
  tr.emit('readable');
});

test('setEncoding hex with read(13)', function(t) {
  var tr = new TestReader(100);
  tr.setEncoding('hex');
  var out = [];
  var expect =
    [ "6161616161616",
      "1616161616161",
      "6161616161616",
      "1616161616161",
      "6161616161616",
      "1616161616161",
      "6161616161616",
      "1616161616161",
      "6161616161616",
      "1616161616161",
      "6161616161616",
      "1616161616161",
      "6161616161616",
      "1616161616161",
      "6161616161616",
      "16161" ];

  tr.on('readable', function flow() {
    var chunk;
    while (null !== (chunk = tr.read(13)))
      out.push(chunk);
  });

  tr.on('end', function() {
    t.same(out, expect);
    t.end();
  });

  // just kick it off.
  tr.emit('readable');
});

test('encoding: utf8', function(t) {
  var tr = new TestReader(100, { encoding: 'utf8' });
  var out = [];
  var expect =
    [ 'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa' ];

  tr.on('readable', function flow() {
    var chunk;
    while (null !== (chunk = tr.read(10)))
      out.push(chunk);
  });

  tr.on('end', function() {
    t.same(out, expect);
    t.end();
  });

  // just kick it off.
  tr.emit('readable');
});


test('encoding: hex', function(t) {
  var tr = new TestReader(100, { encoding: 'hex' });
  var out = [];
  var expect =
    [ '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161' ];

  tr.on('readable', function flow() {
    var chunk;
    while (null !== (chunk = tr.read(10)))
      out.push(chunk);
  });

  tr.on('end', function() {
    t.same(out, expect);
    t.end();
  });

  // just kick it off.
  tr.emit('readable');
});

test('encoding: hex with read(13)', function(t) {
  var tr = new TestReader(100, { encoding: 'hex' });
  var out = [];
  var expect =
    [ "6161616161616",
      "1616161616161",
      "6161616161616",
      "1616161616161",
      "6161616161616",
      "1616161616161",
      "6161616161616",
      "1616161616161",
      "6161616161616",
      "1616161616161",
      "6161616161616",
      "1616161616161",
      "6161616161616",
      "1616161616161",
      "6161616161616",
      "16161" ];

  tr.on('readable', function flow() {
    var chunk;
    while (null !== (chunk = tr.read(13)))
      out.push(chunk);
  });

  tr.on('end', function() {
    t.same(out, expect);
    t.end();
  });

  // just kick it off.
  tr.emit('readable');
});
