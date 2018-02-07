function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
'use strict';

/*<replacement>*/
var objectKeys = objectKeys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

var common = require('../common');
var assert = require('assert');
var fs = require('fs');
var http = require('http');
var fixtures = require('../common/fixtures');

var _require = require('child_process'),
    spawn = _require.spawn;

var url = require('url');

var _MAINSCRIPT = fixtures.path('loop.js');
var DEBUG = false;
var TIMEOUT = common.platformTimeout(15 * 1000);

function spawnChildProcess(inspectorFlags, scriptContents, scriptFile) {
  var args = [].concat(inspectorFlags);
  if (scriptContents) {
    args.push('-e', scriptContents);
  } else {
    args.push(scriptFile);
  }
  var child = spawn(process.execPath, args);

  var handler = tearDown.bind(null, child);
  process.on('exit', handler);
  process.on('uncaughtException', handler);
  process.on('unhandledRejection', handler);
  process.on('SIGINT', handler);

  return child;
}

function makeBufferingDataCallback(dataCallback) {
  var buffer = Buffer.alloc(0);
  return function (data) {
    var newData = Buffer.concat([buffer, data]);
    var str = newData.toString('utf8');
    var lines = str.replace(/\r/g, '').split('\n');
    if (str.endsWith('\n')) buffer = Buffer.alloc(0);else buffer = Buffer.from(lines.pop(), 'utf8');
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var line = _step.value;

        dataCallback(line);
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
  var message = null;
  if (buffer.length < 2) return { length: 0, message: message };
  if (buffer[0] === 0x88 && buffer[1] === 0x00) {
    return { length: 2, message: message, closed: true };
  }
  assert.strictEqual(0x81, buffer[0]);
  var dataLen = 0x7F & buffer[1];
  var bodyOffset = 2;
  if (buffer.length < bodyOffset + dataLen) return 0;
  if (dataLen === 126) {
    dataLen = buffer.readUInt16BE(2);
    bodyOffset = 4;
  } else if (dataLen === 127) {
    assert(buffer[2] === 0 && buffer[3] === 0, 'Inspector message too big');
    dataLen = buffer.readUIntBE(4, 6);
    bodyOffset = 10;
  }
  if (buffer.length < bodyOffset + dataLen) return { length: 0, message: message };
  var jsonPayload = buffer.slice(bodyOffset, bodyOffset + dataLen).toString('utf8');
  try {
    message = JSON.parse(jsonPayload);
  } catch (e) {
    console.error('JSON.parse() failed for: ' + jsonPayload);
    throw e;
  }
  if (DEBUG) console.log('[received]', JSON.stringify(message));
  return { length: bodyOffset + dataLen, message: message };
}

function formatWSFrame(message) {
  var messageBuf = Buffer.from(JSON.stringify(message));

  var wsHeaderBuf = Buffer.allocUnsafe(16);
  wsHeaderBuf.writeUInt8(0x81, 0);
  var byte2 = 0x80;
  var bodyLen = messageBuf.length;

  var maskOffset = 2;
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

  for (var _i = 0; _i < messageBuf.length; _i++) {
    messageBuf[_i] = messageBuf[_i] ^ 1 << _i % 4;
  }return Buffer.concat([wsHeaderBuf.slice(0, maskOffset + 4), messageBuf]);
}

var InspectorSession = function () {
  function InspectorSession(socket, instance) {
    var _this = this;

    _classCallCheck(this, InspectorSession);

    this._instance = instance;
    this._socket = socket;
    this._nextId = 1;
    this._commandResponsePromises = new Map();
    this._unprocessedNotifications = [];
    this._notificationCallback = null;
    this._scriptsIdsByUrl = new Map();

    var buffer = Buffer.alloc(0);
    socket.on('data', function (data) {
      buffer = Buffer.concat([buffer, data]);
      do {
        var _parseWSFrame = parseWSFrame(buffer),
            length = _parseWSFrame.length,
            message = _parseWSFrame.message,
            closed = _parseWSFrame.closed;

        if (!length) break;

        if (closed) {
          socket.write(Buffer.from([0x88, 0x00])); // WS close frame
        }
        buffer = buffer.slice(length);
        if (message) _this._onMessage(message);
      } while (true);
    });
    this._terminationPromise = new Promise(function (resolve) {
      socket.once('close', resolve);
    });
  }

  InspectorSession.prototype.waitForServerDisconnect = function waitForServerDisconnect() {
    return this._terminationPromise;
  };

  InspectorSession.prototype.disconnect = function disconnect() {
    this._socket.destroy();
  };

  InspectorSession.prototype._onMessage = function _onMessage(message) {
    if (message.id) {
      var _commandResponsePromi = this._commandResponsePromises.get(message.id),
          resolve = _commandResponsePromi.resolve,
          reject = _commandResponsePromi.reject;

      this._commandResponsePromises.delete(message.id);
      if (message.result) resolve(message.result);else reject(message.error);
    } else {
      if (message.method === 'Debugger.scriptParsed') {
        var script = message['params'];
        var scriptId = script['scriptId'];
        var _url = script['url'];
        this._scriptsIdsByUrl.set(scriptId, _url);
        if (_url === _MAINSCRIPT) this.mainScriptId = scriptId;
      }

      if (this._notificationCallback) {
        // In case callback needs to install another
        var callback = this._notificationCallback;
        this._notificationCallback = null;
        callback(message);
      } else {
        this._unprocessedNotifications.push(message);
      }
    }
  };

  InspectorSession.prototype._sendMessage = function _sendMessage(message) {
    var _this2 = this;

    var msg = JSON.parse(JSON.stringify(message)); // Clone!
    msg['id'] = this._nextId++;
    if (DEBUG) console.log('[sent]', JSON.stringify(msg));

    var responsePromise = new Promise(function (resolve, reject) {
      _this2._commandResponsePromises.set(msg['id'], { resolve: resolve, reject: reject });
    });

    return new Promise(function (resolve) {
      return _this2._socket.write(formatWSFrame(msg), resolve);
    }).then(function () {
      return responsePromise;
    });
  };

  InspectorSession.prototype.send = function send(commands) {
    var _this3 = this;

    if (Array.isArray(commands)) {
      // Multiple commands means the response does not matter. There might even
      // never be a response.
      return Promise.all(commands.map(function (command) {
        return _this3._sendMessage(command);
      })).then(function () {});
    } else {
      return this._sendMessage(commands);
    }
  };

  InspectorSession.prototype.waitForNotification = function waitForNotification(methodOrPredicate, description) {
    var desc = description || methodOrPredicate;
    var message = 'Timed out waiting for matching notification (' + desc + '))';
    return common.fires(this._asyncWaitForNotification(methodOrPredicate), message, TIMEOUT);
  };

  InspectorSession.prototype._asyncWaitForNotification = async function _asyncWaitForNotification(methodOrPredicate) {
    var _this4 = this;

    function matchMethod(notification) {
      return notification.method === methodOrPredicate;
    }
    var predicate = typeof methodOrPredicate === 'string' ? matchMethod : methodOrPredicate;
    var notification = null;
    do {
      if (this._unprocessedNotifications.length) {
        notification = this._unprocessedNotifications.shift();
      } else {
        notification = await new Promise(function (resolve) {
          return _this4._notificationCallback = resolve;
        });
      }
    } while (!predicate(notification));
    return notification;
  };

  InspectorSession.prototype._isBreakOnLineNotification = function _isBreakOnLineNotification(message, line, url) {
    if ('Debugger.paused' === message['method']) {
      var callFrame = message['params']['callFrames'][0];
      var location = callFrame['location'];
      assert.strictEqual(url, this._scriptsIdsByUrl.get(location['scriptId']));
      assert.strictEqual(line, location['lineNumber']);
      return true;
    }
  };

  InspectorSession.prototype.waitForBreakOnLine = function waitForBreakOnLine(line, url) {
    var _this5 = this;

    return this.waitForNotification(function (notification) {
      return _this5._isBreakOnLineNotification(notification, line, url);
    }, 'break on ' + url + ':' + line);
  };

  InspectorSession.prototype._matchesConsoleOutputNotification = function _matchesConsoleOutputNotification(notification, type, values) {
    if (!Array.isArray(values)) values = [values];
    if ('Runtime.consoleAPICalled' === notification['method']) {
      var params = notification['params'];
      if (params['type'] === type) {
        var _i2 = 0;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = params['args'][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var value = _step2.value;

            if (value['value'] !== values[_i2++]) return false;
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

        return _i2 === values.length;
      }
    }
  };

  InspectorSession.prototype.waitForConsoleOutput = function waitForConsoleOutput(type, values) {
    var _this6 = this;

    var desc = 'Console output matching ' + JSON.stringify(values);
    return this.waitForNotification(function (notification) {
      return _this6._matchesConsoleOutputNotification(notification, type, values);
    }, desc);
  };

  InspectorSession.prototype.runToCompletion = async function runToCompletion() {
    console.log('[test]', 'Verify node waits for the frontend to disconnect');
    await this.send({ 'method': 'Debugger.resume' });
    await this.waitForNotification(function (notification) {
      return notification.method === 'Runtime.executionContextDestroyed' && notification.params.executionContextId === 1;
    });
    while ((await this._instance.nextStderrString()) !== 'Waiting for the debugger to disconnect...') {}
    await this.disconnect();
  };

  return InspectorSession;
}();

var NodeInstance = function () {
  function NodeInstance() {
    var inspectorFlags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['--inspect-brk=0'];

    var _this7 = this;

    var scriptContents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var scriptFile = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _MAINSCRIPT;

    _classCallCheck(this, NodeInstance);

    this._portCallback = null;
    this.portPromise = new Promise(function (resolve) {
      return _this7._portCallback = resolve;
    });
    this._process = spawnChildProcess(inspectorFlags, scriptContents, scriptFile);
    this._running = true;
    this._stderrLineCallback = null;
    this._unprocessedStderrLines = [];

    this._process.stdout.on('data', makeBufferingDataCallback(function (line) {
      return console.log('[out]', line);
    }));

    this._process.stderr.on('data', makeBufferingDataCallback(function (message) {
      return _this7.onStderrLine(message);
    }));

    this._shutdownPromise = new Promise(function (resolve) {
      _this7._process.once('exit', function (exitCode, signal) {
        resolve({ exitCode: exitCode, signal: signal });
        _this7._running = false;
      });
    });
  }

  NodeInstance.startViaSignal = async function startViaSignal(scriptContents) {
    var instance = new NodeInstance([], scriptContents + '\nprocess._rawDebug(\'started\');', undefined);
    var msg = 'Timed out waiting for process to start';
    while ((await common.fires(instance.nextStderrString(), msg, TIMEOUT)) !== 'started') {}
    process._debugProcess(instance._process.pid);
    return instance;
  };

  NodeInstance.prototype.onStderrLine = function onStderrLine(line) {
    console.log('[err]', line);
    if (this._portCallback) {
      var matches = line.match(/Debugger listening on ws:\/\/.+:(\d+)\/.+/);
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
  };

  NodeInstance.prototype.httpGet = function httpGet(host, path) {
    console.log('[test]', 'Testing ' + path);
    return this.portPromise.then(function (port) {
      return new Promise(function (resolve, reject) {
        var req = http.get({ host: host, port: port, path: path }, function (res) {
          var response = '';
          res.setEncoding('utf8');
          res.on('data', function (data) {
            return response += data.toString();
          }).on('end', function () {
            resolve(response);
          });
        });
        req.on('error', reject);
      });
    }).then(function (response) {
      try {
        return JSON.parse(response);
      } catch (e) {
        e.body = response;
        throw e;
      }
    });
  };

  NodeInstance.prototype.wsHandshake = function wsHandshake(devtoolsUrl) {
    var _this8 = this;

    return this.portPromise.then(function (port) {
      return new Promise(function (resolve) {
        http.get({
          port: port,
          path: url.parse(devtoolsUrl).path,
          headers: {
            'Connection': 'Upgrade',
            'Upgrade': 'websocket',
            'Sec-WebSocket-Version': 13,
            'Sec-WebSocket-Key': 'key=='
          }
        }).on('upgrade', function (message, socket) {
          resolve(new InspectorSession(socket, _this8));
        }).on('response', common.mustNotCall('Upgrade was not received'));
      });
    });
  };

  NodeInstance.prototype.connectInspectorSession = async function connectInspectorSession() {
    console.log('[test]', 'Connecting to a child Node process');
    var response = await this.httpGet(null, '/json/list');
    var url = response[0]['webSocketDebuggerUrl'];
    return this.wsHandshake(url);
  };

  NodeInstance.prototype.expectShutdown = function expectShutdown() {
    return this._shutdownPromise;
  };

  NodeInstance.prototype.nextStderrString = function nextStderrString() {
    var _this9 = this;

    if (this._unprocessedStderrLines.length) return Promise.resolve(this._unprocessedStderrLines.shift());
    return new Promise(function (resolve) {
      return _this9._stderrLineCallback = resolve;
    });
  };

  NodeInstance.prototype.kill = function kill() {
    this._process.kill();
  };

  return NodeInstance;
}();

function readMainScriptSource() {
  return fs.readFileSync(_MAINSCRIPT, 'utf8');
}

module.exports = {
  mainScriptPath: _MAINSCRIPT,
  readMainScriptSource: readMainScriptSource,
  NodeInstance: NodeInstance
};

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}