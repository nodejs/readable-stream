import { createReadStream } from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { Readable } from '../lib/ours/index.js'

const fst = createReadStream(fileURLToPath(new URL(import.meta.url)))
const rst = new Readable()

rst.wrap(fst)

rst.on('end', function () {
  process.stdin.pause()
})

console.log("Every time you press a key, you will see more contents of the source file. Let's begin!\n\n")
process.stdin.setRawMode(true)
process.stdin.on('data', function () {
  const c = rst.read(100)
  if (!c) {
    return setTimeout(process.exit, 500)
  }
  process.stdout.write(c)
})
process.stdin.resume()
