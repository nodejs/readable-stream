var PassThrough = require('../passthrough.js');
var test = require('tap').test;

test('passthrough', function(t) {
  var pt = new PassThrough;

  pt.write(new Buffer('foog'));
  pt.write(new Buffer('bark'));
  pt.write(new Buffer('bazy'));
  pt.write(new Buffer('kuel'));

  t.equal(pt.read(5).toString(), 'foogb');
  t.equal(pt.read(5).toString(), 'arkba');
  t.equal(pt.read(5).toString(), 'zykue');
  t.equal(pt.read(5).toString(), 'l');
  t.end();
});

test('passthrough with transform', function(t) {
  pt = new PassThrough;
  pt.transform = function(c) {
    var ret = new Buffer(c.length);
    ret.fill('x');
    return ret;
  };

  pt.write(new Buffer('foog'));
  pt.write(new Buffer('bark'));
  pt.write(new Buffer('bazy'));
  pt.write(new Buffer('kuel'));

  t.equal(pt.read(5).toString(), 'xxxxx');
  t.equal(pt.read(5).toString(), 'xxxxx');
  t.equal(pt.read(5).toString(), 'xxxxx');
  t.equal(pt.read(5).toString(), 'x');
  t.end();
});

test('passthrough reordered', function(t) {
  pt = new PassThrough;
  var emits = 0;
  pt.on('readable', function() {
    emits++;
  });

  pt.write(new Buffer('foog'));
  pt.write(new Buffer('bark'));

  t.equal(pt.read(5).toString(), 'foogb');
  t.equal(pt.read(5).toString(), 'ark');
  t.equal(pt.read(5), null);

  pt.write(new Buffer('bazy'));
  pt.write(new Buffer('kuel'));

  t.equal(pt.read(5).toString(), 'bazyk');
  t.equal(pt.read(5).toString(), 'uel');
  t.equal(pt.read(5), null);

  t.equal(emits, 2);
  t.end();
});

test('passthrough facaded', function(t) {
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
  pt.write(new Buffer('bark'));
  pt.write(new Buffer('bazy'));
  pt.write(new Buffer('kuel'));
  pt.end();
});
