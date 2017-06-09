/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

var common = require('../common');

var _require = require('../../'),
    Transform = _require.Transform;

var assert = require('assert/');

{
  var transform = new Transform({
    transform: function (chunk, enc, cb) {}
  });

  transform.resume();

  transform.on('end', common.mustCall());
  transform.on('close', common.mustCall());
  transform.on('finish', common.mustCall());

  transform.destroy();
}

{
  var _transform = new Transform({
    transform: function (chunk, enc, cb) {}
  });
  _transform.resume();

  var expected = new Error('kaboom');

  _transform.on('end', common.mustCall());
  _transform.on('finish', common.mustCall());
  _transform.on('close', common.mustCall());
  _transform.on('error', common.mustCall(function (err) {
    assert.strictEqual(err, expected);
  }));

  _transform.destroy(expected);
}

{
  var _transform2 = new Transform({
    transform: function (chunk, enc, cb) {}
  });

  _transform2._destroy = common.mustCall(function (err, cb) {
    assert.strictEqual(err, _expected);
    cb(err);
  }, 1);

  var _expected = new Error('kaboom');

  _transform2.on('finish', common.mustNotCall('no finish event'));
  _transform2.on('close', common.mustNotCall('no close event'));
  _transform2.on('error', common.mustCall(function (err) {
    assert.strictEqual(err, _expected);
  }));

  _transform2.destroy(_expected);
}

{
  var _expected2 = new Error('kaboom');
  var _transform3 = new Transform({
    transform: function (chunk, enc, cb) {},

    destroy: common.mustCall(function (err, cb) {
      assert.strictEqual(err, _expected2);
      cb();
    }, 1)
  });
  _transform3.resume();

  _transform3.on('end', common.mustNotCall('no end event'));
  _transform3.on('close', common.mustNotCall('no close event'));
  _transform3.on('finish', common.mustNotCall('no finish event'));

  // error is swallowed by the custom _destroy
  _transform3.on('error', common.mustNotCall('no error event'));

  _transform3.destroy(_expected2);
}

{
  var _transform4 = new Transform({
    transform: function (chunk, enc, cb) {}
  });

  _transform4._destroy = common.mustCall(function (err, cb) {
    assert.strictEqual(err, null);
    cb();
  }, 1);

  _transform4.destroy();
}

{
  var _transform5 = new Transform({
    transform: function (chunk, enc, cb) {}
  });
  _transform5.resume();

  _transform5._destroy = common.mustCall(function (err, cb) {
    var _this = this;

    assert.strictEqual(err, null);
    process.nextTick(function () {
      _this.push(null);
      _this.end();
      cb();
    });
  }, 1);

  var fail = common.mustNotCall('no event');

  _transform5.on('finish', fail);
  _transform5.on('end', fail);
  _transform5.on('close', fail);

  _transform5.destroy();

  _transform5.removeListener('end', fail);
  _transform5.removeListener('finish', fail);
  _transform5.on('end', common.mustCall());
  _transform5.on('finish', common.mustCall());
}

{
  var _transform6 = new Transform({
    transform: function (chunk, enc, cb) {}
  });

  var _expected3 = new Error('kaboom');

  _transform6._destroy = common.mustCall(function (err, cb) {
    assert.strictEqual(err, null);
    cb(_expected3);
  }, 1);

  _transform6.on('close', common.mustNotCall('no close event'));
  _transform6.on('finish', common.mustNotCall('no finish event'));
  _transform6.on('end', common.mustNotCall('no end event'));
  _transform6.on('error', common.mustCall(function (err) {
    assert.strictEqual(err, _expected3);
  }));

  _transform6.destroy();
}