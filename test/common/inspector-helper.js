"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/*<replacement>*/
require('@babel/polyfill');
var util = require('util');
for (var i in util) exports[i] = util[i];
/*</replacement>*/
'use strict';

/*<replacement>*/
var objectKeys = objectKeys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
};
/*</replacement>*/

const common = require('../common');
const assert = require('assert');
const fs = require('fs');
const http = require('http');
const fixtures = require('../common/fixtures');
const _require = require('child_process'),
  spawn = _require.spawn;
const _require2 = require('url'),
  parseURL = _require2.parse;
const _require3 = require('internal/url'),
  pathToFileURL = _require3.pathToFileURL;
const _require4 = require('events'),
  EventEmitter = _require4.EventEmitter;
const _MAINSCRIPT = fixtures.path('loop.js');
const DEBUG = false;
const TIMEOUT = common.platformTimeout(15 * 1000);
function spawnChildProcess(inspectorFlags, scriptContents, scriptFile) {
  const args = [].concat(inspectorFlags);
  if (scriptContents) {
    args.push('-e', scriptContents);
  } else {
    args.push(scriptFile);
  }
  const child = spawn(process.execPath, args);
  const handler = tearDown.bind(null, child);
  process.on('exit', handler);
  process.on('uncaughtException', handler);
  common.disableCrashOnUnhandledRejection();
  process.on('unhandledRejection', handler);
  process.on('SIGINT', handler);
  return child;
}
function makeBufferingDataCallback(dataCallback) {
  let buffer = Buffer.alloc(0);
  return data => {
    const newData = Buffer.concat([buffer, data]);
    const str = newData.toString('utf8');
    const lines = str.replace(/\r/g, '').split('\n');
    if (str.endsWith('\n')) buffer = Buffer.alloc(0);else buffer = Buffer.from(lines.pop(), 'utf8');
    var _iterator = _createForOfIteratorHelper(lines),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        const line = _step.value;
        dataCallback(line);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
}
function tearDown(child, err) {
  child.kill();
  if (err) {
    console.error(err);
    process.exit(1);
  }
}
function parseWSFrame(buffer) {
  // Protocol described in https://tools.ietf.org/html/rfc6455#section-5
  let message = null;
  if (buffer.length < 2) return {
    length: 0,
    message
  };
  if (buffer[0] === 0x88 && buffer[1] === 0x00) {
    return {
      length: 2,
      message,
      closed: true
    };
  }
  assert.strictEqual(buffer[0], 0x81);
  let dataLen = 0x7F & buffer[1];
  let bodyOffset = 2;
  if (buffer.length < bodyOffset + dataLen) return 0;
  if (dataLen === 126) {
    dataLen = buffer.readUInt16BE(2);
    bodyOffset = 4;
  } else if (dataLen === 127) {
    assert(buffer[2] === 0 && buffer[3] === 0, 'Inspector message too big');
    dataLen = buffer.readUIntBE(4, 6);
    bodyOffset = 10;
  }
  if (buffer.length < bodyOffset + dataLen) return {
    length: 0,
    message
  };
  const jsonPayload = buffer.slice(bodyOffset, bodyOffset + dataLen).toString('utf8');
  try {
    message = JSON.parse(jsonPayload);
  } catch (e) {
    console.error(`JSON.parse() failed for: ${jsonPayload}`);
    throw e;
  }
  if (DEBUG) console.log('[received]', JSON.stringify(message));
  return {
    length: bodyOffset + dataLen,
    message
  };
}
function formatWSFrame(message) {
  const messageBuf = Buffer.from(JSON.stringify(message));
  const wsHeaderBuf = Buffer.allocUnsafe(16);
  wsHeaderBuf.writeUInt8(0x81, 0);
  let byte2 = 0x80;
  const bodyLen = messageBuf.length;
  let maskOffset = 2;
  if (bodyLen < 126) {
    byte2 = 0x80 + bodyLen;
  } else if (bodyLen < 65536) {
    byte2 = 0xFE;
    wsHeaderBuf.writeUInt16BE(bodyLen, 2);
    maskOffset = 4;
  } else {
    byte2 = 0xFF;
    wsHeaderBuf.writeUInt32BE(bodyLen, 2);
    wsHeaderBuf.writeUInt32BE(0, 6);
    maskOffset = 10;
  }
  wsHeaderBuf.writeUInt8(byte2, 1);
  wsHeaderBuf.writeUInt32BE(0x01020408, maskOffset);
  for (let i = 0; i < messageBuf.length; i++) messageBuf[i] = messageBuf[i] ^ 1 << i % 4;
  return Buffer.concat([wsHeaderBuf.slice(0, maskOffset + 4), messageBuf]);
}
class InspectorSession {
  constructor(socket, instance) {
    this._instance = instance;
    this._socket = socket;
    this._nextId = 1;
    this._commandResponsePromises = new Map();
    this._unprocessedNotifications = [];
    this._notificationCallback = null;
    this._scriptsIdsByUrl = new Map();
    let buffer = Buffer.alloc(0);
    socket.on('data', data => {
      buffer = Buffer.concat([buffer, data]);
      do {
        const _parseWSFrame = parseWSFrame(buffer),
          length = _parseWSFrame.length,
          message = _parseWSFrame.message,
          closed = _parseWSFrame.closed;
        if (!length) break;
        if (closed) {
          socket.write(Buffer.from([0x88, 0x00])); // WS close frame
        }

        buffer = buffer.slice(length);
        if (message) this._onMessage(message);
      } while (true);
    });
    this._terminationPromise = new Promise(resolve => {
      socket.once('close', resolve);
    });
  }
  waitForServerDisconnect() {
    return this._terminationPromise;
  }
  disconnect() {
    var _this = this;
    return _asyncToGenerator(function* () {
      _this._socket.destroy();
      return _this.waitForServerDisconnect();
    })();
  }
  _onMessage(message) {
    if (message.id) {
      const _this$_commandRespons = this._commandResponsePromises.get(message.id),
        resolve = _this$_commandRespons.resolve,
        reject = _this$_commandRespons.reject;
      this._commandResponsePromises.delete(message.id);
      if (message.result) resolve(message.result);else reject(message.error);
    } else {
      if (message.method === 'Debugger.scriptParsed') {
        const _message$params = message.params,
          scriptId = _message$params.scriptId,
          url = _message$params.url;
        this._scriptsIdsByUrl.set(scriptId, url);
        const fileUrl = url.startsWith('file:') ? url : pathToFileURL(url).toString();
        if (fileUrl === this.scriptURL().toString()) {
          this.mainScriptId = scriptId;
        }
      }
      if (this._notificationCallback) {
        // In case callback needs to install another
        const callback = this._notificationCallback;
        this._notificationCallback = null;
        callback(message);
      } else {
        this._unprocessedNotifications.push(message);
      }
    }
  }
  _sendMessage(message) {
    const msg = JSON.parse(JSON.stringify(message)); // Clone!
    msg.id = this._nextId++;
    if (DEBUG) console.log('[sent]', JSON.stringify(msg));
    const responsePromise = new Promise((resolve, reject) => {
      this._commandResponsePromises.set(msg.id, {
        resolve,
        reject
      });
    });
    return new Promise(resolve => this._socket.write(formatWSFrame(msg), resolve)).then(() => responsePromise);
  }
  send(commands) {
    if (Array.isArray(commands)) {
      // Multiple commands means the response does not matter. There might even
      // never be a response.
      return Promise.all(commands.map(command => this._sendMessage(command))).then(() => {});
    } else {
      return this._sendMessage(commands);
    }
  }
  waitForNotification(methodOrPredicate, description) {
    const desc = description || methodOrPredicate;
    const message = `Timed out waiting for matching notification (${desc}))`;
    return fires(this._asyncWaitForNotification(methodOrPredicate), message, TIMEOUT);
  }
  _asyncWaitForNotification(methodOrPredicate) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      function matchMethod(notification) {
        return notification.method === methodOrPredicate;
      }
      const predicate = typeof methodOrPredicate === 'string' ? matchMethod : methodOrPredicate;
      let notification = null;
      do {
        if (_this2._unprocessedNotifications.length) {
          notification = _this2._unprocessedNotifications.shift();
        } else {
          notification = yield new Promise(resolve => _this2._notificationCallback = resolve);
        }
      } while (!predicate(notification));
      return notification;
    })();
  }
  _isBreakOnLineNotification(message, line, expectedScriptPath) {
    if (message.method === 'Debugger.paused') {
      const callFrame = message.params.callFrames[0];
      const location = callFrame.location;
      const scriptPath = this._scriptsIdsByUrl.get(location.scriptId);
      assert.strictEqual(scriptPath.toString(), expectedScriptPath.toString(), `${scriptPath} !== ${expectedScriptPath}`);
      assert.strictEqual(location.lineNumber, line);
      return true;
    }
  }
  waitForBreakOnLine(line, url) {
    return this.waitForNotification(notification => this._isBreakOnLineNotification(notification, line, url), `break on ${url}:${line}`);
  }
  _matchesConsoleOutputNotification(notification, type, values) {
    if (!Array.isArray(values)) values = [values];
    if (notification.method === 'Runtime.consoleAPICalled') {
      const params = notification.params;
      if (params.type === type) {
        let i = 0;
        var _iterator2 = _createForOfIteratorHelper(params.args),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            const value = _step2.value;
            if (value.value !== values[i++]) return false;
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        return i === values.length;
      }
    }
  }
  waitForConsoleOutput(type, values) {
    const desc = `Console output matching ${JSON.stringify(values)}`;
    return this.waitForNotification(notification => this._matchesConsoleOutputNotification(notification, type, values), desc);
  }
  runToCompletion() {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      console.log('[test]', 'Verify node waits for the frontend to disconnect');
      yield _this3.send({
        'method': 'Debugger.resume'
      });
      yield _this3.waitForNotification(notification => {
        return notification.method === 'Runtime.executionContextDestroyed' && notification.params.executionContextId === 1;
      });
      while ((yield _this3._instance.nextStderrString()) !== 'Waiting for the debugger to disconnect...');
      yield _this3.disconnect();
    })();
  }
  scriptPath() {
    return this._instance.scriptPath();
  }
  script() {
    return this._instance.script();
  }
  scriptURL() {
    return pathToFileURL(this.scriptPath());
  }
}
class NodeInstance extends EventEmitter {
  constructor() {
    let inspectorFlags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['--inspect-brk=0'];
    let scriptContents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    let scriptFile = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _MAINSCRIPT;
    super();
    this._scriptPath = scriptFile;
    this._script = scriptFile ? null : scriptContents;
    this._portCallback = null;
    this.portPromise = new Promise(resolve => this._portCallback = resolve);
    this._process = spawnChildProcess(inspectorFlags, scriptContents, scriptFile);
    this._running = true;
    this._stderrLineCallback = null;
    this._unprocessedStderrLines = [];
    this._process.stdout.on('data', makeBufferingDataCallback(line => {
      this.emit('stdout', line);
      console.log('[out]', line);
    }));
    this._process.stderr.on('data', makeBufferingDataCallback(message => this.onStderrLine(message)));
    this._shutdownPromise = new Promise(resolve => {
      this._process.once('exit', (exitCode, signal) => {
        resolve({
          exitCode,
          signal
        });
        this._running = false;
      });
    });
  }
  static startViaSignal(scriptContents) {
    return _asyncToGenerator(function* () {
      const instance = new NodeInstance([], `${scriptContents}\nprocess._rawDebug('started');`, undefined);
      const msg = 'Timed out waiting for process to start';
      while ((yield fires(instance.nextStderrString(), msg, TIMEOUT)) !== 'started') {}
      process._debugProcess(instance._process.pid);
      return instance;
    })();
  }
  onStderrLine(line) {
    console.log('[err]', line);
    if (this._portCallback) {
      const matches = line.match(/Debugger listening on ws:\/\/.+:(\d+)\/.+/);
      if (matches) {
        this._portCallback(matches[1]);
        this._portCallback = null;
      }
    }
    if (this._stderrLineCallback) {
      this._stderrLineCallback(line);
      this._stderrLineCallback = null;
    } else {
      this._unprocessedStderrLines.push(line);
    }
  }
  httpGet(host, path, hostHeaderValue) {
    console.log('[test]', `Testing ${path}`);
    const headers = hostHeaderValue ? {
      'Host': hostHeaderValue
    } : null;
    return this.portPromise.then(port => new Promise((resolve, reject) => {
      const req = http.get({
        host,
        port,
        path,
        headers
      }, res => {
        let response = '';
        res.setEncoding('utf8');
        res.on('data', data => response += data.toString()).on('end', () => {
          resolve(response);
        });
      });
      req.on('error', reject);
    })).then(response => {
      try {
        return JSON.parse(response);
      } catch (e) {
        e.body = response;
        throw e;
      }
    });
  }
  sendUpgradeRequest() {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      const response = yield _this4.httpGet(null, '/json/list');
      const devtoolsUrl = response[0].webSocketDebuggerUrl;
      const port = yield _this4.portPromise;
      return http.get({
        port,
        path: parseURL(devtoolsUrl).path,
        headers: {
          'Connection': 'Upgrade',
          'Upgrade': 'websocket',
          'Sec-WebSocket-Version': 13,
          'Sec-WebSocket-Key': 'key=='
        }
      });
    })();
  }
  connectInspectorSession() {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      console.log('[test]', 'Connecting to a child Node process');
      const upgradeRequest = yield _this5.sendUpgradeRequest();
      return new Promise(resolve => {
        upgradeRequest.on('upgrade', (message, socket) => resolve(new InspectorSession(socket, _this5))).on('response', common.mustNotCall('Upgrade was not received'));
      });
    })();
  }
  expectConnectionDeclined() {
    var _this6 = this;
    return _asyncToGenerator(function* () {
      console.log('[test]', 'Checking upgrade is not possible');
      const upgradeRequest = yield _this6.sendUpgradeRequest();
      return new Promise(resolve => {
        upgradeRequest.on('upgrade', common.mustNotCall('Upgrade was received')).on('response', response => response.on('data', () => {}).on('end', () => resolve(response.statusCode)));
      });
    })();
  }
  expectShutdown() {
    return this._shutdownPromise;
  }
  nextStderrString() {
    if (this._unprocessedStderrLines.length) return Promise.resolve(this._unprocessedStderrLines.shift());
    return new Promise(resolve => this._stderrLineCallback = resolve);
  }
  write(message) {
    this._process.stdin.write(message);
  }
  kill() {
    this._process.kill();
    return this.expectShutdown();
  }
  scriptPath() {
    return this._scriptPath;
  }
  script() {
    if (this._script === null) this._script = fs.readFileSync(this.scriptPath(), 'utf8');
    return this._script;
  }
}
function onResolvedOrRejected(promise, callback) {
  return promise.then(result => {
    callback();
    return result;
  }, error => {
    callback();
    throw error;
  });
}
function timeoutPromise(error, timeoutMs) {
  let clearCallback = null;
  let done = false;
  const promise = onResolvedOrRejected(new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(error), timeoutMs);
    clearCallback = () => {
      if (done) return;
      clearTimeout(timeout);
      resolve();
    };
  }), () => done = true);
  promise.clear = clearCallback;
  return promise;
}

// Returns a new promise that will propagate `promise` resolution or rejection
// if that happens within the `timeoutMs` timespan, or rejects with `error` as
// a reason otherwise.
function fires(promise, error, timeoutMs) {
  const timeout = timeoutPromise(error, timeoutMs);
  return Promise.race([onResolvedOrRejected(promise, () => timeout.clear()), timeout]);
}
module.exports = {
  NodeInstance
};
function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}