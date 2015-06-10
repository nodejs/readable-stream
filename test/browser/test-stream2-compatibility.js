'use strict';
var R = require('../../lib/_stream_readable');
var inherits = require('inherits');
var EE = require('events').EventEmitter;
module.exports = function (t) {
  t.test('compatibility', function (t) {
    t.plan(1);

    var ondataCalled = 0;

    function TestReader() {
      R.apply(this);
      this._buffer = new Buffer(100);
      this._buffer.fill('x');

      this.on('data', function() {
        ondataCalled++;
      });
    }

    inherits(TestReader, R);

    TestReader.prototype._read = function(n) {
      this.push(this._buffer);
      this._buffer = new Buffer(0);
    };

    var reader = new TestReader();
    setTimeout(function() {
      t.equal(ondataCalled, 1);
    });
  });
}
