import { reportSuccess, reportError, reportLog } from './lib/reporting.mjs'
import { createBankStream } from './lib/bank.mjs'
import { createCollectorStream } from './lib/collector.mjs'

const DATA_SIZE = 512

async function test() {
  await reportLog('Generating test data...')

  const expected = new Uint8Array(DATA_SIZE)
  window.crypto.getRandomValues(expected)

  await reportLog('Creating input stream...')
  const readable = createBankStream(expected)

  await reportLog('Creating output stream...')
  const writable = createCollectorStream()

  await reportLog('Piping...')
  await new Promise((resolve, reject) => {
    readable.pipe(writable)
      .on('finish', resolve)
      .on('error', reject)
  })

  await reportLog('Comparing...')
  const retrieved = writable.collect()
  if (retrieved.length !== DATA_SIZE) {
    throw new Error(`Expected output data of length ${DATA_SIZE}, got ${retrieved.length}`)
  }

  let nMatch = 0
  let firstNonMatch = -1
  for (let i = 0; i < DATA_SIZE; i++) {
    if (expected[i] === retrieved[i]) {
      nMatch++
    } else if (firstNonMatch === -1) {
      firstNonMatch = i
    }
  }

  if (firstNonMatch === -1) {
    await reportLog('100% match!')
  } else {
    await reportLog(`expected: ${expected}`)
    await reportLog(`actual: ${retrieved}`)

    const percent = (nMatch / DATA_SIZE) * 100
    throw new Error(`${percent.toFixed(2)}% match (first mismatch at position ${firstNonMatch})`)
  }
}

(async () => {
  await test()
  await reportSuccess()
})().catch(reportError)
