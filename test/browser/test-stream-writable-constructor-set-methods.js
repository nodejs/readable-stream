'use strict';
var common = require('../common');
var Writable = require('../../').Writable;

module.exports = function (t) {
  t.test('writable constructor set methods', function (t){


    var _writeCalled = false;
    function _write(d, e, n) {
      _writeCalled = true;
    }

    var w = new Writable({ write: _write });
    w.end(new Buffer('blerg'));

    var _writevCalled = false;
    var dLength = 0;
    function _writev(d, n) {
      dLength = d.length;
      _writevCalled = true;
    }

    var w2 = new Writable({ writev: _writev });
    w2.cork();

    w2.write(new Buffer('blerg'));
    w2.write(new Buffer('blerg'));
    w2.end();

    setImmediate(function() {
      t.equal(w._write, _write);
      t.ok(_writeCalled);
      t.equal(w2._writev, _writev);
      t.equal(dLength, 2);
      t.ok(_writevCalled);
      t.end();
    });
  });
}
