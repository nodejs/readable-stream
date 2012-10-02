var PassThrough = require('../passthrough.js');
var Transform = require('../transform.js');
var test = require('tap').test;

test('passthrough', function(t) {
  var pt = new PassThrough;

  pt.write(new Buffer('foog'));
  pt.write(new Buffer('bark'));
  pt.write(new Buffer('bazy'));
  pt.write(new Buffer('kuel'));
  pt.end();

  t.equal(pt.read(5).toString(), 'foogb');
  t.equal(pt.read(5).toString(), 'arkba');
  t.equal(pt.read(5).toString(), 'zykue');
  t.equal(pt.read(5).toString(), 'l');
  t.end();
});

test('simple transform', function(t) {
  var pt = new Transform;
  pt._transform = function(c, output, cb) {
    var ret = new Buffer(c.length);
    ret.fill('x');
    output(ret);
    cb();
  };

  pt.write(new Buffer('foog'));
  pt.write(new Buffer('bark'));
  pt.write(new Buffer('bazy'));
  pt.write(new Buffer('kuel'));
  pt.end();

  t.equal(pt.read(5).toString(), 'xxxxx');
  t.equal(pt.read(5).toString(), 'xxxxx');
  t.equal(pt.read(5).toString(), 'xxxxx');
  t.equal(pt.read(5).toString(), 'x');
  t.end();
});

test('async passthrough', function(t) {
  var pt = new Transform;
  pt._transform = function(chunk, output, cb) {
    setTimeout(function() {
      output(chunk);
      cb();
    }, 10);
  };

  pt.write(new Buffer('foog'));
  pt.write(new Buffer('bark'));
  pt.write(new Buffer('bazy'));
  pt.write(new Buffer('kuel'));
  pt.end();

  setTimeout(function() {
    t.equal(pt.read(5).toString(), 'foogb');
    t.equal(pt.read(5).toString(), 'arkba');
    t.equal(pt.read(5).toString(), 'zykue');
    t.equal(pt.read(5).toString(), 'l');
    t.end();
  }, 100);
});

test('assymetric transform (expand)', function(t) {
  var pt = new Transform;

  // emit each chunk 2 times.
  pt._transform = function(chunk, output, cb) {
    setTimeout(function() {
      output(chunk);
      setTimeout(function() {
        output(chunk);
        cb();
      }, 10)
    }, 10);
  };

  pt.write(new Buffer('foog'));
  pt.write(new Buffer('bark'));
  pt.write(new Buffer('bazy'));
  pt.write(new Buffer('kuel'));
  pt.end();

  setTimeout(function() {
    t.equal(pt.read(5).toString(), 'foogf');
    t.equal(pt.read(5).toString(), 'oogba');
    t.equal(pt.read(5).toString(), 'rkbar');
    t.equal(pt.read(5).toString(), 'kbazy');
    t.equal(pt.read(5).toString(), 'bazyk');
    t.equal(pt.read(5).toString(), 'uelku');
    t.equal(pt.read(5).toString(), 'el');
    t.end();
  }, 100);
});

test('assymetric transform (compress)', function(t) {
  var pt = new Transform;

  // each output is the first char of 3 consecutive chunks,
  // or whatever's left.
  pt.state = '';

  pt._transform = function(chunk, output, cb) {
    if (!chunk)
      chunk = '';
    var s = chunk.toString();
    setTimeout(function() {
      this.state += s.charAt(0);
      if (this.state.length === 3) {
        console.error('call output!')
        output(new Buffer(this.state));
        this.state = '';
      }
      cb();
    }.bind(this), 10);
  };

  pt._flush = function(output, cb) {
    // just output whatever we have.
    setTimeout(function() {
      output(new Buffer(this.state));
      this.state = '';
      cb();
    }.bind(this), 10);
  };

  pt._writableState.lowWaterMark = 3;

  pt.write(new Buffer('aaaa'));
  pt.write(new Buffer('bbbb'));
  pt.write(new Buffer('cccc'));
  pt.write(new Buffer('dddd'));
  pt.write(new Buffer('eeee'));
  pt.write(new Buffer('aaaa'));
  pt.write(new Buffer('bbbb'));
  pt.write(new Buffer('cccc'));
  pt.write(new Buffer('dddd'));
  pt.write(new Buffer('eeee'));
  pt.write(new Buffer('aaaa'));
  pt.write(new Buffer('bbbb'));
  pt.write(new Buffer('cccc'));
  pt.write(new Buffer('dddd'));
  pt.end();

  // 'abcdeabcdeabcd'
  setTimeout(function() {
    t.equal(pt.read(5).toString(), 'abcde');
    t.equal(pt.read(5).toString(), 'abcde');
    t.equal(pt.read(5).toString(), 'abcd');
    t.end();
  }, 200);
});


test('passthrough reordered', function(t) {
  var pt = new PassThrough;
  var emits = 0;
  pt.on('readable', function() {
    console.error('emit readable', emits)
    emits++;
  });

  pt.write(new Buffer('foog'));
  pt.write(new Buffer('bark'));

  t.equal(pt.read(5).toString(), 'foogb');
  t.equal(pt.read(5), null);

  console.error('need emit 0');

  pt.write(new Buffer('bazy'));
  pt.write(new Buffer('kuel'));

  t.equal(pt.read(5).toString(), 'arkba');
  t.equal(pt.read(5).toString(), 'zykue');
  t.equal(pt.read(5), null);

  console.error('need emit 1');

  pt.end();

  t.equal(pt.read(5).toString(), 'l');
  t.equal(pt.read(5), null);

  t.equal(emits, 2);
  t.end();
});

test('passthrough facaded', function(t) {
  console.error('passthrough facaded');
  var pt = new PassThrough;
  var datas = [];
  pt.on('data', function(chunk) {
    datas.push(chunk.toString());
  });

  pt.on('end', function() {
    t.same(datas, ['foog', 'bark', 'bazy', 'kuel']);
    t.end();
  });

  pt.write(new Buffer('foog'));
  setTimeout(function() {
    pt.write(new Buffer('bark'));
    setTimeout(function() {
      pt.write(new Buffer('bazy'));
      setTimeout(function() {
        pt.write(new Buffer('kuel'));
        setTimeout(function() {
          pt.end();
        }, 10);
      }, 10);
    }, 10);
  }, 10);
});
