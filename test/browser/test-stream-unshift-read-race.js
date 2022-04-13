'use strict'

// This test verifies that:
// 1. unshift() does not cause colliding _read() calls.
// 2. unshift() after the 'end' event is an error, but after the EOF
//    signalling null, it is ok, and just creates a new readable chunk.
// 3. push() after the EOF signaling null is an error.
// 4. _read() is not called after pushing the EOF null chunk.

const test = require('tape')
const stream = require('../../lib')

test('unshift read race', function (t) {
  t.plan(139)

  const hwm = 10
  const r = stream.Readable({ highWaterMark: hwm })
  const chunks = 10

  const data = Buffer.alloc(chunks * hwm + Math.ceil(hwm / 2))
  for (let i = 0; i < data.length; i++) {
    const c = 'asdf'.charCodeAt(i % 4)
    data[i] = c
  }

  let pos = 0
  let pushedNull = false
  r._read = function (n) {
    t.notOk(pushedNull, '_read after null push')

    // every third chunk is fast
    push(!(chunks % 3))

    function push(fast) {
      t.notOk(pushedNull, 'push() after null push')
      const c = pos >= data.length ? null : data.slice(pos, pos + n)
      pushedNull = c === null
      if (fast) {
        pos += n
        r.push(c)
        if (c === null) {
          pushError()
        }
      } else {
        setTimeout(function () {
          pos += n
          r.push(c)
          if (c === null) {
            pushError()
          }
        }, 1)
      }
    }
  }

  function pushError() {
    r.unshift(Buffer.allocUnsafe(1))
    w.end()

    const onerror = global.onerror
    global.onerror = (_u1, _u2, _u3, _u4, gotErr) => {
      t.ok(true)
      global.onerror = onerror
    }

    r.push(Buffer.allocUnsafe(1))
  }

  const w = stream.Writable()
  const written = []
  w._write = function (chunk, encoding, cb) {
    written.push(chunk.toString())
    cb()
  }

  r.on('end', t.fail)

  r.on('readable', function () {
    let chunk
    while ((chunk = r.read(10)) !== null) {
      w.write(chunk)
      if (chunk.length > 4) {
        r.unshift(Buffer.from('1234'))
      }
    }
  })

  w.on('finish', function () {
    // each chunk should start with 1234, and then be asfdasdfasdf...
    // The first got pulled out before the first unshift('1234'), so it's
    // lacking that piece.
    t.equal(written[0], 'asdfasdfas')
    let asdf = 'd'

    // console.error('0: %s', written[0]);
    for (let i = 1; i < written.length; i++) {
      // console.error('%s: %s', i.toString(32), written[i]);
      t.equal(written[i].slice(0, 4), '1234')
      for (let j = 4; j < written[i].length; j++) {
        const c = written[i].charAt(j)
        t.equal(c, asdf)
        switch (asdf) {
          case 'a':
            asdf = 's'
            break
          case 's':
            asdf = 'd'
            break
          case 'd':
            asdf = 'f'
            break
          case 'f':
            asdf = 'a'
            break
        }
      }
    }

    t.equal(written.length, 18)
  })
})
