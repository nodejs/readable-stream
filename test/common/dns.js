"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/*<replacement>*/
require('@babel/polyfill');
var util = require('util');
for (var i in util) exports[i] = util[i];
/*</replacement>*/ /* eslint-disable node-core/required-modules */
'use strict';

/*<replacement>*/
var objectKeys = objectKeys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
};
/*</replacement>*/

const assert = require('assert');
const os = require('os');
const types = {
  A: 1,
  AAAA: 28,
  NS: 2,
  CNAME: 5,
  SOA: 6,
  PTR: 12,
  MX: 15,
  TXT: 16,
  ANY: 255
};
const classes = {
  IN: 1
};

// Naïve DNS parser/serializer.

function readDomainFromPacket(buffer, offset) {
  assert.ok(offset < buffer.length);
  const length = buffer[offset];
  if (length === 0) {
    return {
      nread: 1,
      domain: ''
    };
  } else if ((length & 0xC0) === 0) {
    offset += 1;
    const chunk = buffer.toString('ascii', offset, offset + length);
    // Read the rest of the domain.
    const _readDomainFromPacket = readDomainFromPacket(buffer, offset + length),
      nread = _readDomainFromPacket.nread,
      domain = _readDomainFromPacket.domain;
    return {
      nread: 1 + length + nread,
      domain: domain ? `${chunk}.${domain}` : chunk
    };
  } else {
    // Pointer to another part of the packet.
    assert.strictEqual(length & 0xC0, 0xC0);
    // eslint-disable-next-line space-infix-ops, space-unary-ops
    const pointeeOffset = buffer.readUInt16BE(offset) & ~0xC000;
    return {
      nread: 2,
      domain: readDomainFromPacket(buffer, pointeeOffset)
    };
  }
}
function parseDNSPacket(buffer) {
  assert.ok(buffer.length > 12);
  const parsed = {
    id: buffer.readUInt16BE(0),
    flags: buffer.readUInt16BE(2)
  };
  const counts = [['questions', buffer.readUInt16BE(4)], ['answers', buffer.readUInt16BE(6)], ['authorityAnswers', buffer.readUInt16BE(8)], ['additionalRecords', buffer.readUInt16BE(10)]];
  let offset = 12;
  for (var _i = 0, _counts = counts; _i < _counts.length; _i++) {
    const _counts$_i = _slicedToArray(_counts[_i], 2),
      sectionName = _counts$_i[0],
      count = _counts$_i[1];
    parsed[sectionName] = [];
    for (let i = 0; i < count; ++i) {
      const _readDomainFromPacket2 = readDomainFromPacket(buffer, offset),
        nread = _readDomainFromPacket2.nread,
        domain = _readDomainFromPacket2.domain;
      offset += nread;
      const type = buffer.readUInt16BE(offset);
      const rr = {
        domain,
        cls: buffer.readUInt16BE(offset + 2)
      };
      offset += 4;
      for (const name in types) {
        if (types[name] === type) rr.type = name;
      }
      if (sectionName !== 'questions') {
        rr.ttl = buffer.readInt32BE(offset);
        const dataLength = buffer.readUInt16BE(offset);
        offset += 6;
        switch (type) {
          case types.A:
            assert.strictEqual(dataLength, 4);
            rr.address = `${buffer[offset + 0]}.${buffer[offset + 1]}.` + `${buffer[offset + 2]}.${buffer[offset + 3]}`;
            break;
          case types.AAAA:
            assert.strictEqual(dataLength, 16);
            rr.address = buffer.toString('hex', offset, offset + 16).replace(/(.{4}(?!$))/g, '$1:');
            break;
          case types.TXT:
            {
              let position = offset;
              rr.entries = [];
              while (position < offset + dataLength) {
                const txtLength = buffer[offset];
                rr.entries.push(buffer.toString('utf8', position + 1, position + 1 + txtLength));
                position += 1 + txtLength;
              }
              assert.strictEqual(position, offset + dataLength);
              break;
            }
          case types.MX:
            {
              rr.priority = buffer.readInt16BE(buffer, offset);
              offset += 2;
              const _readDomainFromPacket3 = readDomainFromPacket(buffer, offset),
                nread = _readDomainFromPacket3.nread,
                domain = _readDomainFromPacket3.domain;
              rr.exchange = domain;
              assert.strictEqual(nread, dataLength);
              break;
            }
          case types.NS:
          case types.CNAME:
          case types.PTR:
            {
              const _readDomainFromPacket4 = readDomainFromPacket(buffer, offset),
                nread = _readDomainFromPacket4.nread,
                domain = _readDomainFromPacket4.domain;
              rr.value = domain;
              assert.strictEqual(nread, dataLength);
              break;
            }
          case types.SOA:
            {
              const mname = readDomainFromPacket(buffer, offset);
              const rname = readDomainFromPacket(buffer, offset + mname.nread);
              rr.nsname = mname.domain;
              rr.hostmaster = rname.domain;
              const trailerOffset = offset + mname.nread + rname.nread;
              rr.serial = buffer.readUInt32BE(trailerOffset);
              rr.refresh = buffer.readUInt32BE(trailerOffset + 4);
              rr.retry = buffer.readUInt32BE(trailerOffset + 8);
              rr.expire = buffer.readUInt32BE(trailerOffset + 12);
              rr.minttl = buffer.readUInt32BE(trailerOffset + 16);
              assert.strictEqual(trailerOffset + 20, dataLength);
              break;
            }
          default:
            throw new Error(`Unknown RR type ${rr.type}`);
        }
        offset += dataLength;
      }
      parsed[sectionName].push(rr);
      assert.ok(offset <= buffer.length);
    }
  }
  assert.strictEqual(offset, buffer.length);
  return parsed;
}
function writeIPv6(ip) {
  const parts = ip.replace(/^:|:$/g, '').split(':');
  const buf = Buffer.alloc(16);
  let offset = 0;
  var _iterator = _createForOfIteratorHelper(parts),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      const part = _step.value;
      if (part === '') {
        offset += 16 - 2 * (parts.length - 1);
      } else {
        buf.writeUInt16BE(parseInt(part, 16), offset);
        offset += 2;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return buf;
}
function writeDomainName(domain) {
  return Buffer.concat(domain.split('.').map(label => {
    assert(label.length < 64);
    return Buffer.concat([Buffer.from([label.length]), Buffer.from(label, 'ascii')]);
  }).concat([Buffer.alloc(1)]));
}
function writeDNSPacket(parsed) {
  const buffers = [];
  const kStandardResponseFlags = 0x8180;
  buffers.push(new Uint16Array([parsed.id, parsed.flags === undefined ? kStandardResponseFlags : parsed.flags, parsed.questions && parsed.questions.length, parsed.answers && parsed.answers.length, parsed.authorityAnswers && parsed.authorityAnswers.length, parsed.additionalRecords && parsed.additionalRecords.length]));
  var _iterator2 = _createForOfIteratorHelper(parsed.questions),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      const q = _step2.value;
      assert(types[q.type]);
      buffers.push(writeDomainName(q.domain));
      buffers.push(new Uint16Array([types[q.type], q.cls === undefined ? classes.IN : q.cls]));
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  var _iterator3 = _createForOfIteratorHelper([].concat(parsed.answers, parsed.authorityAnswers, parsed.additionalRecords)),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      const rr = _step3.value;
      if (!rr) continue;
      assert(types[rr.type]);
      buffers.push(writeDomainName(rr.domain));
      buffers.push(new Uint16Array([types[rr.type], rr.cls === undefined ? classes.IN : rr.cls]));
      buffers.push(new Int32Array([rr.ttl]));
      const rdLengthBuf = new Uint16Array(1);
      buffers.push(rdLengthBuf);
      switch (rr.type) {
        case 'A':
          rdLengthBuf[0] = 4;
          buffers.push(new Uint8Array(rr.address.split('.')));
          break;
        case 'AAAA':
          rdLengthBuf[0] = 16;
          buffers.push(writeIPv6(rr.address));
          break;
        case 'TXT':
          const total = rr.entries.map(s => s.length).reduce((a, b) => a + b);
          // Total length of all strings + 1 byte each for their lengths.
          rdLengthBuf[0] = rr.entries.length + total;
          var _iterator4 = _createForOfIteratorHelper(rr.entries),
            _step4;
          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              const txt = _step4.value;
              buffers.push(new Uint8Array([Buffer.byteLength(txt)]));
              buffers.push(Buffer.from(txt));
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
          break;
        case 'MX':
          rdLengthBuf[0] = 2;
          buffers.push(new Uint16Array([rr.priority]));
        // fall through
        case 'NS':
        case 'CNAME':
        case 'PTR':
          {
            const domain = writeDomainName(rr.exchange || rr.value);
            rdLengthBuf[0] += domain.length;
            buffers.push(domain);
            break;
          }
        case 'SOA':
          {
            const mname = writeDomainName(rr.nsname);
            const rname = writeDomainName(rr.hostmaster);
            rdLengthBuf[0] = mname.length + rname.length + 20;
            buffers.push(mname, rname);
            buffers.push(new Uint32Array([rr.serial, rr.refresh, rr.retry, rr.expire, rr.minttl]));
            break;
          }
        default:
          throw new Error(`Unknown RR type ${rr.type}`);
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  return Buffer.concat(buffers.map(typedArray => {
    const buf = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    if (os.endianness() === 'LE') {
      if (typedArray.BYTES_PER_ELEMENT === 2) buf.swap16();
      if (typedArray.BYTES_PER_ELEMENT === 4) buf.swap32();
    }
    return buf;
  }));
}
const mockedErrorCode = 'ENOTFOUND';
const mockedSysCall = 'getaddrinfo';
function errorLookupMock() {
  let code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mockedErrorCode;
  let syscall = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mockedSysCall;
  return function lookupWithError(hostname, dnsopts, cb) {
    const err = new Error(`${syscall} ${code} ${hostname}`);
    err.code = code;
    err.errno = code;
    err.syscall = syscall;
    err.hostname = hostname;
    cb(err);
  };
}
module.exports = {
  types,
  classes,
  writeDNSPacket,
  parseDNSPacket,
  errorLookupMock,
  mockedErrorCode,
  mockedSysCall
};
function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}