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
