'use strict'

var pack = require('../package.json');
var assert = require('assert');

function verifyNoCaret(deps) {
  var keys = Object.keys(deps);
  for (var i = 0; i < keys.length; i++) {
    assert(deps[keys[i]][0] !== '^', keys[i] + ' must not be depended on using ^')
  }
}

verifyNoCaret(pack.dependencies)
