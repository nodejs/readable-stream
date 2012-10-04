var test = require('tap').test;
var fromList = require('../readable.js')._fromList;

test('buffers', function(t) {
  // have a length
  var len = 16;
  var list = [ new Buffer('foog'),
               new Buffer('bark'),
               new Buffer('bazy'),
               new Buffer('kuel') ];

  // read more than the first element.
  var ret = fromList(6, list, 16);
  t.equal(ret.toString(), 'foogba');

  // read exactly the first element.
  ret = fromList(2, list, 10);
  t.equal(ret.toString(), 'rk');

  // read less than the first element.
  ret = fromList(2, list, 8);
  t.equal(ret.toString(), 'ba');

  // read more than we have.
  ret = fromList(100, list, 6);
  t.equal(ret.toString(), 'zykuel');

  // all consumed.
  t.same(list, []);

  t.end();
});

test('strings', function(t) {
  // have a length
  var len = 16;
  var list = [ 'foog',
               'bark',
               'bazy',
               'kuel' ];

  // read more than the first element.
  var ret = fromList(6, list, 16, true);
  t.equal(ret, 'foogba');

  // read exactly the first element.
  ret = fromList(2, list, 10, true);
  t.equal(ret, 'rk');

  // read less than the first element.
  ret = fromList(2, list, 8, true);
  t.equal(ret, 'ba');

  // read more than we have.
  ret = fromList(100, list, 6, true);
  t.equal(ret, 'zykuel');

  // all consumed.
  t.same(list, []);

  t.end();
});
