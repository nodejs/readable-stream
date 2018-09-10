'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

var common = require('../common');
if (!common.hasCrypto) common.skip('missing crypto');

var _require = require('../../'),
    Stream = _require.Stream,
    Writable = _require.Writable,
    Readable = _require.Readable,
    Transform = _require.Transform,
    pipeline = _require.pipeline;

var assert = require('assert/');
var http = require('http');
var http2 = {
  createServer: function () {
    return {
      listen: function () {}
    };
  }
};
var promisify = require('util-promisify');

{
  var finished = false;
  var processed = [];
  var expected = [bufferShim.from('a'), bufferShim.from('b'), bufferShim.from('c')];

  var read = new Readable({
    read: function () {}
  });

  var write = new Writable({
    write: function (data, enc, cb) {
      processed.push(data);
      cb();
    }
  });

  write.on('finish', function () {
    finished = true;
  });

  for (var i = 0; i < expected.length; i++) {
    read.push(expected[i]);
  }
  read.push(null);

  pipeline(read, write, common.mustCall(function (err) {
    assert.ok(!err, 'no error');
    assert.ok(finished);
    assert.deepStrictEqual(processed, expected);
  }));
}

{
  var _read = new Readable({
    read: function () {}
  });

  assert.throws(function () {
    pipeline(_read, function () {});
  }, /ERR_MISSING_ARGS/);
  assert.throws(function () {
    pipeline(function () {});
  }, /ERR_MISSING_ARGS/);
  assert.throws(function () {
    pipeline();
  }, /ERR_MISSING_ARGS/);
}

{
  var _read2 = new Readable({
    read: function () {}
  });

  var _write = new Writable({
    write: function (data, enc, cb) {
      cb();
    }
  });

  _read2.push('data');
  setImmediate(function () {
    return _read2.destroy();
  });

  pipeline(_read2, _write, common.mustCall(function (err) {
    assert.ok(err, 'should have an error');
  }));
}

{
  var _read3 = new Readable({
    read: function () {}
  });

  var _write2 = new Writable({
    write: function (data, enc, cb) {
      cb();
    }
  });

  _read3.push('data');
  setImmediate(function () {
    return _read3.destroy(new Error('kaboom'));
  });

  var dst = pipeline(_read3, _write2, common.mustCall(function (err) {
    assert.strictEqual(err.message, 'kaboom');
  }));

  assert.strictEqual(dst, _write2);
}

{
  var _read4 = new Readable({
    read: function () {}
  });

  var transform = new Transform({
    transform: function (data, enc, cb) {
      process.nextTick(cb, new Error('kaboom'));
    }
  });

  var _write3 = new Writable({
    write: function (data, enc, cb) {
      cb();
    }
  });

  _read4.on('close', common.mustCall());
  transform.on('close', common.mustCall());
  _write3.on('close', common.mustCall());

  var _dst = pipeline(_read4, transform, _write3, common.mustCall(function (err) {
    assert.strictEqual(err.message, 'kaboom');
  }));

  assert.strictEqual(_dst, _write3);

  _read4.push('hello');
}

{
  var server = http.createServer(function (req, res) {
    var rs = new Readable({
      read: function () {
        rs.push('hello');
        rs.push(null);
      }
    });

    pipeline(rs, res, function () {});
  });

  server.listen(0, function () {
    var req = http.request({
      port: server.address().port
    });

    req.end();
    req.on('response', function (res) {
      var buf = [];
      res.on('data', function (data) {
        return buf.push(data);
      });
      res.on('end', common.mustCall(function () {
        assert.deepStrictEqual(Buffer.concat(buf), bufferShim.from('hello'));
        server.close();
      }));
    });
  });
}

{
  var _server = http.createServer(function (req, res) {
    var sent = false;
    var rs = new Readable({
      read: function () {
        if (sent) {
          return;
        }
        sent = true;
        rs.push('hello');
      },

      destroy: common.mustCall(function (err, cb) {
        // prevents fd leaks by destroying http pipelines
        cb();
      })
    });

    pipeline(rs, res, function () {});
  });

  _server.listen(0, function () {
    var req = http.request({
      port: _server.address().port
    });

    req.end();
    req.on('response', function (res) {
      setImmediate(function () {
        res.destroy();
        _server.close();
      });
    });
  });
}

{
  var _server2 = http.createServer(function (req, res) {
    var sent = 0;
    var rs = new Readable({
      read: function () {
        if (sent++ > 10) {
          return;
        }
        rs.push('hello');
      },

      destroy: common.mustCall(function (err, cb) {
        cb();
      })
    });

    pipeline(rs, res, function () {});
  });

  var cnt = 10;

  var badSink = new Writable({
    write: function (data, enc, cb) {
      cnt--;
      if (cnt === 0) process.nextTick(cb, new Error('kaboom'));else cb();
    }
  });

  _server2.listen(0, function () {
    var req = http.request({
      port: _server2.address().port
    });

    req.end();
    req.on('response', function (res) {
      pipeline(res, badSink, common.mustCall(function (err) {
        assert.strictEqual(err.message, 'kaboom');
        _server2.close();
      }));
    });
  });
}

