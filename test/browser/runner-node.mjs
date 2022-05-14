import { resolve } from 'node:path'
import { Duplex } from 'node:stream'
import { fileURLToPath } from 'node:url'
import reporter from 'tap-mocha-reporter'
import Parser from 'tap-parser'

const validBundlers = ['browserify', 'webpack', 'rollup']

function parseEnviroment() {
  const reporter = process.env.SKIP_REPORTER !== 'true'
  const bundler = process.argv[2] || process.env.BUNDLER

  if (!validBundlers.includes(bundler)) {
    console.error('Usage: node runner-node.mjs [browserify|webpack|rollup]')
    console.error('\nYou can also use the BUNDLER environment variable')
    process.exit(1)
  }

  return { bundler, reporter }
}

function setupTape(configuration) {
  const output = new Duplex({ read() {}, write() {} })
  const parser = new Parser({ strict: true })

  globalThis.logger = function (message, ...args) {
    if (typeof message !== 'string') {
      console.log(message, ...args)
      return
    }

    output.push(message + '\n')
  }

  output.pipe(parser)

  if (configuration.reporter) {
    output.pipe(reporter('spec'))
  }

  process.on('uncaughtException', (err) => {
    if (global.onerror) {
      global.onerror(err)
    } else {
      process.removeAllListeners('uncaughtException')
      throw err
    }
  })

  parser.on('line', (line) => {
    if (line === '# readable-stream-finished\n') {
      output.push(null)
      output.end()
      return
    } else if (line.startsWith('# not ok')) {
      process.exitCode = 1
    }

    if (!configuration.reporter) {
      console.log(line.replace(/\n$/, ''))
    }
  })
}

async function main() {
  const configuration = parseEnviroment()
  setupTape(configuration)

  // Execute the test suite
  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  await import(`file://${resolve(__dirname, `../../tmp/${configuration.bundler}/suite.node.js`)}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
