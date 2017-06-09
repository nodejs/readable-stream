function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

/* eslint-disable required-modules */
'use strict';

/*<replacement>*/
var objectKeys = objectKeys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

var path = require('path');
var fs = require('fs');
var assert = require('assert');
var os = require('os');
var child_process = require('child_process');
var stream = require('../');
var buffer = require('buffer');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Timer = { now: function () {} };
var execSync = require('child_process').execSync;

var testRoot = process.env.NODE_TEST_DIR ? fs.realpathSync(process.env.NODE_TEST_DIR) : path.resolve(__dirname, '..');

var noop = function () {};

exports.noop = noop;
exports.fixturesDir = path.join(__dirname, '..', 'fixtures');
exports.tmpDirName = 'tmp';
// PORT should match the definition in test/testpy/__init__.py.
exports.PORT = +process.env.NODE_COMMON_PORT || 12346;
exports.isWindows = process.platform === 'win32';
exports.isWOW64 = exports.isWindows && process.env.PROCESSOR_ARCHITEW6432 !== undefined;
exports.isAix = process.platform === 'aix';
exports.isLinuxPPCBE = process.platform === 'linux' && process.arch === 'ppc64' && os.endianness() === 'BE';
exports.isSunOS = process.platform === 'sunos';
exports.isFreeBSD = process.platform === 'freebsd';
exports.isLinux = process.platform === 'linux';
exports.isOSX = process.platform === 'darwin';

exports.enoughTestMem = os.totalmem() > 0x40000000; /* 1 Gb */
exports.bufferMaxSizeMsg = new RegExp('^RangeError: "size" argument must not be larger than ' + buffer.kMaxLength + '$');
var cpus = os.cpus();
/*exports.enoughTestCpu = Array.isArray(cpus) &&
                        (cpus.length > 1 || cpus[0].speed > 999);*/

exports.rootDir = exports.isWindows ? 'c:\\' : '/';
//exports.buildType = process.config.target_defaults.default_configuration;

