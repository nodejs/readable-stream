"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/*<replacement>*/
require('@babel/polyfill');

var util = require('util');

for (var i in util) {
  exports[i] = util[i];
}
/*</replacement>*/
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

/* eslint-disable node-core/required-modules, node-core/crypto-check */


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


var process = global.process; // Some tests tamper with the process global.

var path = require('path');

var fs = require('fs');

var assert = require('assert');

var os = require('os');

var _require = require('child_process'),
    exec = _require.exec,
    execSync = _require.execSync,
    spawnSync = _require.spawnSync;
/*<replacement>*/


var util = require('core-util-is');

util.inherits = require('inherits');
/*</replacement>*/

var Timer = {
  now: function now() {}
};

var tmpdir = require('./tmpdir');

var _process$binding = process.binding('config'),
    bits = _process$binding.bits,
    hasIntl = _process$binding.hasIntl;

var noop = function noop() {};

var hasCrypto = true;

var isMainThread = function () {
  if (false) {
    return require('worker_threads').isMainThread;
  } // Worker module not enabled → only a single main thread exists.


  return true;
}(); // Check for flags. Skip this for workers (both, the `cluster` module and
// `worker_threads`) and child processes.


if (false && isMainThread && module.parent && require('cluster').isMaster) {
  // The copyright notice is relatively big and the flags could come afterwards.
  var bytesToRead = 1500;
  var buffer = Buffer.allocUnsafe(bytesToRead);
  var fd = fs.openSync(module.parent.filename, 'r');
  var bytesRead = fs.readSync(fd, buffer, 0, bytesToRead);
  fs.closeSync(fd);
  var source = buffer.toString('utf8', 0, bytesRead);
  var flagStart = source.indexOf('// Flags: --') + 10;

  if (flagStart !== 9) {
    var flagEnd = source.indexOf('\n', flagStart); // Normalize different EOL.

    if (source[flagEnd - 1] === '\r') {
      flagEnd--;
    }

    var flags = source.substring(flagStart, flagEnd).replace(/_/g, '-').split(' ');
    var args = process.execArgv.map(function (arg) {
      return arg.replace(/_/g, '-');
    });

    var _iterator = _createForOfIteratorHelper(flags),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var flag = _step.value;

        if (!args.includes(flag) && // If the binary was built without-ssl then the crypto flags are
        // invalid (bad option). The test itself should handle this case.
        hasCrypto && ( // If the binary is build without `intl` the inspect option is
        // invalid. The test itself should handle this case.
        process.config.variables.v8_enable_inspector !== 0 || !flag.startsWith('--inspect'))) {
          throw new Error("Test has to be started with the flag: '".concat(flag, "'"));
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
}

var isWindows = process.platform === 'win32';
var isAIX = process.platform === 'aix';
var isLinuxPPCBE = process.platform === 'linux' && process.arch === 'ppc64' && os.endianness() === 'BE';
var isSunOS = process.platform === 'sunos';
var isFreeBSD = process.platform === 'freebsd';
var isOpenBSD = process.platform === 'openbsd';
var isLinux = process.platform === 'linux';
var isOSX = process.platform === 'darwin';
var enoughTestMem = os.totalmem() > 0x70000000;
/* 1.75 Gb */

var cpus = os.cpus().length === 0 ? [{
  speed: 1000
}] : os.cpus();
var enoughTestCpu = Array.isArray(cpus) && (cpus.length > 1 || cpus[0].speed > 999);
var rootDir = isWindows ? 'c:\\' : '/';
var buildType = 'readable-stream'; // If env var is set then enable async_hook hooks for all tests.

if (process.env.NODE_TEST_WITH_ASYNC_HOOKS) {
  var destroydIdsList = {};
  var destroyListList = {};
  var initHandles = {};
  var async_wrap = process.binding('async_wrap');
  process.on('exit', function () {
    // iterate through handles to make sure nothing crashes
    for (var k in initHandles) {
      util.inspect(initHandles[k]);
    }
  });
  var _queueDestroyAsyncId = async_wrap.queueDestroyAsyncId;

  async_wrap.queueDestroyAsyncId = function queueDestroyAsyncId(id) {
    if (destroyListList[id] !== undefined) {
      process._rawDebug(destroyListList[id]);

      process._rawDebug();

      throw new Error("same id added to destroy list twice (".concat(id, ")"));
    }

    destroyListList[id] = new Error().stack;

    _queueDestroyAsyncId(id);
  };
  /*require('async_hooks').createHook({
    init(id, ty, tr, r) {
      if (initHandles[id]) {
        process._rawDebug(
          `Is same resource: ${r === initHandles[id].resource}`);
        process._rawDebug(`Previous stack:\n${initHandles[id].stack}\n`);
        throw new Error(`init called twice for same id (${id})`);
      }
      initHandles[id] = { resource: r, stack: new Error().stack.substr(6) };
    },
    before() { },
    after() { },
    destroy(id) {
      if (destroydIdsList[id] !== undefined) {
        process._rawDebug(destroydIdsList[id]);
        process._rawDebug();
        throw new Error(`destroy called for same id (${id})`);
      }
      destroydIdsList[id] = new Error().stack;
    },
  }).enable();*/

}

var opensslCli = null;
var inFreeBSDJail = null;
var localhostIPv4 = null;
var localIPv6Hosts = isLinux ? [// Debian/Ubuntu
'ip6-localhost', 'ip6-loopback', // SUSE
'ipv6-localhost', 'ipv6-loopback', // Typically universal
'localhost'] : ['localhost'];

var PIPE = function () {
  var localRelative = path.relative(process.cwd(), "".concat(tmpdir.path, "/"));
  var pipePrefix = isWindows ? '\\\\.\\pipe\\' : localRelative;
  var pipeName = "node-test.".concat(process.pid, ".sock");
  return path.join(pipePrefix, pipeName);
}();

var hasIPv6 = function () {
  var iFaces = os.networkInterfaces();
  var re = isWindows ? /Loopback Pseudo-Interface/ : /lo/;
  return objectKeys(iFaces).some(function (name) {
    return re.test(name) && iFaces[name].some(function (_ref) {
      var family = _ref.family;
      return family === 'IPv6';
    });
  });
}();
/*
 * Check that when running a test with
 * `$node --abort-on-uncaught-exception $file child`
 * the process aborts.
 */


function childShouldThrowAndAbort() {
  var testCmd = '';

  if (!isWindows) {
    // Do not create core files, as it can take a lot of disk space on
    // continuous testing and developers' machines
    testCmd += 'ulimit -c 0 && ';
  }

  testCmd += "\"".concat(process.argv[0], "\" --abort-on-uncaught-exception ");
  testCmd += "\"".concat(process.argv[1], "\" child");
  var child = exec(testCmd);
  child.on('exit', function onExit(exitCode, signal) {
    var errMsg = 'Test should have aborted ' + "but instead exited with exit code ".concat(exitCode) + " and signal ".concat(signal);
    assert(nodeProcessAborted(exitCode, signal), errMsg);
  });
}

function createZeroFilledFile(filename) {
  var fd = fs.openSync(filename, 'w');
  fs.ftruncateSync(fd, 10 * 1024 * 1024);
  fs.closeSync(fd);
}

var pwdCommand = isWindows ? ['cmd.exe', ['/d', '/c', 'cd']] : ['pwd', []];

function platformTimeout(ms) {
  if (process.features.debug) ms = 2 * ms;
  if (global.__coverage__) ms = 4 * ms;
  if (isAIX) return 2 * ms; // default localhost speed is slower on AIX

  if (process.arch !== 'arm') return ms;
  var armv = process.config.variables.arm_version;
  if (armv === '6') return 7 * ms; // ARMv6

  if (armv === '7') return 2 * ms; // ARMv7

  return ms; // ARMv8+
}

var knownGlobals = [Buffer, clearImmediate, clearInterval, clearTimeout, global, process, setImmediate, setInterval, setTimeout];

if (global.gc) {
  knownGlobals.push(global.gc);
}

if (global.DTRACE_HTTP_SERVER_RESPONSE) {
  knownGlobals.push(DTRACE_HTTP_SERVER_RESPONSE);
  knownGlobals.push(DTRACE_HTTP_SERVER_REQUEST);
  knownGlobals.push(DTRACE_HTTP_CLIENT_RESPONSE);
  knownGlobals.push(DTRACE_HTTP_CLIENT_REQUEST);
  knownGlobals.push(DTRACE_NET_STREAM_END);
  knownGlobals.push(DTRACE_NET_SERVER_CONNECTION);
}

if (global.COUNTER_NET_SERVER_CONNECTION) {
  knownGlobals.push(COUNTER_NET_SERVER_CONNECTION);
  knownGlobals.push(COUNTER_NET_SERVER_CONNECTION_CLOSE);
  knownGlobals.push(COUNTER_HTTP_SERVER_REQUEST);
  knownGlobals.push(COUNTER_HTTP_SERVER_RESPONSE);
  knownGlobals.push(COUNTER_HTTP_CLIENT_REQUEST);
  knownGlobals.push(COUNTER_HTTP_CLIENT_RESPONSE);
}

if (process.env.NODE_TEST_KNOWN_GLOBALS) {
  var knownFromEnv = process.env.NODE_TEST_KNOWN_GLOBALS.split(',');
  allowGlobals.apply(void 0, _toConsumableArray(knownFromEnv));
}

function allowGlobals() {
  for (var _len = arguments.length, whitelist = new Array(_len), _key = 0; _key < _len; _key++) {
    whitelist[_key] = arguments[_key];
  }

  knownGlobals = knownGlobals.concat(whitelist);
}
/*<replacement>*/


if (typeof constructor == 'function') knownGlobals.push(constructor);
if (typeof DTRACE_NET_SOCKET_READ == 'function') knownGlobals.push(DTRACE_NET_SOCKET_READ);
if (typeof DTRACE_NET_SOCKET_WRITE == 'function') knownGlobals.push(DTRACE_NET_SOCKET_WRITE);
if (global.__coverage__) knownGlobals.push(__coverage__);
'console,clearImmediate,setImmediate,core,__core-js_shared__,Promise,Map,Set,WeakMap,WeakSet,Reflect,System,queueMicrotask,asap,Observable,regeneratorRuntime,_babelPolyfill'.split(',').filter(function (item) {
  return typeof global[item] !== undefined;
}).forEach(function (item) {
  knownGlobals.push(global[item]);
});
/*</replacement>*/

function leakedGlobals() {
  var leaked = [];

  for (var val in global) {
    if (!knownGlobals.includes(global[val])) {
      leaked.push(val);
    }
  }

  if (global.__coverage__) {
    return leaked.filter(function (varname) {
      return !/^(?:cov_|__cov)/.test(varname);
    });
  } else {
    return leaked;
  }
}

process.on('exit', function () {
  var leaked = leakedGlobals();

  if (leaked.length > 0) {
    assert.fail("Unexpected global(s) found: ".concat(leaked.join(', ')));
  }
});
var mustCallChecks = [];

function runCallChecks(exitCode) {
  if (exitCode !== 0) return;
  var failed = mustCallChecks.filter(function (context) {
    if ('minimum' in context) {
      context.messageSegment = "at least ".concat(context.minimum);
      return context.actual < context.minimum;
    } else {
      context.messageSegment = "exactly ".concat(context.exact);
      return context.actual !== context.exact;
    }
  });
  forEach(failed, function (context) {
    console.log('Mismatched %s function calls. Expected %s, actual %d.', context.name, context.messageSegment, context.actual);
    console.log(context.stack.split('\n').slice(2).join('\n'));
  });
  if (failed.length) process.exit(1);
}

function mustCall(fn, exact) {
  return _mustCallInner(fn, exact, 'exact');
}

function mustCallAtLeast(fn, minimum) {
  return _mustCallInner(fn, minimum, 'minimum');
}

function _mustCallInner(fn) {
  var _context;

  var criteria = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var field = arguments.length > 2 ? arguments[2] : undefined;
  if (process._exiting) throw new Error('Cannot use common.mustCall*() in process exit handler');

  if (typeof fn === 'number') {
    criteria = fn;
    fn = noop;
  } else if (fn === undefined) {
    fn = noop;
  }

  if (typeof criteria !== 'number') throw new TypeError("Invalid ".concat(field, " value: ").concat(criteria));
  var context = (_context = {}, _defineProperty(_context, field, criteria), _defineProperty(_context, "actual", 0), _defineProperty(_context, "stack", new Error().stack), _defineProperty(_context, "name", fn.name || '<anonymous>'), _context); // add the exit listener only once to avoid listener leak warnings

  if (mustCallChecks.length === 0) process.on('exit', runCallChecks);
  mustCallChecks.push(context);
  return function () {
    context.actual++;
    return fn.apply(this, arguments);
  };
}

function hasMultiLocalhost() {
  var _process$binding2 = process.binding('tcp_wrap'),
      TCP = _process$binding2.TCP,
      TCPConstants = _process$binding2.constants;

  var t = new TCP(TCPConstants.SOCKET);
  var ret = t.bind('127.0.0.2', 0);
  t.close();
  return ret === 0;
}

function skipIfEslintMissing() {
  if (!fs.existsSync(path.join(__dirname, '..', '..', 'tools', 'node_modules', 'eslint'))) {
    skip('missing ESLint');
  }
}

function canCreateSymLink() {
  // On Windows, creating symlinks requires admin privileges.
  // We'll only try to run symlink test if we have enough privileges.
  // On other platforms, creating symlinks shouldn't need admin privileges
  if (isWindows) {
    // whoami.exe needs to be the one from System32
    // If unix tools are in the path, they can shadow the one we want,
    // so use the full path while executing whoami
    var whoamiPath = path.join(process.env.SystemRoot, 'System32', 'whoami.exe');

    try {
      var output = execSync("".concat(whoamiPath, " /priv"), {
        timout: 1000
      });
      return output.includes('SeCreateSymbolicLinkPrivilege');
    } catch (_e) {
      return false;
    }
  } // On non-Windows platforms, this always returns `true`


  return true;
}

function getCallSite(top) {
  var originalStackFormatter = Error.prepareStackTrace;

  Error.prepareStackTrace = function (err, stack) {
    return "".concat(stack[0].getFileName(), ":").concat(stack[0].getLineNumber());
  };

  var err = new Error();
  Error.captureStackTrace(err, top); // with the V8 Error API, the stack is not formatted until it is accessed

  err.stack;
  Error.prepareStackTrace = originalStackFormatter;
  return err.stack;
}

function mustNotCall(msg) {
  var callSite = getCallSite(mustNotCall);
  return function mustNotCall() {
    assert.fail("".concat(msg || 'function should not have been called', " at ").concat(callSite));
  };
}

function printSkipMessage(msg) {
  console.log("1..0 # Skipped: ".concat(msg));
}

function skip(msg) {
  printSkipMessage(msg);
  process.exit(0);
} // Returns true if the exit code "exitCode" and/or signal name "signal"
// represent the exit code and/or signal name of a node process that aborted,
// false otherwise.


function nodeProcessAborted(exitCode, signal) {
  // Depending on the compiler used, node will exit with either
  // exit code 132 (SIGILL), 133 (SIGTRAP) or 134 (SIGABRT).
  var expectedExitCodes = [132, 133, 134]; // On platforms using KSH as the default shell (like SmartOS),
  // when a process aborts, KSH exits with an exit code that is
  // greater than 256, and thus the exit code emitted with the 'exit'
  // event is null and the signal is set to either SIGILL, SIGTRAP,
  // or SIGABRT (depending on the compiler).

  var expectedSignals = ['SIGILL', 'SIGTRAP', 'SIGABRT']; // On Windows, 'aborts' are of 2 types, depending on the context:
  // (i) Forced access violation, if --abort-on-uncaught-exception is on
  // which corresponds to exit code 3221225477 (0xC0000005)
  // (ii) Otherwise, _exit(134) which is called in place of abort() due to
  // raising SIGABRT exiting with ambiguous exit code '3' by default

  if (isWindows) expectedExitCodes = [0xC0000005, 134]; // When using --abort-on-uncaught-exception, V8 will use
  // base::OS::Abort to terminate the process.
  // Depending on the compiler used, the shell or other aspects of
  // the platform used to build the node binary, this will actually
  // make V8 exit by aborting or by raising a signal. In any case,
  // one of them (exit code or signal) needs to be set to one of
  // the expected exit codes or signals.

  if (signal !== null) {
    return expectedSignals.includes(signal);
  } else {
    return expectedExitCodes.includes(exitCode);
  }
}

function busyLoop(time) {
  var startTime = Timer.now();
  var stopTime = startTime + time;

  while (Timer.now() < stopTime) {}
}

function isAlive(pid) {
  try {
    process.kill(pid, 'SIGCONT');
    return true;
  } catch (_unused) {
    return false;
  }
}

function _expectWarning(name, expected) {
  var map = new Map(expected);
  return mustCall(function (warning) {
    assert.strictEqual(warning.name, name);
    assert.ok(map.has(warning.message), "unexpected error message: \"".concat(warning.message, "\""));
    var code = map.get(warning.message);
    assert.strictEqual(warning.code, code); // Remove a warning message after it is seen so that we guarantee that we
    // get each message only once.

    map.delete(expected);
  }, expected.length);
}

function expectWarningByName(name, expected, code) {
  if (typeof expected === 'string') {
    expected = [[expected, code]];
  }

  process.on('warning', _expectWarning(name, expected));
}

function expectWarningByMap(warningMap) {
  var catchWarning = {};
  forEach(objectKeys(warningMap), function (name) {
    var expected = warningMap[name];

    if (!Array.isArray(expected)) {
      throw new Error('warningMap entries must be arrays consisting of two ' + 'entries: [message, warningCode]');
    }

    if (!Array.isArray(expected[0])) {
      if (expected.length === 0) {
        return;
      }

      expected = [[expected[0], expected[1]]];
    }

    catchWarning[name] = _expectWarning(name, expected);
  });
  process.on('warning', function (warning) {
    return catchWarning[warning.name](warning);
  });
} // accepts a warning name and description or array of descriptions or a map
// of warning names to description(s)
// ensures a warning is generated for each name/description pair


function expectWarning(nameOrMap, expected, code) {
  if (typeof nameOrMap === 'string') {
    expectWarningByName(nameOrMap, expected, code);
  } else {
    expectWarningByMap(nameOrMap);
  }
}

var Comparison = function Comparison(obj, keys) {
  _classCallCheck(this, Comparison);

  var _iterator2 = _createForOfIteratorHelper(keys),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var key = _step2.value;
      if (key in obj) this[key] = obj[key];
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}; // Useful for testing expected internal/error objects


function expectsError(fn, settings, exact) {
  if (typeof fn !== 'function') {
    exact = settings;
    settings = fn;
    fn = undefined;
  }

  function innerFn(error) {
    if (arguments.length !== 1) {
      // Do not use `assert.strictEqual()` to prevent `util.inspect` from
      // always being called.
      assert.fail("Expected one argument, got ".concat(util.inspect(arguments)));
    }

    var descriptor = Object.getOwnPropertyDescriptor(error, 'message'); // The error message should be non-enumerable

    assert.strictEqual(descriptor.enumerable, false);
    var innerSettings = settings;

    if ('type' in settings) {
      var type = settings.type;

      if (type !== Error && !Error.isPrototypeOf(type)) {
        throw new TypeError('`settings.type` must inherit from `Error`');
      }

      var _constructor = error.constructor;

      if (_constructor.name === 'NodeError' && type.name !== 'NodeError') {
        _constructor = Object.getPrototypeOf(error.constructor);
      } // Add the `type` to the error to properly compare and visualize it.


      if (!('type' in error)) error.type = _constructor;
    }

    if ('message' in settings && typeof settings.message === 'object' && settings.message.test(error.message)) {
      // Make a copy so we are able to modify the settings.
      innerSettings = Object.create(settings, Object.getOwnPropertyDescriptors(settings)); // Visualize the message as identical in case of other errors.

      innerSettings.message = error.message;
    } // Check all error properties.


    var keys = objectKeys(settings);

    var _iterator3 = _createForOfIteratorHelper(keys),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var key = _step3.value;

        if (!require('deep-strict-equal')(error[key], innerSettings[key])) {
          // Create placeholder objects to create a nice output.
          var a = new Comparison(error, keys);
          var b = new Comparison(innerSettings, keys);
          var tmpLimit = Error.stackTraceLimit;
          Error.stackTraceLimit = 0;

          var _err = new assert.AssertionError({
            actual: a,
            expected: b,
            operator: 'strictEqual',
            stackStartFn: assert.throws
          });

          Error.stackTraceLimit = tmpLimit;
          throw new assert.AssertionError({
            actual: error,
            expected: settings,
            operator: 'common.expectsError',
            message: _err.message
          });
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    return true;
  }

  if (fn) {
    assert.throws(fn, innerFn);
    return;
  }

  return mustCall(innerFn, exact);
}

function skipIfInspectorDisabled() {
  if (process.config.variables.v8_enable_inspector === 0) {
    skip('V8 inspector is disabled');
  }
}

function skipIf32Bits() {
  if (bits < 64) {
    skip('The tested feature is not available in 32bit builds');
  }
}

function skipIfWorker() {
  if (!isMainThread) {
    skip('This test only works on a main thread');
  }
}

function getArrayBufferViews(buf) {
  var buffer = buf.buffer,
      byteOffset = buf.byteOffset,
      byteLength = buf.byteLength;
  var out = [];
  var arrayBufferViews = [Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, DataView];

  for (var _i = 0, _arrayBufferViews = arrayBufferViews; _i < _arrayBufferViews.length; _i++) {
    var type = _arrayBufferViews[_i];
    var _type$BYTES_PER_ELEME = type.BYTES_PER_ELEMENT,
        BYTES_PER_ELEMENT = _type$BYTES_PER_ELEME === void 0 ? 1 : _type$BYTES_PER_ELEME;

    if (byteLength % BYTES_PER_ELEMENT === 0) {
      out.push(new type(buffer, byteOffset, byteLength / BYTES_PER_ELEMENT));
    }
  }

  return out;
}

function getBufferSources(buf) {
  return [].concat(_toConsumableArray(getArrayBufferViews(buf)), [new Uint8Array(buf).buffer]);
} // Crash the process on unhandled rejections.


var crashOnUnhandledRejection = function crashOnUnhandledRejection(err) {
  throw err;
};

process.on('unhandledRejection', crashOnUnhandledRejection);

function disableCrashOnUnhandledRejection() {
  process.removeListener('unhandledRejection', crashOnUnhandledRejection);
}

function getTTYfd() {
  // Do our best to grab a tty fd.
  var tty = require('tty'); // Don't attempt fd 0 as it is not writable on Windows.
  // Ref: ef2861961c3d9e9ed6972e1e84d969683b25cf95


  var ttyFd = [1, 2, 4, 5].find(tty.isatty);

  if (ttyFd === undefined) {
    try {
      return fs.openSync('/dev/tty');
    } catch (_unused2) {
      // There aren't any tty fd's available to use.
      return -1;
    }
  }

  return ttyFd;
}

function runWithInvalidFD(func) {
  var fd = 1 << 30; // Get first known bad file descriptor. 1 << 30 is usually unlikely to
  // be an valid one.

  try {
    while (fs.fstatSync(fd--) && fd > 0) {
      ;
    }
  } catch (_unused3) {
    return func(fd);
  }

  printSkipMessage('Could not generate an invalid fd');
}

module.exports = {
  allowGlobals: allowGlobals,
  buildType: buildType,
  busyLoop: busyLoop,
  canCreateSymLink: canCreateSymLink,
  childShouldThrowAndAbort: childShouldThrowAndAbort,
  createZeroFilledFile: createZeroFilledFile,
  disableCrashOnUnhandledRejection: disableCrashOnUnhandledRejection,
  enoughTestCpu: enoughTestCpu,
  enoughTestMem: enoughTestMem,
  expectsError: expectsError,
  expectWarning: expectWarning,
  getArrayBufferViews: getArrayBufferViews,
  getBufferSources: getBufferSources,
  getCallSite: getCallSite,
  getTTYfd: getTTYfd,
  hasIntl: hasIntl,
  hasCrypto: hasCrypto,
  hasIPv6: hasIPv6,
  hasMultiLocalhost: hasMultiLocalhost,
  isAIX: isAIX,
  isAlive: isAlive,
  isFreeBSD: isFreeBSD,
  isLinux: isLinux,
  isLinuxPPCBE: isLinuxPPCBE,
  isMainThread: isMainThread,
  isOpenBSD: isOpenBSD,
  isOSX: isOSX,
  isSunOS: isSunOS,
  isWindows: isWindows,
  localIPv6Hosts: localIPv6Hosts,
  mustCall: mustCall,
  mustCallAtLeast: mustCallAtLeast,
  mustNotCall: mustNotCall,
  nodeProcessAborted: nodeProcessAborted,
  noWarnCode: undefined,
  PIPE: PIPE,
  platformTimeout: platformTimeout,
  printSkipMessage: printSkipMessage,
  pwdCommand: pwdCommand,
  rootDir: rootDir,
  runWithInvalidFD: runWithInvalidFD,
  skip: skip,
  skipIf32Bits: skipIf32Bits,
  skipIfEslintMissing: skipIfEslintMissing,
  skipIfInspectorDisabled: skipIfInspectorDisabled,
  skipIfWorker: skipIfWorker,

  get localhostIPv6() {
    return '::1';
  },

  get hasFipsCrypto() {
    return hasCrypto && require('crypto').fips;
  },

  get inFreeBSDJail() {
    if (inFreeBSDJail !== null) return inFreeBSDJail;

    if (exports.isFreeBSD && execSync('sysctl -n security.jail.jailed').toString() === '1\n') {
      inFreeBSDJail = true;
    } else {
      inFreeBSDJail = false;
    }

    return inFreeBSDJail;
  },

  get localhostIPv4() {
    if (localhostIPv4 !== null) return localhostIPv4;

    if (this.inFreeBSDJail) {
      // Jailed network interfaces are a bit special - since we need to jump
      // through loops, as well as this being an exception case, assume the
      // user will provide this instead.
      if (process.env.LOCALHOST) {
        localhostIPv4 = process.env.LOCALHOST;
      } else {
        console.error('Looks like we\'re in a FreeBSD Jail. ' + 'Please provide your default interface address ' + 'as LOCALHOST or expect some tests to fail.');
      }
    }

    if (localhostIPv4 === null) localhostIPv4 = '127.0.0.1';
    return localhostIPv4;
  },

  // opensslCli defined lazily to reduce overhead of spawnSync
  get opensslCli() {
    if (opensslCli !== null) return opensslCli;

    if (process.config.variables.node_shared_openssl) {
      // use external command
      opensslCli = 'openssl';
    } else {
      // use command built from sources included in Node.js repository
      opensslCli = path.join(path.dirname(process.execPath), 'openssl-cli');
    }

    if (exports.isWindows) opensslCli += '.exe';
    var opensslCmd = spawnSync(opensslCli, ['version']);

    if (opensslCmd.status !== 0 || opensslCmd.error !== undefined) {
      // openssl command cannot be executed
      opensslCli = false;
    }

    return opensslCli;
  },

  get PORT() {
    if (+process.env.TEST_PARALLEL) {
      throw new Error('common.PORT cannot be used in a parallelized test');
    }

    return +process.env.NODE_COMMON_PORT || 12346;
  }

};

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}