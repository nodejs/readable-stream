import { exec } from 'child_process'
import { promises } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import util from '../../lib/ours/util.js'
const { copyFile, mkdir, rmdir } = promises

function highlightFile(file) {
  return `\x1b[33m${file.replace(process.cwd() + '/', '')}\x1b[0m`
}

function info(message) {
  console.log(`\x1b[34m[INFO]\x1b[0m ${message}`)
}

function error(message) {
  console.log(`\x1b[31m[INFO]\x1b[0m ${message}`)
}

async function run(command) {
  info(`Executing \x1b[33m${command}\x1b[0m ...`)
  const { promise, reject, resolve } = util.createDeferredPromise()

  let hasOutput = false
  function logOutput(chunk) {
    if (!hasOutput) {
      hasOutput = true
      console.log('')
    }

    console.log(chunk.toString('utf-8').trim().replace(/^/gm, '       '))
  }

  try {
    const process = exec(command, { stdio: 'pipe' }, (error) => {
      if (error) {
        return reject(error)
      }

      resolve(error)
    })

    process.stdout.on('data', logOutput)
    process.stderr.on('data', logOutput)
    await promise

    if (hasOutput) {
      console.log('')
    }
  } catch (e) {
    if (hasOutput) {
      console.log('')
    }

    error(`Command failed with status code ${e.code}.`)
    process.exit(1)
  }
}

async function main() {
  const validBundlers = ['browserify', 'esbuild', 'rollup', 'webpack']
  const bundler = process.argv[2] || process.env.BUNDLER

  if (!validBundlers.includes(bundler)) {
    error(`Usage: node await runner-prepare.mjs [${validBundlers.join('|')}]`)
    error('You can also use the BUNDLER environment variable.')
    process.exit(1)
  }

  const rootDir = resolve(fileURLToPath(new URL('.', import.meta.url)), `../../tmp/${bundler}`)
  const sourceIndex = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../test/browser/fixtures/index.html')
  const targetIndex = resolve(rootDir, 'index.html')

  info(`Emptying directory ${highlightFile(rootDir)} ...`)
  try {
    await rmdir(rootDir, { recursive: true })
  } catch (e) {
    // No-op
  }
  await mkdir(rootDir, { recursive: true })

  info(`Copying file ${highlightFile(sourceIndex)} to ${highlightFile(targetIndex)} ...`)
  await copyFile(sourceIndex, targetIndex)

  switch (bundler) {
    case 'browserify':
      await run('browserify test/browser/test-browser.js -o tmp/browserify/suite.browser.js')
      await run('browserify test/browser/test-browser.js --node -o tmp/browserify/suite.node.js')
      break
    case 'esbuild':
      await run('node src/test/browser/fixtures/esbuild.browser.config.mjs')
      await run('node src/test/browser/fixtures/esbuild.node.config.mjs')
      break
    case 'rollup':
      await run('rollup -c test/browser/fixtures/rollup.browser.config.mjs')
      await run('rollup -c test/browser/fixtures/rollup.node.config.mjs')
      break
    case 'webpack':
      await run('webpack -c test/browser/fixtures/webpack.browser.config.mjs')
      await run('webpack -c test/browser/fixtures/webpack.node.config.mjs')
  }
}

main().catch((e) => {
  error(e)
  process.exit(1)
})
