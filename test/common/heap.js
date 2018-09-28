'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*<replacement>*/
require('babel-polyfill');
var util = require('util');
for (var i in util) {
  exports[i] = util[i];
} /*</replacement>*/ /* eslint-disable node-core/required-modules */
'use strict';

/*<replacement>*/
var objectKeys = objectKeys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

var assert = require('assert');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var internalTestHeap = void 0;
try {
  internalTestHeap = require('internal/test/heap');
} catch (e) {
  console.log('using `test/common/heap.js` requires `--expose-internals`');
  throw e;
}
var _internalTestHeap = internalTestHeap,
    createJSHeapDump = _internalTestHeap.createJSHeapDump,
    buildEmbedderGraph = _internalTestHeap.buildEmbedderGraph;

var State = function () {
  function State() {
    _classCallCheck(this, State);

    this.snapshot = createJSHeapDump();
    this.embedderGraph = buildEmbedderGraph();
  }

  State.prototype.validateSnapshotNodes = function validateSnapshotNodes(name, expected) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$loose = _ref.loose,
        loose = _ref$loose === undefined ? false : _ref$loose;

    var snapshot = this.snapshot.filter(function (node) {
      return node.name === 'Node / ' + name && node.type !== 'string';
    });
    if (loose) assert(snapshot.length >= expected.length);else assert.strictEqual(snapshot.length, expected.length);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = expected[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var expectedNode = _step.value;

        if (expectedNode.children) {
          var _loop = function (expectedChild) {
            var check = typeof expectedChild === 'function' ? expectedChild : function (node) {
              return [expectedChild.name, 'Node / ' + expectedChild.name].includes(node.name);
            };

            var hasChild = snapshot.some(function (node) {
              return node.outgoingEdges.map(function (edge) {
                return edge.toNode;
              }).some(check);
            });
            // Don't use assert with a custom message here. Otherwise the
            // inspection in the message is done eagerly and wastes a lot of CPU
            // time.
            if (!hasChild) {
              throw new Error('expected to find child ' + (util.inspect(expectedChild) + ' in ' + util.inspect(snapshot)));
            }
          };

          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = expectedNode.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var expectedChild = _step3.value;

              _loop(expectedChild);
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
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

    var graph = this.embedderGraph.filter(function (node) {
      return node.name === name;
    });
    if (loose) assert(graph.length >= expected.length);else assert.strictEqual(graph.length, expected.length);
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = expected[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _expectedNode = _step2.value;

        if (_expectedNode.edges) {
          var _loop2 = function (_expectedChild) {
            var check = typeof _expectedChild === 'function' ? _expectedChild : function (node) {
              return node.name === _expectedChild.name || node.value && node.value.constructor && node.value.constructor.name === _expectedChild.name;
            };

            // Don't use assert with a custom message here. Otherwise the
            // inspection in the message is done eagerly and wastes a lot of CPU
            // time.
            var hasChild = graph.some(function (node) {
              return node.edges.some(check);
            });
            if (!hasChild) {
              throw new Error('expected to find child ' + (util.inspect(_expectedChild) + ' in ' + util.inspect(snapshot)));
            }
          };

          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = _expectedNode.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var _expectedChild = _step4.value;

              _loop2(_expectedChild);
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }
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
  };

  return State;
}();

function recordState() {
  return new State();
}

function validateSnapshotNodes() {
  var _recordState;

  return (_recordState = recordState()).validateSnapshotNodes.apply(_recordState, arguments);
}

module.exports = {
  recordState: recordState,
  validateSnapshotNodes: validateSnapshotNodes
};

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}