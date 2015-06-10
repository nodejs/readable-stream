'use strict';
var common = require('../common');


// Make sure we don't miss the end event for paused 0-length streams

var Readable = require('../../').Readable;
var stream = new Readable();
module.exports = function (t) {
  t.test('end pause', function (t) {
    t.plan(2);
    var calledRead = false;
    stream._read = function() {
      t.notOk(calledRead);
      calledRead = true;
      this.push(null);
    };

    stream.on('data', function() {
      throw new Error('should not ever get data');
    });
    stream.pause();

    setTimeout(function() {
      stream.on('end', function() {
        t.ok(calledRead);
      });
      stream.resume();
    });

  });
}
