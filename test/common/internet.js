"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
// Utilities for internet-related tests


var addresses = {
  // A generic host that has registered common DNS records,
  // supports both IPv4 and IPv6, and provides basic HTTP/HTTPS services
  INET_HOST: 'nodejs.org',
  // A host that provides IPv4 services
  INET4_HOST: 'nodejs.org',
  // A host that provides IPv6 services
  INET6_HOST: 'nodejs.org',
  // An accessible IPv4 IP,
  // defaults to the Google Public DNS IPv4 address
  INET4_IP: '8.8.8.8',
  // An accessible IPv6 IP,
  // defaults to the Google Public DNS IPv6 address
  INET6_IP: '2001:4860:4860::8888',
  // An invalid host that cannot be resolved
  // See https://tools.ietf.org/html/rfc2606#section-2
  INVALID_HOST: 'something.invalid',
  // A host with MX records registered
  MX_HOST: 'nodejs.org',
  // A host with SRV records registered
  SRV_HOST: '_jabber._tcp.google.com',
  // A host with PTR records registered
  PTR_HOST: '8.8.8.8.in-addr.arpa',
  // A host with NAPTR records registered
  NAPTR_HOST: 'sip2sip.info',
  // A host with SOA records registered
  SOA_HOST: 'nodejs.org',
  // A host with CNAME records registered
  CNAME_HOST: 'blog.nodejs.org',
  // A host with NS records registered
  NS_HOST: 'nodejs.org',
  // A host with TXT records registered
  TXT_HOST: 'nodejs.org',
  // An accessible IPv4 DNS server
  DNS4_SERVER: '8.8.8.8',
  // An accessible IPv4 DNS server
  DNS6_SERVER: '2001:4860:4860::8888'
};

var _iterator = _createForOfIteratorHelper(objectKeys(addresses)),
    _step;

try {
  for (_iterator.s(); !(_step = _iterator.n()).done;) {
    var key = _step.value;
    var envName = "NODE_TEST_".concat(key);

    if (process.env[envName]) {
      addresses[key] = process.env[envName];
    }
  }
} catch (err) {
  _iterator.e(err);
} finally {
  _iterator.f();
}

module.exports = {
  addresses: addresses
};

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}