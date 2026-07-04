'use strict'

// Counts the process.nextTick() hops incurred by ONE short-lived, flowing
// PassThrough -> Transform unit (the shape produced e.g. by a per-request or
// per-file streaming pipeline). It also breaks the hops down by call site so
// the redundant endReadableNT() scheduling is visible.
//
// Run it on the base branch and on this branch:
//
//   git stash && node benchmark/endReadable-ticks.js   # base
//   git stash pop && node benchmark/endReadable-ticks.js   # patched
//
// Expected (objectMode, K=4 chunks):
//   base    : 15 hops total, endReadable scheduled 5x
//   patched : 12 hops total, endReadable scheduled 2x
//
// The 3 removed hops are duplicate endReadableNT() ticks; 'end' still fires
// exactly once, on the same tick, so behaviour is unchanged.

const { PassThrough, Transform } = require('..')

const sites = new Map()
let count = 0
const realNextTick = process.nextTick.bind(process)
process.nextTick = function (fn, ...args) {
  count++
  const stack = new Error().stack
    .split('\n')
    .slice(2, 5)
    .map((l) =>
      l
        .trim()
        .replace(/\(.*streams\//, '(')
        .replace(/:\d+\)$/, ')')
    )
    .join(' <- ')
  sites.set(stack, (sites.get(stack) || 0) + 1)
  return realNextTick(fn, ...args)
}

const K = parseInt(process.argv[2] || '4', 10)

function oneUnit() {
  return new Promise((resolve, reject) => {
    const src = new PassThrough({ objectMode: true })
    const xform = new Transform({
      objectMode: true,
      transform(c, e, cb) {
        cb(null, c)
      }
    })
    src.pipe(xform)
    xform.on('data', () => {})
    xform.on('end', resolve)
    xform.on('error', reject)
    for (let i = 0; i < K; i++) src.write({ n: i, s: 'term' + i })
    src.end()
  })
}

oneUnit().then(() => {
  process.nextTick = realNextTick
  let endReadableHops = 0
  for (const [site, n] of sites) {
    if (site.startsWith('at endReadable (')) endReadableHops += n
  }
  console.log(`nextTick hops for ONE unit (K=${K} chunks): ${count}`)
  console.log(`  of which endReadableNT() scheduled by endReadable(): ${endReadableHops}`)
  console.log('per call site:')
  const rows = [...sites.entries()].sort((a, b) => b[1] - a[1])
  for (const [site, n] of rows) console.log(`  ${n}x  ${site}`)
})