// If env var is set then enable async_hook hooks for all tests.
if (process.env.NODE_TEST_WITH_ASYNC_HOOKS) {
  var destroydIdsList = {};
  var destroyListList = {};
  var initHandles = {};
  //const async_wrap = process.binding('async_wrap');

  process.on('exit', function () {
    // itterate through handles to make sure nothing crashes
    for (var k in initHandles) {
      util.inspect(initHandles[k]);
    }
  });

  var _addIdToDestroyList = async_wrap.addIdToDestroyList;
  async_wrap.addIdToDestroyList = function addIdToDestroyList(id) {
    if (destroyListList[id] !== undefined) {
      process._rawDebug(destroyListList[id]);
      process._rawDebug();
      throw new Error('same id added twice (' + id + ')');
    }
    destroyListList[id] = new Error().stack;
    _addIdToDestroyList(id);
  };

  /*require('async_hooks').createHook({
    init(id, ty, tr, h) {
      if (initHandles[id]) {
        throw new Error(`init called twice for same id (${id})`);
      }
      initHandles[id] = h;
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

function rimrafSync(p) {
  var st = void 0;
  try {
    st = fs.lstatSync(p);
  } catch (e) {
    if (e.code === 'ENOENT') return;
  }

  try {
    if (st && st.isDirectory()) rmdirSync(p, null);else fs.unlinkSync(p);
  } catch (e) {
    if (e.code === 'ENOENT') return;
    if (e.code === 'EPERM') return rmdirSync(p, e);
    if (e.code !== 'EISDIR') throw e;
    rmdirSync(p, e);
  }
}

function rmdirSync(p, originalEr) {
  try {
    fs.rmdirSync(p);
  } catch (e) {
    if (e.code === 'ENOTDIR') throw originalEr;
    if (e.code === 'ENOTEMPTY' || e.code === 'EEXIST' || e.code === 'EPERM') {
      var enc = exports.isLinux ? 'buffer' : 'utf8';
      fs.readdirSync(p, forEach(enc), function (f) {
        if (f instanceof Buffer) {
          var buf = Buffer.concat([Buffer.from(p), Buffer.from(path.sep), f]);
          rimrafSync(buf);
        } else {
          rimrafSync(path.join(p, f));
        }
      });
      fs.rmdirSync(p);
    }
  }
}

exports.refreshTmpDir = function () {
  rimrafSync(exports.tmpDir);
  fs.mkdirSync(exports.tmpDir);
};

if (process.env.TEST_THREAD_ID) {
  exports.PORT += process.env.TEST_THREAD_ID * 100;
  exports.tmpDirName += '.' + process.env.TEST_THREAD_ID;
}
exports.tmpDir = path.join(testRoot, exports.tmpDirName);

var opensslCli = null;
var inFreeBSDJail = null;
var localhostIPv4 = null;

exports.localIPv6Hosts = ['localhost'];
if (exports.isLinux) {
  exports.localIPv6Hosts = [
  // Debian/Ubuntu
  'ip6-localhost', 'ip6-loopback',

  // SUSE
  'ipv6-localhost', 'ipv6-loopback',

  // Typically universal
  'localhost'];
}

/*<replacement>*/if (!process.browser) {
  Object.defineProperty(exports, 'inFreeBSDJail', {
    get: function () {
      if (inFreeBSDJail !== null) return inFreeBSDJail;

      if (exports.isFreeBSD && child_process.execSync('sysctl -n security.jail.jailed').toString() === '1\n') {
        inFreeBSDJail = true;
      } else {
        inFreeBSDJail = false;
      }
      return inFreeBSDJail;
    }
  });
} /*</replacement>*/

/*<replacement>*/if (!process.browser) {
  Object.defineProperty(exports, 'localhostIPv4', {
    get: function () {
      if (localhostIPv4 !== null) return localhostIPv4;

      if (exports.inFreeBSDJail) {
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
    }
  });
} /*</replacement>*/

// opensslCli defined lazily to reduce overhead of spawnSync
/*<replacement>*/if (!process.browser) {
  Object.defineProperty(exports, 'opensslCli', { get: function () {
      if (opensslCli !== null) return opensslCli;

      if (process.config.variables.node_shared_openssl) {
        // use external command
        opensslCli = 'openssl';
      } else {
        // use command built from sources included in Node.js repository
        opensslCli = path.join(path.dirname(process.execPath), 'openssl-cli');
      }

      if (exports.isWindows) opensslCli += '.exe';

      var opensslCmd = child_process.spawnSync(opensslCli, ['version']);
      if (opensslCmd.status !== 0 || opensslCmd.error !== undefined) {
        // openssl command cannot be executed
        opensslCli = false;
      }
      return opensslCli;
    }, enumerable: true });
} /*</replacement>*/

/*<replacement>*/if (!process.browser) {
  Object.defineProperty(exports, 'hasCrypto', {
    get: function () {
      return process.versions.openssl ? true : false;
    }
  });
} /*</replacement>*/

/*<replacement>*/if (!process.browser) {
  Object.defineProperty(exports, 'hasFipsCrypto', {
    get: function () {
      return exports.hasCrypto && require('crypto').fips;
    }
  });
} /*</replacement>*/

if (exports.isWindows) {
  exports.PIPE = '\\\\.\\pipe\\libuv-test';
  if (process.env.TEST_THREAD_ID) {
    exports.PIPE += '.' + process.env.TEST_THREAD_ID;
  }
} else {
  exports.PIPE = exports.tmpDir + '/test.sock';
}

var ifaces = os.networkInterfaces();
exports.hasIPv6 = objectKeys(ifaces).some(function (name) {
  return (/lo/.test(name) && ifaces[name].some(function (info) {
      return info.family === 'IPv6';
    })
  );
});

/*
 * Check that when running a test with
 * `$node --abort-on-uncaught-exception $file child`
 * the process aborts.
 */
exports.childShouldThrowAndAbort = function () {
  var testCmd = '';
  if (!exports.isWindows) {
    // Do not create core files, as it can take a lot of disk space on
    // continuous testing and developers' machines
    testCmd += 'ulimit -c 0 && ';
  }
  testCmd += '"' + process.argv[0] + '" --abort-on-uncaught-exception ';
  testCmd += '"' + process.argv[1] + '" child';
  var child = child_process.exec(testCmd);
  child.on('exit', function onExit(exitCode, signal) {
    var errMsg = 'Test should have aborted ' + ('but instead exited with exit code ' + exitCode) + (' and signal ' + signal);
    assert(exports.nodeProcessAborted(exitCode, signal), errMsg);
  });
};

exports.ddCommand = function (filename, kilobytes) {
  if (exports.isWindows) {
    var p = path.resolve(exports.fixturesDir, 'create-file.js');
    return '"' + process.argv[0] + '" "' + p + '" "' + filename + '" ' + kilobytes * 1024;
  } else {
    return 'dd if=/dev/zero of="' + filename + '" bs=1024 count=' + kilobytes;
  }
};

exports.spawnPwd = function (options) {
  var spawn = require('child_process').spawn;

  if (exports.isWindows) {
    return spawn('cmd.exe', ['/d', '/c', 'cd'], options);
  } else {
    return spawn('pwd', [], options);
  }
};

exports.spawnSyncPwd = function (options) {
  var spawnSync = require('child_process').spawnSync;

  if (exports.isWindows) {
    return spawnSync('cmd.exe', ['/d', '/c', 'cd'], options);
  } else {
    return spawnSync('pwd', [], options);
  }
};

exports.platformTimeout = function (ms) {
  if (process.config.target_defaults.default_configuration === 'Debug') ms = 2 * ms;

  if (global.__coverage__) ms = 4 * ms;

  if (exports.isAix) return 2 * ms; // default localhost speed is slower on AIX

  if (process.arch !== 'arm') return ms;

  var armv = process.config.variables.arm_version;

  if (armv === '6') return 7 * ms; // ARMv6

  if (armv === '7') return 2 * ms; // ARMv7

  return ms; // ARMv8+
};

var knownGlobals = [Buffer, clearImmediate, clearInterval, clearTimeout, console, constructor, // Enumerable in V8 3.21.
global, process, setImmediate, setInterval, setTimeout];

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

if (global.LTTNG_HTTP_SERVER_RESPONSE) {
  knownGlobals.push(LTTNG_HTTP_SERVER_RESPONSE);
  knownGlobals.push(LTTNG_HTTP_SERVER_REQUEST);
  knownGlobals.push(LTTNG_HTTP_CLIENT_RESPONSE);
  knownGlobals.push(LTTNG_HTTP_CLIENT_REQUEST);
  knownGlobals.push(LTTNG_NET_STREAM_END);
  knownGlobals.push(LTTNG_NET_SERVER_CONNECTION);
}

/*<replacement>*/if (!process.browser) {
  if (global.ArrayBuffer) {
    knownGlobals.push(ArrayBuffer);
    knownGlobals.push(Int8Array);
    knownGlobals.push(Uint8Array);
    knownGlobals.push(Uint8ClampedArray);
    knownGlobals.push(Int16Array);
    knownGlobals.push(Uint16Array);
    knownGlobals.push(Int32Array);
    knownGlobals.push(Uint32Array);
    knownGlobals.push(Float32Array);
    knownGlobals.push(Float64Array);
    knownGlobals.push(DataView);
  }
} /*</replacement>*/

// Harmony features.
if (global.Proxy) {
  knownGlobals.push(Proxy);
}

if (global.Symbol) {
  knownGlobals.push(Symbol);
}

function allowGlobals() {
  for (var _len = arguments.length, whitelist = Array(_len), _key = 0; _key < _len; _key++) {
    whitelist[_key] = arguments[_key];
  }

  knownGlobals = knownGlobals.concat(whitelist);
}
exports.allowGlobals = allowGlobals;

/*<replacement>*/
if (typeof constructor == 'function') knownGlobals.push(constructor);
if (typeof DTRACE_NET_SOCKET_READ == 'function') knownGlobals.push(DTRACE_NET_SOCKET_READ);
if (typeof DTRACE_NET_SOCKET_WRITE == 'function') knownGlobals.push(DTRACE_NET_SOCKET_WRITE);
if (global.__coverage__) knownGlobals.push(__coverage__);
'core,__core-js_shared__,Promise,Map,Set,WeakMap,WeakSet,Reflect,System,asap,Observable,regeneratorRuntime,_babelPolyfill'.split(',').filter(function (item) {
  return typeof global[item] !== undefined;
}).forEach(function (item) {
  knownGlobals.push(global[item]);
}); /*</replacement>*/

function leakedGlobals() {
  var leaked = [];

  // eslint-disable-next-line no-var
  for (var val in global) {
    if (!knownGlobals.includes(global[val])) leaked.push(val);
  }if (global.__coverage__) {
    return leaked.filter(function (varname) {
      return !/^(cov_|__cov)/.test(varname);
    });
  } else {
    return leaked;
  }
}
exports.leakedGlobals = leakedGlobals;

// Turn this off if the test should not check for global leaks.
exports.globalCheck = true;

process.on('exit', function () {
  if (!exports.globalCheck) return;
  var leaked = leakedGlobals();
  if (leaked.length > 0) {
    assert.fail('Unexpected global(s) found: ' + leaked.join(', '));
  }
});

var mustCallChecks = [];

function runCallChecks(exitCode) {
  if (exitCode !== 0) return;

  var failed = mustCallChecks.filter(function (context) {
    if ('minimum' in context) {
      context.messageSegment = 'at least ' + context.minimum;
      return context.actual < context.minimum;
    } else {
      context.messageSegment = 'exactly ' + context.exact;
      return context.actual !== context.exact;
    }
  });

  forEach(failed, function (context) {
    console.log('Mismatched %s function calls. Expected %s, actual %d.', context.name, context.messageSegment, context.actual);
    console.log(context.stack.split('\n').slice(2).join('\n'));
  });

  if (failed.length) process.exit(1);
}

exports.mustCall = function (fn, exact) {
  return _mustCallInner(fn, exact, 'exact');
};

exports.mustCallAtLeast = function (fn, minimum) {
  return _mustCallInner(fn, minimum, 'minimum');
};

function _mustCallInner(fn, criteria, field) {
  var _context;

  if (typeof fn === 'number') {
    criteria = fn;
    fn = noop;
  } else if (fn === undefined) {
    fn = noop;
  }

  if (criteria === undefined) criteria = 1;else if (typeof criteria !== 'number') throw new TypeError('Invalid ' + field + ' value: ' + criteria);

  var context = (_context = {}, _defineProperty(_context, field, criteria), _defineProperty(_context, 'actual', 0), _defineProperty(_context, 'stack', new Error().stack), _defineProperty(_context, 'name', fn.name || '<anonymous>'), _context);

  // add the exit listener only once to avoid listener leak warnings
  if (mustCallChecks.length === 0) process.on('exit', runCallChecks);

  mustCallChecks.push(context);

  return function () {
    context.actual++;
    return fn.apply(this, arguments);
  };
}

exports.hasMultiLocalhost = function hasMultiLocalhost() {
  var TCP = process.binding('tcp_wrap').TCP;
  var t = new TCP();
  var ret = t.bind('127.0.0.2', exports.PORT);
  t.close();
  return ret === 0;
};

exports.fileExists = function (pathname) {
  try {
    fs.accessSync(pathname);
    return true;
  } catch (err) {
    return false;
  }
};

exports.canCreateSymLink = function () {
  // On Windows, creating symlinks requires admin privileges.
  // We'll only try to run symlink test if we have enough privileges.
  // On other platforms, creating symlinks shouldn't need admin privileges
  if (exports.isWindows) {
    // whoami.exe needs to be the one from System32
    // If unix tools are in the path, they can shadow the one we want,
    // so use the full path while executing whoami
    var whoamiPath = path.join(process.env['SystemRoot'], 'System32', 'whoami.exe');

    var err = false;
    var output = '';

    try {
      output = execSync(whoamiPath + ' /priv', { timout: 1000 });
    } catch (e) {
      err = true;
    } finally {
      if (err || !output.includes('SeCreateSymbolicLinkPrivilege')) {
        return false;
      }
    }
  }

  return true;
};

exports.mustNotCall = function (msg) {
  return function mustNotCall() {
    assert.fail(msg || 'function should not have been called');
  };
};

exports.skip = function (msg) {
  console.log('1..0 # Skipped: ' + msg);
};

// A stream to push an array into a REPL
function ArrayStream() {
  this.run = function (data) {
    var _this = this;

    forEach(data, function (line) {
      _this.emit('data', line + '\n');
    });
  };
}

util.inherits(ArrayStream, stream.Stream);
exports.ArrayStream = ArrayStream;
ArrayStream.prototype.readable = true;
ArrayStream.prototype.writable = true;
ArrayStream.prototype.pause = noop;
ArrayStream.prototype.resume = noop;
ArrayStream.prototype.write = noop;

// Returns true if the exit code "exitCode" and/or signal name "signal"
// represent the exit code and/or signal name of a node process that aborted,
// false otherwise.
exports.nodeProcessAborted = function nodeProcessAborted(exitCode, signal) {
  // Depending on the compiler used, node will exit with either
  // exit code 132 (SIGILL), 133 (SIGTRAP) or 134 (SIGABRT).
  var expectedExitCodes = [132, 133, 134];

  // On platforms using KSH as the default shell (like SmartOS),
  // when a process aborts, KSH exits with an exit code that is
  // greater than 256, and thus the exit code emitted with the 'exit'
  // event is null and the signal is set to either SIGILL, SIGTRAP,
  // or SIGABRT (depending on the compiler).
  var expectedSignals = ['SIGILL', 'SIGTRAP', 'SIGABRT'];

  // On Windows, 'aborts' are of 2 types, depending on the context:
  // (i) Forced access violation, if --abort-on-uncaught-exception is on
  // which corresponds to exit code 3221225477 (0xC0000005)
  // (ii) raise(SIGABRT) or abort(), which lands up in CRT library calls
  // which corresponds to exit code 3.
  if (exports.isWindows) expectedExitCodes = [3221225477, 3];

  // When using --abort-on-uncaught-exception, V8 will use
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
};

exports.busyLoop = function busyLoop(time) {
  var startTime = Timer.now();
  var stopTime = startTime + time;
  while (Timer.now() < stopTime) {}
};

exports.isAlive = function isAlive(pid) {
  try {
    process.kill(pid, 'SIGCONT');
    return true;
  } catch (e) {
    return false;
  }
};

function expectWarning(name, expectedMessages) {
  return exports.mustCall(function (warning) {
    assert.strictEqual(warning.name, name);
    assert.ok(expectedMessages.includes(warning.message), 'unexpected error message: "' + warning.message + '"');
    // Remove a warning message after it is seen so that we guarantee that we
    // get each message only once.
    expectedMessages.splice(expectedMessages.indexOf(warning.message), 1);
  }, expectedMessages.length);
}

function expectWarningByName(name, expected) {
  if (typeof expected === 'string') {
    expected = [expected];
  }
  process.on('warning', expectWarning(name, expected));
}

function expectWarningByMap(warningMap) {
  var catchWarning = {};
  forEach(objectKeys(warningMap), function (name) {
    var expected = warningMap[name];
    if (typeof expected === 'string') {
      expected = [expected];
    }
    catchWarning[name] = expectWarning(name, expected);
  });
  process.on('warning', function (warning) {
    return catchWarning[warning.name](warning);
  });
}

// accepts a warning name and description or array of descriptions or a map
// of warning names to description(s)
// ensures a warning is generated for each name/description pair
exports.expectWarning = function (nameOrMap, expected) {
  if (typeof nameOrMap === 'string') {
    expectWarningByName(nameOrMap, expected);
  } else {
    expectWarningByMap(nameOrMap);
  }
};

/*<replacement>*/if (!process.browser) {
  Object.defineProperty(exports, 'hasIntl', {
    get: function () {
      return process.binding('config').hasIntl;
    }
  });
} /*</replacement>*/

// Useful for testing expected internal/error objects
exports.expectsError = function expectsError(_ref) {
  var code = _ref.code,
      type = _ref.type,
      message = _ref.message;

  return function (error) {
    assert.strictEqual(error.code, code);
    if (type !== undefined) assert(error instanceof type, error + ' is not the expected type ' + type);
    if (message instanceof RegExp) {
      assert(message.test(error.message), error.message + ' does not match ' + message);
    } else if (typeof message === 'string') {
      assert.strictEqual(error.message, message);
    }
    return true;
  };
};

exports.skipIfInspectorDisabled = function skipIfInspectorDisabled() {
  if (process.config.variables.v8_enable_inspector === 0) {
    exports.skip('V8 inspector is disabled');
    process.exit(0);
  }
};

var arrayBufferViews = [Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, DataView];

exports.getArrayBufferViews = function getArrayBufferViews(buf) {
  var buffer = buf.buffer,
      byteOffset = buf.byteOffset,
      byteLength = buf.byteLength;


  var out = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = arrayBufferViews[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var type = _step.value;
      var _type$BYTES_PER_ELEME = type.BYTES_PER_ELEMENT,
          BYTES_PER_ELEMENT = _type$BYTES_PER_ELEME === undefined ? 1 : _type$BYTES_PER_ELEME;

      if (byteLength % BYTES_PER_ELEMENT === 0) {
        out.push(new type(buffer, byteOffset, byteLength / BYTES_PER_ELEMENT));
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

  return out;
};

// Crash the process on unhandled rejections.
exports.crashOnUnhandledRejection = function () {
  process.on('unhandledRejection', function (err) {
    return process.nextTick(function () {
      throw err;
    });
  });
};

exports.getTTYfd = function getTTYfd() {
  var tty = require('tty');
  var tty_fd = 0;
  if (!tty.isatty(tty_fd)) tty_fd++;else if (!tty.isatty(tty_fd)) tty_fd++;else if (!tty.isatty(tty_fd)) tty_fd++;else try {
    tty_fd = require('fs').openSync('/dev/tty');
  } catch (e) {
    // There aren't any tty fd's available to use.
    return -1;
  }
  return tty_fd;
};

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

if (!util._errnoException) {
  var uv;
  util._errnoException = function (err, syscall) {
    if (util.isUndefined(uv)) try {
      uv = process.binding('uv');
    } catch (e) {}
    var errname = uv ? uv.errname(err) : '';
    var e = new Error(syscall + ' ' + errname);
    e.code = errname;
    e.errno = errname;
    e.syscall = syscall;
    return e;
  };
}