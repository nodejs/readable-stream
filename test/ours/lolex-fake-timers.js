require('../common');
var tap = require('tap');
var util = require('util');
var assert = require('assert');
var lolex = require('lolex');
var stream = require('../../');
var Transform = stream.Transform;

function MyTransform() {
  Transform.call(this);
}

util.inherits(MyTransform, Transform);

var clock = lolex.install({toFake: [ 'setImmediate', 'nextTick' ]});
var stream2DataCalled = false;

var stream = new MyTransform();
stream.on('data', function() {
  stream.on('end', function() {

    var stream2 = new MyTransform();
    stream2.on('data', function() {
      stream2.on('end', function() {
        stream2DataCalled = true
      });
      setImmediate(function() {
        stream2.end()
      });
    });
    stream2.emit('data')

  });
  stream.end();
});
stream.emit('data');

clock.runAll()
clock.uninstall();
assert(stream2DataCalled);
t.pass('ok');