{
  var _server3 = http.createServer(function (req, res) {
    pipeline(req, res, common.mustCall());
  });

  _server3.listen(0, function () {
    var req = http.request({
      port: _server3.address().port
    });

    var sent = 0;
    var rs = new Readable({
      read: function () {
        if (sent++ > 10) {
          return;
        }
        rs.push('hello');
      }
    });

    pipeline(rs, req, common.mustCall(function () {
      _server3.close();
    }));

    req.on('response', function (res) {
      var cnt = 10;
      res.on('data', function () {
        cnt--;
        if (cnt === 0) rs.destroy();
      });
    });
  });
}

{
  var _server4 = http2.createServer(function (req, res) {
    pipeline(req, res, common.mustCall());
  });

  _server4.listen(0, function () {
    var url = 'http://localhost:' + _server4.address().port;
    var client = http2.connect(url);
    var req = client.request({ ':method': 'POST' });

    var rs = new Readable({
      read: function () {
        rs.push('hello');
      }
    });

    pipeline(rs, req, common.mustCall(function (err) {
      _server4.close();
      client.close();
    }));

    var cnt = 10;
    req.on('data', function (data) {
      cnt--;
      if (cnt === 0) rs.destroy();
    });
  });
}

{
  var makeTransform = function () {
    var tr = new Transform({
      transform: function (data, enc, cb) {
        cb(null, data);
      }
    });

    tr.on('close', common.mustCall());
    return tr;
  };

  var rs = new Readable({
    read: function () {
      rs.push('hello');
    }
  });

  var _cnt = 10;

  var ws = new Writable({
    write: function (data, enc, cb) {
      _cnt--;
      if (_cnt === 0) return process.nextTick(cb, new Error('kaboom'));
      cb();
    }
  });

  rs.on('close', common.mustCall());
  ws.on('close', common.mustCall());

  pipeline(rs, makeTransform(), makeTransform(), makeTransform(), makeTransform(), makeTransform(), makeTransform(), ws, common.mustCall(function (err) {
    assert.strictEqual(err.message, 'kaboom');
  }));
}

{
  var oldStream = new Stream();

  oldStream.pause = oldStream.resume = function () {};
  oldStream.write = function (data) {
    oldStream.emit('data', data);
    return true;
  };
  oldStream.end = function () {
    oldStream.emit('end');
  };

  var _expected = [bufferShim.from('hello'), bufferShim.from('world')];

  var _rs = new Readable({
    read: function () {
      for (var _i = 0; _i < _expected.length; _i++) {
        _rs.push(_expected[_i]);
      }
      _rs.push(null);
    }
  });

  var _ws = new Writable({
    write: function (data, enc, cb) {
      assert.deepStrictEqual(data, _expected.shift());
      cb();
    }
  });

  var _finished = false;

  _ws.on('finish', function () {
    _finished = true;
  });

  pipeline(_rs, oldStream, _ws, common.mustCall(function (err) {
    assert(!err, 'no error');
    assert(_finished, 'last stream finished');
  }));
}

{
  var _oldStream = new Stream();

  _oldStream.pause = _oldStream.resume = function () {};
  _oldStream.write = function (data) {
    _oldStream.emit('data', data);
    return true;
  };
  _oldStream.end = function () {
    _oldStream.emit('end');
  };

  var destroyableOldStream = new Stream();

  destroyableOldStream.pause = destroyableOldStream.resume = function () {};
  destroyableOldStream.destroy = common.mustCall(function () {
    destroyableOldStream.emit('close');
  });
  destroyableOldStream.write = function (data) {
    destroyableOldStream.emit('data', data);
    return true;
  };
  destroyableOldStream.end = function () {
    destroyableOldStream.emit('end');
  };

  var _rs2 = new Readable({
    read: function () {
      _rs2.destroy(new Error('stop'));
    }
  });

  var _ws2 = new Writable({
    write: function (data, enc, cb) {
      cb();
    }
  });

  var _finished2 = false;

  _ws2.on('finish', function () {
    _finished2 = true;
  });

  pipeline(_rs2, _oldStream, destroyableOldStream, _ws2, common.mustCall(function (err) {
    assert.deepStrictEqual(err, new Error('stop'));
    assert(!_finished2, 'should not finish');
  }));
}

{
  var run = function () {
    var _ref = _asyncToGenerator(function* () {
      var read = new Readable({
        read: function () {}
      });

      var write = new Writable({
        write: function (data, enc, cb) {
          cb();
        }
      });

      read.push('data');
      read.push(null);

      var finished = false;

      write.on('finish', function () {
        finished = true;
      });

      yield pipelinePromise(read, write);

      assert(finished);
    });

    return function run() {
      return _ref.apply(this, arguments);
    };
  }();

  var pipelinePromise = promisify(pipeline);

  run();
}

{
  var _read5 = new Readable({
    read: function () {}
  });

  var _transform = new Transform({
    transform: function (data, enc, cb) {
      process.nextTick(cb, new Error('kaboom'));
    }
  });

  var _write4 = new Writable({
    write: function (data, enc, cb) {
      cb();
    }
  });

  _read5.on('close', common.mustCall());
  _transform.on('close', common.mustCall());
  _write4.on('close', common.mustCall());

  process.on('uncaughtException', common.mustCall(function (err) {
    assert.strictEqual(err.message, 'kaboom');
  }));

  var _dst2 = pipeline(_read5, _transform, _write4);

  assert.strictEqual(_dst2, _write4);

  _read5.push('hello');
}
;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});