"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

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


var _require = require('../../'),
    Duplex = _require.Duplex;

var assert = require('assert');

var kCallback = Symbol('Callback');
var kOtherSide = Symbol('Other');

var DuplexSocket = /*#__PURE__*/function (_Duplex) {
  _inherits(DuplexSocket, _Duplex);

  var _super = _createSuper(DuplexSocket);

  function DuplexSocket() {
    var _this;

    _classCallCheck(this, DuplexSocket);

    _this = _super.call(this);
    _this[kCallback] = null;
    _this[kOtherSide] = null;
    return _this;
  }

  _createClass(DuplexSocket, [{
    key: "_read",
    value: function _read() {
      var callback = this[kCallback];

      if (callback) {
        this[kCallback] = null;
        callback();
      }
    }
  }, {
    key: "_write",
    value: function _write(chunk, encoding, callback) {
      assert.notStrictEqual(this[kOtherSide], null);
      assert.strictEqual(this[kOtherSide][kCallback], null);
      this[kOtherSide][kCallback] = callback;
      this[kOtherSide].push(chunk);
    }
  }, {
    key: "_final",
    value: function _final(callback) {
      this[kOtherSide].on('end', callback);
      this[kOtherSide].push(null);
    }
  }]);

  return DuplexSocket;
}(Duplex);

function makeDuplexPair() {
  var clientSide = new DuplexSocket();
  var serverSide = new DuplexSocket();
  clientSide[kOtherSide] = serverSide;
  serverSide[kOtherSide] = clientSide;
  return {
    clientSide: clientSide,
    serverSide: serverSide
  };
}

module.exports = makeDuplexPair;

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}