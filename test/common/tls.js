"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

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


var crypto = require('crypto');

var net = require('net');

exports.ccs = Buffer.from('140303000101', 'hex');

var TestTLSSocket = /*#__PURE__*/function (_net$Socket) {
  _inherits(TestTLSSocket, _net$Socket);

  var _super = _createSuper(TestTLSSocket);

  function TestTLSSocket(server_cert) {
    var _this;

    _classCallCheck(this, TestTLSSocket);

    _this = _super.call(this);
    _this.server_cert = server_cert;
    _this.version = Buffer.from('0303', 'hex');
    _this.handshake_list = []; // AES128-GCM-SHA256

    _this.ciphers = Buffer.from('000002009c0', 'hex');
    _this.pre_master_secret = Buffer.concat([_this.version, crypto.randomBytes(46)]);
    _this.master_secret = null;
    _this.write_seq = 0;
    _this.client_random = crypto.randomBytes(32);

    _this.on('handshake', function (msg) {
      _this.handshake_list.push(msg);
    });

    _this.on('server_random', function (server_random) {
      _this.master_secret = PRF12('sha256', _this.pre_master_secret, 'master secret', Buffer.concat([_this.client_random, server_random]), 48);
      var key_block = PRF12('sha256', _this.master_secret, 'key expansion', Buffer.concat([server_random, _this.client_random]), 40);
      _this.client_writeKey = key_block.slice(0, 16);
      _this.client_writeIV = key_block.slice(32, 36);
    });

    return _this;
  }

  _createClass(TestTLSSocket, [{
    key: "createClientHello",
    value: function createClientHello() {
      var compressions = Buffer.from('0100', 'hex'); // null

      var msg = addHandshakeHeader(0x01, Buffer.concat([this.version, this.client_random, this.ciphers, compressions]));
      this.emit('handshake', msg);
      return addRecordHeader(0x16, msg);
    }
  }, {
    key: "createClientKeyExchange",
    value: function createClientKeyExchange() {
      var encrypted_pre_master_secret = crypto.publicEncrypt({
        key: this.server_cert,
        padding: crypto.constants.RSA_PKCS1_PADDING
      }, this.pre_master_secret);
      var length = Buffer.alloc(2);
      length.writeUIntBE(encrypted_pre_master_secret.length, 0, 2);
      var msg = addHandshakeHeader(0x10, Buffer.concat([length, encrypted_pre_master_secret]));
      this.emit('handshake', msg);
      return addRecordHeader(0x16, msg);
    }
  }, {
    key: "createFinished",
    value: function createFinished() {
      var shasum = crypto.createHash('sha256');
      shasum.update(Buffer.concat(this.handshake_list));
      var message_hash = shasum.digest();
      var r = PRF12('sha256', this.master_secret, 'client finished', message_hash, 12);
      var msg = addHandshakeHeader(0x14, r);
      this.emit('handshake', msg);
      return addRecordHeader(0x16, msg);
    }
  }, {
    key: "createIllegalHandshake",
    value: function createIllegalHandshake() {
      var illegal_handshake = Buffer.alloc(5);
      return addRecordHeader(0x16, illegal_handshake);
    }
  }, {
    key: "parseTLSFrame",
    value: function parseTLSFrame(buf) {
      var offset = 0;
      var record = buf.slice(offset, 5);
      var type = record[0];
      var length = record.slice(3, 5).readUInt16BE(0);
      offset += 5;
      var remaining = buf.slice(offset, offset + length);

      if (type === 0x16) {
        do {
          remaining = this.parseTLSHandshake(remaining);
        } while (remaining.length > 0);
      }

      offset += length;
      return buf.slice(offset);
    }
  }, {
    key: "parseTLSHandshake",
    value: function parseTLSHandshake(buf) {
      var offset = 0;
      var handshake_type = buf[offset];

      if (handshake_type === 0x02) {
        var server_random = buf.slice(6, 6 + 32);
        this.emit('server_random', server_random);
      }

      offset += 1;
      var length = buf.readUIntBE(offset, 3);
      offset += 3;
      var handshake = buf.slice(0, offset + length);
      this.emit('handshake', handshake);
      offset += length;
      var remaining = buf.slice(offset);
      return remaining;
    }
  }, {
    key: "encrypt",
    value: function encrypt(plain) {
      var type = plain.slice(0, 1);
      var version = plain.slice(1, 3);
      var nonce = crypto.randomBytes(8);
      var iv = Buffer.concat([this.client_writeIV.slice(0, 4), nonce]);
      var bob = crypto.createCipheriv('aes-128-gcm', this.client_writeKey, iv);
      var write_seq = Buffer.alloc(8);
      write_seq.writeUInt32BE(this.write_seq++, 4);
      var aad = Buffer.concat([write_seq, plain.slice(0, 5)]);
      bob.setAAD(aad);
      var encrypted1 = bob.update(plain.slice(5));
      var encrypted = Buffer.concat([encrypted1, bob.final()]);
      var tag = bob.getAuthTag();
      var length = Buffer.alloc(2);
      length.writeUInt16BE(nonce.length + encrypted.length + tag.length, 0);
      return Buffer.concat([type, version, length, nonce, encrypted, tag]);
    }
  }]);

  return TestTLSSocket;
}(net.Socket);

function addRecordHeader(type, frame) {
  var record_layer = Buffer.from('0003030000', 'hex');
  record_layer[0] = type;
  record_layer.writeUInt16BE(frame.length, 3);
  return Buffer.concat([record_layer, frame]);
}

function addHandshakeHeader(type, msg) {
  var handshake_header = Buffer.alloc(4);
  handshake_header[0] = type;
  handshake_header.writeUIntBE(msg.length, 1, 3);
  return Buffer.concat([handshake_header, msg]);
}

function PRF12(algo, secret, label, seed, size) {
  var newSeed = Buffer.concat([Buffer.from(label, 'utf8'), seed]);
  return P_hash(algo, secret, newSeed, size);
}

function P_hash(algo, secret, seed, size) {
  var result = Buffer.alloc(size);
  var hmac = crypto.createHmac(algo, secret);
  hmac.update(seed);
  var a = hmac.digest();
  var j = 0;

  while (j < size) {
    hmac = crypto.createHmac(algo, secret);
    hmac.update(a);
    hmac.update(seed);
    var b = hmac.digest();
    var todo = b.length;

    if (j + todo > size) {
      todo = size - j;
    }

    b.copy(result, j, 0, todo);
    j += todo;
    hmac = crypto.createHmac(algo, secret);
    hmac.update(a);
    a = hmac.digest();
  }

  return result;
}

exports.TestTLSSocket = TestTLSSocket;

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}