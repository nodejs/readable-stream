var tap = require('tap');
var R = require('../readable');

var util = require('util');
var EE = require('events').EventEmitter;

function TestReader(n) {
  R.apply(this);
  this._buffer = new Buffer(n || 100);
  this._buffer.fill('x');
  this._pos = 0;
  this._bufs = 10;
}

util.inherits(TestReader, R);

TestReader.prototype.read = function(n) {
  var max = this._buffer.length - this._pos;
  n = n || max;
  n = Math.max(n, 0);
  var toRead = Math.min(n, max);
  if (toRead === 0) {
    // simulate the read buffer filling up with some more bytes some time
    // in the future.
    setTimeout(function() {
      this._pos = 0;
      this._bufs -= 1;
      if (this._bufs <= 0) {
        // read them all!
        if (!this.ended) {
          this.emit('end');
          this.ended = true;
        }
      } else {
        this.emit('readable');
      }
    }.bind(this), 10);
    return null;
  }

  var ret = this._buffer.slice(this._pos, this._pos + toRead);
  this._pos += toRead;
  return ret;
};

/////

function TestWriter() {
  EE.apply(this);
  this.received = [];
  this.flush = false;
}

util.inherits(TestWriter, EE);

TestWriter.prototype.write = function(c) {
  this.received.push(c.toString());
  this.emit('write', c);
  return true;

  // flip back and forth between immediate acceptance and not.
  this.flush = !this.flush;
  if (!this.flush) setTimeout(this.emit.bind(this, 'drain'), 10);
  return this.flush;
};

TestWriter.prototype.end = function(c) {
  if (c) this.write(c);
  this.emit('end', this.received);
};

////////

tap.test('a most basic test', function(t) {
  var r = new TestReader(20);

  var reads = [];
  var expect = [ 'x',
                 'xx',
                 'xxx',
                 'xxxx',
                 'xxxxx',
                 'xxxxx',
                 'xxxxxxxx',
                 'xxxxxxxxx',
                 'xxx',
                 'xxxxxxxxxxxx',
                 'xxxxxxxx',
                 'xxxxxxxxxxxxxxx',
                 'xxxxx',
                 'xxxxxxxxxxxxxxxxxx',
                 'xx',
                 'xxxxxxxxxxxxxxxxxxxx',
                 'xxxxxxxxxxxxxxxxxxxx',
                 'xxxxxxxxxxxxxxxxxxxx',
                 'xxxxxxxxxxxxxxxxxxxx',
                 'xxxxxxxxxxxxxxxxxxxx' ];

  r.on('end', function() {
    t.same(reads, expect);
    t.end();
  });

  var readSize = 1;
  function flow() {
    var res;
    while (null !== (res = r.read(readSize++))) {
      reads.push(res.toString());
    }
    r.once('readable', flow);
  }

  flow();
});

tap.test('pipe', function(t) {
  var r = new TestReader(5);

  var expect = [ 'xxxxx',
                 'xxxxx',
                 'xxxxx',
                 'xxxxx',
                 'xxxxx',
                 'xxxxx',
                 'xxxxx',
                 'xxxxx',
                 'xxxxx',
                 'xxxxx' ]

  var w = new TestWriter;
  var flush = true;
  w.on('end', function(received) {
    t.same(received, expect);
    t.end();
  });

  r.pipe(w);
});



[1,2,3,4,5,6,7,8,9].forEach(function(SPLIT) {
  tap.test('unpipe', function(t) {
    var r = new TestReader(5);

    // unpipe after 3 writes, then write to another stream instead.
    var expect = [ 'xxxxx',
                   'xxxxx',
                   'xxxxx',
                   'xxxxx',
                   'xxxxx',
                   'xxxxx',
                   'xxxxx',
                   'xxxxx',
                   'xxxxx',
                   'xxxxx' ];
    expect = [ expect.slice(0, SPLIT), expect.slice(SPLIT) ];

    var w = [ new TestWriter(), new TestWriter() ];

    var writes = SPLIT;
    w[0].on('write', function() {
      if (--writes === 0) {
        r.unpipe();
        w[0].end();
        r.pipe(w[1]);
      }
    });

    var ended = 0;

    w[0].on('end', function(results) {
      ended++;
      t.same(results, expect[0]);
    });

    w[1].on('end', function(results) {
      ended++;
      t.equal(ended, 2);
      t.same(results, expect[1]);
      t.end();
    });

    r.pipe(w[0]);
  });
});


// both writers should get the same exact data.
tap.test('multipipe', function(t) {
  var r = new TestReader(5);
  var w = [ new TestWriter, new TestWriter ];

  var expect = [ 'xxxxx',
                 'xxxxx',
                 'xxxxx',
                 'xxxxx',
                 'xxxxx',
                 'xxxxx',
                 'xxxxx',
                 'xxxxx',
                 'xxxxx',
                 'xxxxx' ];

  var c = 2;
  w[0].on('end', function(received) {
    t.same(received, expect, 'first');
    if (--c === 0) t.end();
  });
  w[1].on('end', function(received) {
    t.same(received, expect, 'second');
    if (--c === 0) t.end();
  });

  r.pipe(w[0]);
  r.pipe(w[1]);
});


[1,2,3,4,5,6,7,8,9].forEach(function(SPLIT) {
  tap.test('multi-unpipe', function(t) {
    var r = new TestReader(5);

    // unpipe after 3 writes, then write to another stream instead.
    var expect = [ 'xxxxx',
                   'xxxxx',
                   'xxxxx',
                   'xxxxx',
                   'xxxxx',
                   'xxxxx',
                   'xxxxx',
                   'xxxxx',
                   'xxxxx',
                   'xxxxx' ];
    expect = [ expect.slice(0, SPLIT), expect.slice(SPLIT) ];

    var w = [ new TestWriter(), new TestWriter(), new TestWriter() ];

    var writes = SPLIT;
    w[0].on('write', function() {
      if (--writes === 0) {
        r.unpipe();
        w[0].end();
        r.pipe(w[1]);
      }
    });

    var ended = 0;

    w[0].on('end', function(results) {
      ended++;
      t.same(results, expect[0]);
    });

    w[1].on('end', function(results) {
      ended++;
      t.equal(ended, 2);
      t.same(results, expect[1]);
      t.end();
    });

    r.pipe(w[0]);
    r.pipe(w[2]);
  });
});
