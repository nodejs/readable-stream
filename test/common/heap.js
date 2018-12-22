"use strict";

/*<replacement>*/
require('@babel/polyfill');

var util = require('util');

for (var i in util) {
  exports[i] = util[i];
}
/*</replacement>*/

/* eslint-disable node-core/required-modules */


'use strict';
/*<replacement>*/


var objectKeys = objectKeys || function (obj) {
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  return keys;
};
/*</replacement>*/


var assert = require('assert');
/*<replacement>*/


var util = require('core-util-is');

util.inherits = require('inherits');
/*</replacement>*/

var internalTestHeap;

try {
  internalTestHeap = require('internal/test/heap');
} catch (e) {
  console.log('using `test/common/heap.js` requires `--expose-internals`');
  throw e;
}

var _internalTestHeap = internalTestHeap,
    createJSHeapDump = _internalTestHeap.createJSHeapDump,
    buildEmbedderGraph = _internalTestHeap.buildEmbedderGraph;

function inspectNode(snapshot) {
  return util.inspect(snapshot, {
    depth: 4
  });
}

function isEdge(edge, _ref) {
  var node_name = _ref.node_name,
      edge_name = _ref.edge_name;

  // For ABI compatibility, we did not backport the virtual function
  // AddEdge() with a name as last argument back to v10.x, so edge_name.
  // is ignored.
  // if (edge.name !== edge_name) {
  //   return false;
  // }
  // From our internal embedded graph
  if (edge.to.value) {
    if (edge.to.value.constructor.name !== node_name) {
      return false;
    }
  } else if (edge.to.name !== node_name) {
    return false;
  }

  return true;
}

var State =
/*#__PURE__*/
function () {
  function State() {
    this.snapshot = createJSHeapDump();
    this.embedderGraph = buildEmbedderGraph();
  } // Validate the v8 heap snapshot


  var _proto = State.prototype;

  _proto.validateSnapshot = function validateSnapshot(rootName, expected) {
    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref2$loose = _ref2.loose,
        loose = _ref2$loose === void 0 ? false : _ref2$loose;

    var rootNodes = this.snapshot.filter(function (node) {
      return node.name === rootName && node.type !== 'string';
    });

    if (loose) {
      assert(rootNodes.length >= expected.length, "Expect to find at least ".concat(expected.length, " '").concat(rootName, "', ") + "found ".concat(rootNodes.length));
    } else {
      assert.strictEqual(rootNodes.length, expected.length, "Expect to find ".concat(expected.length, " '").concat(rootName, "', ") + "found ".concat(rootNodes.length));
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = expected[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var expectation = _step.value;

        if (expectation.children) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            var _loop = function _loop() {
              var expectedEdge = _step2.value;
              var check = typeof expectedEdge === 'function' ? expectedEdge : function (edge) {
                return isEdge(edge, expectedEdge);
              };
              var hasChild = rootNodes.some(function (node) {
                return node.outgoingEdges.some(check);
              }); // Don't use assert with a custom message here. Otherwise the
              // inspection in the message is done eagerly and wastes a lot of CPU
              // time.

              if (!hasChild) {
                throw new Error('expected to find child ' + "".concat(util.inspect(expectedEdge), " in ").concat(inspectNode(rootNodes)));
              }
            };

            for (var _iterator2 = expectation.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              _loop();
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
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
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  } // Validate our internal embedded graph representation
  ;

  _proto.validateGraph = function validateGraph(rootName, expected) {
    var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref3$loose = _ref3.loose,
        loose = _ref3$loose === void 0 ? false : _ref3$loose;

    var rootNodes = this.embedderGraph.filter(function (node) {
      return node.name === rootName;
    });

    if (loose) {
      assert(rootNodes.length >= expected.length, "Expect to find at least ".concat(expected.length, " '").concat(rootName, "', ") + "found ".concat(rootNodes.length));
    } else {
      assert.strictEqual(rootNodes.length, expected.length, "Expect to find ".concat(expected.length, " '").concat(rootName, "', ") + "found ".concat(rootNodes.length));
    }

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = expected[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var expectation = _step3.value;

        if (expectation.children) {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            var _loop2 = function _loop2() {
              var expectedEdge = _step4.value;
              var check = typeof expectedEdge === 'function' ? expectedEdge : function (edge) {
                return isEdge(edge, expectedEdge);
              }; // Don't use assert with a custom message here. Otherwise the
              // inspection in the message is done eagerly and wastes a lot of CPU
              // time.

              var hasChild = rootNodes.some(function (node) {
                return node.edges.some(check);
              });

              if (!hasChild) {
                throw new Error('expected to find child ' + "".concat(util.inspect(expectedEdge), " in ").concat(inspectNode(rootNodes)));
              }
            };

            for (var _iterator4 = expectation.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              _loop2();
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
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
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  };

  _proto.validateSnapshotNodes = function validateSnapshotNodes(rootName, expected) {
    var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref4$loose = _ref4.loose,
        loose = _ref4$loose === void 0 ? false : _ref4$loose;

    this.validateSnapshot(rootName, expected, {
      loose: loose
    });
    this.validateGraph(rootName, expected, {
      loose: loose
    });
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