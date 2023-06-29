import { exec } from 'child_process'
import util from '../lib/ours/util.js'

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

  switch (bundler) {
    case 'browserify':
      break
    case 'esbuild':
      break
    case 'rollup':
      break
    case 'webpack':
      await run('webpack -c readable-stream-test/webpack.config.mjs')
  }
}

main().catch((e) => {
  error(e)
  process.exit(1)
})
