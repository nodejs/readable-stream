"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

var State = /*#__PURE__*/function () {
  function State() {
    _classCallCheck(this, State);

    this.snapshot = createJSHeapDump();
    this.embedderGraph = buildEmbedderGraph();
  } // Validate the v8 heap snapshot


  _createClass(State, [{
    key: "validateSnapshot",
    value: function validateSnapshot(rootName, expected) {
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

      var _iterator = _createForOfIteratorHelper(expected),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var expectation = _step.value;

          if (expectation.children) {
            var _iterator2 = _createForOfIteratorHelper(expectation.children),
                _step2;

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

              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                _loop();
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } // Validate our internal embedded graph representation

  }, {
    key: "validateGraph",
    value: function validateGraph(rootName, expected) {
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

      var _iterator3 = _createForOfIteratorHelper(expected),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var expectation = _step3.value;

          if (expectation.children) {
            var _iterator4 = _createForOfIteratorHelper(expectation.children),
                _step4;

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

              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                _loop2();
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "validateSnapshotNodes",
    value: function validateSnapshotNodes(rootName, expected) {
      var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref4$loose = _ref4.loose,
          loose = _ref4$loose === void 0 ? false : _ref4$loose;

      this.validateSnapshot(rootName, expected, {
        loose: loose
      });
      this.validateGraph(rootName, expected, {
        loose: loose
      });
    }
  }]);

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