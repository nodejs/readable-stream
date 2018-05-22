/*<replacement>*/
require('babel-polyfill');
var util = require('util');
for (var i in util) {
  exports[i] = util[i];
} /*</replacement>*/ /*<replacement>*/
if (!global.setImmediate) {
  global.setImmediate = function setImmediate(fn) {
    return setTimeout(fn.bind.apply(fn, arguments), 4);
  };
}
if (!global.clearImmediate) {
  global.clearImmediate = function clearImmediate(i) {
    return clearTimeout(i);
  };
}
/*</replacement>*/
/* eslint-disable node-core/required-modules */
'use strict';

/*<replacement>*/
var objectKeys = objectKeys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
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

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = objectKeys(addresses)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var key = _step.value;

    var envName = 'NODE_TEST_' + key;
    if (process.env[envName]) {
      addresses[key] = process.env[envName];
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

module.exports = {
  addresses: addresses
};

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}