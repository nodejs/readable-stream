/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/

var async_wrap = process.binding('async_wrap');
var uv = process.binding('uv');
var assert = require('assert/');
var common = require('../common');
var dgram = require('dgram');
var fs = require('fs');
var net = require('net');
var tls = require('tls');
var providers = Object.keys(async_wrap.Providers);
var flags = 0;

// Make sure all asserts have run at least once.
process.on('exit', function () {
  return assert.equal(flags, 0b111);
});

function init(id, provider) {
  this._external; // Test will abort if nullptr isn't properly checked.
  switch (providers[provider]) {
    case 'TCPWRAP':
      assert.equal(this.fd, uv.UV_EINVAL);
      flags |= 0b1;
      break;
    case 'TLSWRAP':
      assert.equal(this.fd, uv.UV_EINVAL);
      flags |= 0b10;
      break;
    case 'UDPWRAP':
      assert.equal(this.fd, uv.UV_EBADF);
      flags |= 0b100;
      break;
  }
}

async_wrap.setupHooks({ init });
async_wrap.enable();

var checkTLS = common.mustCall(function checkTLS() {
  var options = {
    key: fs.readFileSync(common.fixturesDir + '/keys/ec-key.pem'),
    cert: fs.readFileSync(common.fixturesDir + '/keys/ec-cert.pem')
  };
  var server = tls.createServer(options, function () {}).listen(common.PORT, function () {
    tls.connect(common.PORT, { rejectUnauthorized: false }, function () {
      this.destroy();
      server.close();
    });
  });
});

var checkTCP = common.mustCall(function checkTCP() {
  net.createServer(function () {}).listen(common.PORT, function () {
    this.close(checkTLS);
  });
});

dgram.createSocket('udp4').close(checkTCP);