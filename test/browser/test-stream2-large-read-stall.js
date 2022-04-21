'use strict'

const test = require('tape')
const { Readable } = require('../../lib/ours/index')

test('large object read stall', function (t) {
  t.plan(1)

  // If everything aligns so that you do a read(n) of exactly the
  // remaining buffer, then make sure that 'end' still emits.

  const READSIZE = 100
  const PUSHSIZE = 20
  const PUSHCOUNT = 1000
  const HWM = 50

  const r = new Readable({
    highWaterMark: HWM
  })
  const rs = r._readableState

  r._read = push

  r.on('readable', function () {
    false && console.error('>> readable')
    do {
      false && console.error('  > read(%d)', READSIZE)
      var ret = r.read(READSIZE)
      false && console.error('  < %j (%d remain)', ret && ret.length, rs.length)
    } while (ret && ret.length === READSIZE)

    false && console.error('<< after read()', ret && ret.length, rs.needReadable, rs.length)
  })

  r.on('end', function () {
    t.equal(pushes, PUSHCOUNT + 1)

    false && console.error('end')
  })

  let pushes = 0
  function push() {
    if (pushes > PUSHCOUNT) {
      return
    }

    if (pushes++ === PUSHCOUNT) {
      false && console.error('   push(EOF)')
      return r.push(null)
    }

    false && console.error('   push #%d', pushes)
    if (r.push(Buffer.alloc(PUSHSIZE))) {
      setTimeout(push)
    }
  }

  // start the flow
  r.read(0)
})
