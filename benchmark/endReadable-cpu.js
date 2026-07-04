'use strict'

// CPU throughput for a wave of short-lived, flowing PassThrough -> Transform
// units (the endReadableNT teardown-tick shape). Reports CPU time from
// process.cpuUsage() (an OS counter), which is more stable than wall time on a
// loaded/shared machine. Run on the base branch and on this branch to compare:
//
//   git stash && node --expose-gc benchmark/endReadable-cpu.js
//   git stash pop && node --expose-gc benchmark/endReadable-cpu.js
//
// Args: [units] [chunksPerUnit] [reps]

const { PassThrough, Transform } = require('..')

const N = parseInt(process.argv[2] || '8000', 10)
const K = parseInt(process.argv[3] || '4', 10)
const reps = parseInt(process.argv[4] || '15', 10)

function oneUnit() {
  return new Promise((resolve, reject) => {
    const src = new PassThrough({ objectMode: true })
    const xform = new Transform({
      objectMode: true,
      transform(c, e, cb) {
        cb(null, c)
      }
    })
    let sink = 0
    src.pipe(xform)
    xform.on('data', (d) => {
      sink += (d && d.n) | 0
    })
    xform.on('end', () => resolve(sink))
    xform.on('error', reject)
    for (let i = 0; i < K; i++) src.write({ n: i, s: 'term' + i })
    src.end()
  })
}

async function workload() {
  const WAVE = 32
  for (let i = 0; i < N; i += WAVE) {
    const batch = []
    for (let j = i; j < Math.min(i + WAVE, N); j++) batch.push(oneUnit())
    await Promise.all(batch)
  }
}

async function measure() {
  if (global.gc) global.gc()
  const c0 = process.cpuUsage()
  await workload()
  const c1 = process.cpuUsage(c0)
  return (c1.user + c1.system) / 1000 // ms of CPU
}

async function main() {
  await workload() // warm up
  await workload()
  const samples = []
  for (let r = 0; r < reps; r++) samples.push(await measure())
  samples.sort((a, b) => a - b)
  const med = samples[samples.length >> 1]
  console.log(
    JSON.stringify({
      units: N,
      chunksPerUnit: K,
      reps,
      cpuMedianMs: +med.toFixed(1),
      usPerUnit: +((med * 1000) / N).toFixed(2)
    })
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
