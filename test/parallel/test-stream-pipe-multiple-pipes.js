/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/
var common = require('../common');
var stream = require('../../');
var assert = require('assert/');

var readable = new stream.Readable({
  read: function () {}
});

var writables = [];

var _loop = function (i) {
  var target = new stream.Writable({
    write: common.mustCall(function (chunk, encoding, callback) {
      target.output.push(chunk);
      callback();
    }, 1)
  });
  target.output = [];

  target.on('pipe', common.mustCall(function () {}));
  readable.pipe(target);

  writables.push(target);
};

for (var i = 0; i < 5; i++) {
  _loop(i);
}

var input = bufferShim.from([1, 2, 3, 4, 5]);

readable.push(input);

// The pipe() calls will postpone emission of the 'resume' event using nextTick,
// so no data will be available to the writable streams until then.
process.nextTick(common.mustCall(function () {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = writables[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _target = _step.value;

      assert.deepStrictEqual(_target.output, [input]);

      _target.on('unpipe', common.mustCall(function () {}));
      readable.unpipe(_target);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  readable.push('something else'); // This does not get through.
  readable.push(null);
  readable.resume(); // Make sure the 'end' event gets emitted.
}));

readable.on('end', common.mustCall(function () {
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = writables[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _target2 = _step2.value;

      assert.deepStrictEqual(_target2.output, [input]);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
}));