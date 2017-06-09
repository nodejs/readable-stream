/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

var common = require('../common');

var _require = require('../../'),
    Duplex = _require.Duplex;

var assert = require('assert/');

var _require2 = require('util'),
    inherits = _require2.inherits;

{
  var duplex = new Duplex({
    write: function (chunk, enc, cb) {
      cb();
    },
    read: function () {}
  });

  duplex.resume();

  duplex.on('end', common.mustCall());
  duplex.on('finish', common.mustCall());

  duplex.destroy();
  assert.strictEqual(duplex.destroyed, true);
}

{
  var _duplex = new Duplex({
    write: function (chunk, enc, cb) {
      cb();
    },
    read: function () {}
  });
  _duplex.resume();

  var expected = new Error('kaboom');

  _duplex.on('end', common.mustCall());
  _duplex.on('finish', common.mustCall());
  _duplex.on('error', common.mustCall(function (err) {
    assert.strictEqual(err, expected);
  }));

  _duplex.destroy(expected);
  assert.strictEqual(_duplex.destroyed, true);
}

{
  var _duplex2 = new Duplex({
    write: function (chunk, enc, cb) {
      cb();
    },
    read: function () {}
  });

  _duplex2._destroy = common.mustCall(function (err, cb) {
    assert.strictEqual(err, _expected);
    cb(err);
  });

  var _expected = new Error('kaboom');

  _duplex2.on('finish', common.mustNotCall('no finish event'));
  _duplex2.on('error', common.mustCall(function (err) {
    assert.strictEqual(err, _expected);
  }));

  _duplex2.destroy(_expected);
  assert.strictEqual(_duplex2.destroyed, true);
}

{
  var _expected2 = new Error('kaboom');
  var _duplex3 = new Duplex({
    write: function (chunk, enc, cb) {
      cb();
    },
    read: function () {},

    destroy: common.mustCall(function (err, cb) {
      assert.strictEqual(err, _expected2);
      cb();
    })
  });
  _duplex3.resume();

  _duplex3.on('end', common.mustNotCall('no end event'));
  _duplex3.on('finish', common.mustNotCall('no finish event'));

  // error is swallowed by the custom _destroy
  _duplex3.on('error', common.mustNotCall('no error event'));

  _duplex3.destroy(_expected2);
  assert.strictEqual(_duplex3.destroyed, true);
}

{
  var _duplex4 = new Duplex({
    write: function (chunk, enc, cb) {
      cb();
    },
    read: function () {}
  });

  _duplex4._destroy = common.mustCall(function (err, cb) {
    assert.strictEqual(err, null);
    cb();
  });

  _duplex4.destroy();
  assert.strictEqual(_duplex4.destroyed, true);
}

{
  var _duplex5 = new Duplex({
    write: function (chunk, enc, cb) {
      cb();
    },
    read: function () {}
  });
  _duplex5.resume();

  _duplex5._destroy = common.mustCall(function (err, cb) {
    var _this = this;

    assert.strictEqual(err, null);
    process.nextTick(function () {
      _this.push(null);
      _this.end();
      cb();
    });
  });

  var fail = common.mustNotCall('no finish or end event');

  _duplex5.on('finish', fail);
  _duplex5.on('end', fail);

  _duplex5.destroy();

  _duplex5.removeListener('end', fail);
  _duplex5.removeListener('finish', fail);
  _duplex5.on('end', common.mustCall());
  _duplex5.on('finish', common.mustCall());
  assert.strictEqual(_duplex5.destroyed, true);
}

{
  var _duplex6 = new Duplex({
    write: function (chunk, enc, cb) {
      cb();
    },
    read: function () {}
  });

  var _expected3 = new Error('kaboom');

  _duplex6._destroy = common.mustCall(function (err, cb) {
    assert.strictEqual(err, null);
    cb(_expected3);
  });

  _duplex6.on('finish', common.mustNotCall('no finish event'));
  _duplex6.on('end', common.mustNotCall('no end event'));
  _duplex6.on('error', common.mustCall(function (err) {
    assert.strictEqual(err, _expected3);
  }));

  _duplex6.destroy();
  assert.strictEqual(_duplex6.destroyed, true);
}

{
  var _duplex7 = new Duplex({
    write: function (chunk, enc, cb) {
      cb();
    },
    read: function () {},

    allowHalfOpen: true
  });
  _duplex7.resume();

  _duplex7.on('finish', common.mustCall());
  _duplex7.on('end', common.mustCall());

  _duplex7.destroy();
  assert.strictEqual(_duplex7.destroyed, true);
}

{
  var _duplex8 = new Duplex({
    write: function (chunk, enc, cb) {
      cb();
    },
    read: function () {}
  });

  _duplex8.destroyed = true;
  assert.strictEqual(_duplex8.destroyed, true);

  // the internal destroy() mechanism should not be triggered
  _duplex8.on('finish', common.mustNotCall());
  _duplex8.on('end', common.mustNotCall());
  _duplex8.destroy();
}

{
  function MyDuplex() {
    assert.strictEqual(this.destroyed, false);
    this.destroyed = false;
    Duplex.call(this);
  }

  inherits(MyDuplex, Duplex);

  new MyDuplex();
}