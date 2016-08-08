// Flags: --expose_internals
/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/
require('../common');
var fromList = require('../../lib/_stream_readable')._fromList;
var BufferList = require('../../lib/internal/streams/BufferList');

function bufferListFromArray(arr) {
  var bl = new BufferList();
  for (var i = 0; i < arr.length; ++i) {
    bl.push(arr[i]);
  }return bl;
}

module.exports = function (t) {
  t.test('buffers', function (t) {
    var list = [bufferShim.from('foog'), bufferShim.from('bark'), bufferShim.from('bazy'), bufferShim.from('kuel')];
    list = bufferListFromArray(list);

    // read more than the first element.
    var ret = fromList(6, { buffer: list, length: 16 });
    t.equal(ret.toString(), 'foogba');

    // read exactly the first element.
    ret = fromList(2, { buffer: list, length: 10 });
    t.equal(ret.toString(), 'rk');

    // read less than the first element.
    ret = fromList(2, { buffer: list, length: 8 });
    t.equal(ret.toString(), 'ba');

    // read more than we have.
    ret = fromList(100, { buffer: list, length: 6 });
    t.equal(ret.toString(), 'zykuel');

    // all consumed.
    t.same(list, new BufferList());

    t.end();
  });

  t.test('strings', function (t) {
    var list = ['foog', 'bark', 'bazy', 'kuel'];
    list = bufferListFromArray(list);

    // read more than the first element.
    var ret = fromList(6, { buffer: list, length: 16, decoder: true });
    t.equal(ret, 'foogba');

    // read exactly the first element.
    ret = fromList(2, { buffer: list, length: 10, decoder: true });
    t.equal(ret, 'rk');

    // read less than the first element.
    ret = fromList(2, { buffer: list, length: 8, decoder: true });
    t.equal(ret, 'ba');

    // read more than we have.
    ret = fromList(100, { buffer: list, length: 6, decoder: true });
    t.equal(ret, 'zykuel');

    // all consumed.
    t.same(list, new BufferList());

    t.end();
  });
}
