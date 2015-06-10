'use strict';
var common = require('../common');
var stream = require('../../');

var crypto = require('crypto');

var inherits = require('inherits');
module.exports = function (t) {
  t.test('unpipe drain', function (t) {
    try {
      crypto.randomBytes(9);
    } catch(_) {
      t.ok(true, 'does not suport random, skipping');
      return t.end();
    }
    function TestWriter() {
      stream.Writable.call(this);
    }
    inherits(TestWriter, stream.Writable);

    TestWriter.prototype._write = function(buffer, encoding, callback) {
      //console.log('write called');
      // super slow write stream (callback never called)
    };

    var dest = new TestWriter();

    function TestReader(id) {
      stream.Readable.call(this);
      this.reads = 0;
    }
    inherits(TestReader, stream.Readable);

    TestReader.prototype._read = function(size) {
      this.reads += 1;
      this.push(crypto.randomBytes(size));
    };

    var src1 = new TestReader();
    var src2 = new TestReader();

    src1.pipe(dest);

    src1.once('readable', function() {
      process.nextTick(function() {

        src2.pipe(dest);

        src2.once('readable', function() {
          process.nextTick(function() {

            src1.unpipe(dest);
          });
        });
      });
    });


    dest.on('unpipe', function() {
      t.equal(src1.reads, 2);
      t.equal(src2.reads, 2);
      t.end();
    });
  });
}
