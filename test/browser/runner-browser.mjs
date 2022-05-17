import { resolve } from 'node:path'
import { Readable } from 'node:stream'
import { fileURLToPath } from 'node:url'
import { chromium, firefox, webkit } from 'playwright'
import reporter from 'tap-mocha-reporter'
import Parser from 'tap-parser'

const validBrowsers = ['chrome', 'firefox', 'safari', 'edge']
const validBundlers = ['browserify', 'esbuild', 'rollup', 'webpack']

function parseEnviroment() {
  const headless = process.env.HEADLESS !== 'false'
  const reporter = process.env.SKIP_REPORTER !== 'true'

  let [browser, bundler] = process.argv.slice(2, 4)

  if (!browser) {
    browser = process.env.BROWSER
  }

  if (!bundler) {
    bundler = process.env.BUNDLER
  }

  if (!validBrowsers.includes(browser) || !validBundlers.includes(bundler)) {
    console.error(`Usage: node runner-browser.mjs [${validBrowsers.join('|')}] [${validBundlers.join('|')}]`)
    console.error('You can also use the BROWSER and BUNDLER environment variables.')
    process.exit(1)
  }

  return { browser, bundler, headless, reporter }
}

function createBrowser({ browser: id, headless }) {
  switch (id) {
    case 'firefox':
      return firefox.launch({ headless })
    case 'safari':
      return webkit.launch({ headless })
    case 'edge':
      return chromium.launch({ headless, channel: 'msedge' })
    default:
      return chromium.launch({ headless })
  }
}

function setupTape(page, configuration) {
  const output = new Readable({ read() {} })
  const parser = new Parser({ strict: true })

  output.pipe(parser)

  if (configuration.reporter) {
    output.pipe(reporter('spec'))
  }

  parser.on('line', (line) => {
    if (line !== '# readable-stream-finished\n') {
      if (line.startsWith('# not ok')) {
        process.exitCode = 1
      }

      if (!configuration.reporter) {
        console.log(line.replace(/\n$/, ''))
      }

      return
    }

    output.push(null)

    if (configuration.headless) {
      browser.close()
    }
  })

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error(`\x1b[31m\x1b[1mconsole.error:\x1b[0m ${msg.text()}\n`)
      return
    }

    output.push(msg.text() + '\n')
  })

  // Firefox in headless mode is showing an error even if onerror caught it. Disable in that case
  if (!configuration.headless || configuration.browser !== 'firefox') {
    page.on('pageerror', (err) => {
      console.log('\x1b[31m\x1b[1m--- The browser thrown an uncaught error ---\x1b[0m')
      console.log(err.stack)

      if (configuration.headless) {
        console.log('\x1b[31m\x1b[1m--- Exiting with exit code 1 ---\x1b[0m')
        process.exit(1)
      } else {
        process.exitCode = 1
      }
    })
  }
}

const configuration = parseEnviroment()
const browser = await createBrowser(configuration)
const page = await browser.newPage()
setupTape(page, configuration)

// Execute the test suite
const __dirname = fileURLToPath(new URL('.', import.meta.url))
await page.goto(`file://${resolve(__dirname, `../../tmp/${configuration.bundler}/index.html`)}`)
