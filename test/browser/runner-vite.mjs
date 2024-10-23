import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import * as stream from 'node:stream'
import * as fs from 'node:fs/promises'

const TIMEOUT_MS = 10 * 1e3

// Enum for success state
/** @type {{ [p: number]: string, IDLE: 0, SUCCESS: 1, ERROR: 2 }} */
const State = (() => {
  const _s = {}
  _s[_s[0] = 'IDLE'] = 0
  _s[_s[1] = 'SUCCESS'] = 1
  _s[_s[2] = 'ERROR'] = 2
  return _s
})()

// Utility to read a http IncomingMessage into a buffer
/**
 * @param msg {import("http").IncomingMessage}
 * @return {Promise<Buffer>}
 */
async function readMessage(msg) {
  const chunks = []
  const writable = new stream.Writable({
    write: function(chunk, encoding, next) {
      if (chunk === null) {
        return
      }
      if (!(chunk instanceof Uint8Array)) {
        throw new Error('Chunk is not Uint8Array')
      }
      chunks.push(chunk)
      next()
    }
  })
  const promise = new Promise((resolve, reject) => {
    writable.on('finish', resolve)
    writable.on('error', reject)
  })
  msg.pipe(writable)
  await promise
  return Buffer.concat(chunks)
}

// Create a middleware that registers an endpoint on /status, so that the runner can receive the status.
// Also registers /log to log debug messages.
function createMiddleware() {
  const stateChangeCallbacks = []
  let error = null

  /**
   * @param state {0 | 1 | 2}
   */
  function setState(state) {
    for (const cb of stateChangeCallbacks.splice(0)) {
      cb(state)
    }
  }

  /**
   * @param timeout {number}
   * @return {Promise<0 | 1 | 2>}
   */
  function awaitStateChange(timeout) {
    let timeoutHandle = -1
    return Promise.race([
      new Promise((resolve, reject) => {
        timeoutHandle = setTimeout(() => {
          reject(new Error('Timed out (' + timeout + 'ms)'))
        }, timeout)
      }),
      new Promise((resolve) => {
        clearTimeout(timeoutHandle)
        stateChangeCallbacks.push(resolve)
      })
    ])
  }

  /**
   * @return {Error | null}
   */
  function getError() {
    return error
  }

  /**
   * @param req {import("http").IncomingMessage}
   */
  async function handleAsync(req) {
    let action = -1
    switch (req.url) {
      case '/status':
        action = 0
        break
      case '/log':
        action = 1
        break
      default:
        return
    }
    if (action === -1 || req.method !== 'POST') {
      return
    }

    // Read the JSON body
    /** @type { { success?: boolean, error?: string, message?: string } } */
    const body = JSON.parse((new TextDecoder()).decode(await readMessage(req)))

    if (action) {
      // log
      if (!('message' in body)) {
        throw new Error('Log data missing required property: message')
      }
      console.log(`[browser] ${body.message}`)
    } else {
      // status
      if (!('success' in body)) {
        throw new Error('Status data missing required property: success')
      }
      if (body.success) {
        setState(State.SUCCESS)
      } else {
        if ('error' in body) {
          error = new Error(`${body.error}`)
        }
        setState(State.ERROR)
      }
    }
  }

  /**
   * @param req {import("http").IncomingMessage}
   * @param res {import("http").ServerResponse}
   * @param next {() => void}
   */
  function handle(req, res, next) {
    handleAsync(req).then(() => {
      next()
    }).catch((err) => {
      console.error(err)
      process.exit(1)
    })
  }

  return Object.assign(handle, {
    awaitStateChange,
    getError
  })
}

/**
 * If the named directory exists, clears out that directory.
 * If the path exists as a non-directory, throws an error.
 * If the path does not exist, creates a new directory.
 * @param dir {string}
 * @returns {Promise<void>}
 */
async function ensureEmptyDir(dir) {
  let conflict = false
  let clear = false
  try {
    const stats = await fs.stat(dir)
    conflict = !stats.isDirectory()
    clear = true
  } catch (ignored) { }
  if (conflict) {
    throw new Error(`Creating directory at ${dir} would conflict with existing filesystem entity`)
  }
  if (clear) {
    for (const ent of await fs.readdir(dir, { withFileTypes: true })) {
      if (ent.isDirectory()) {
        await fs.rm(resolve(dir, ent.name), { recursive: true, force: true })
      } else {
        await fs.rm(resolve(dir, ent.name), { force: true })
      }
    }
  } else {
    await fs.mkdir(dir, { recursive: true })
  }
}

/**
 * Copies the content of one directory to another, recursively. The destination directory
 * is created with semantics defined by {@link ensureEmptyDir}.
 * @param from {string}
 * @param to {string}
 * @returns {Promise<void>}
 */
async function recursiveCopyDir(from, to) {
  await ensureEmptyDir(to)

  for (const ent of await fs.readdir(from, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      await recursiveCopyDir(
        resolve(from, ent.name),
        resolve(to, ent.name)
      )
    } else if (ent.isFile()) {
      await fs.cp(
        resolve(from, ent.name),
        resolve(to, ent.name)
      )
    }
  }
}

/**
 * Creates a copy of the project directory within node_modules, with an arbitrary name returned by this method.
 * The goal is to force Vite into treating this project as external to the Vite test source.
 * TL;DR, makes "@me" work in the Vite test source.
 * @param moduleRoot {string}
 * @returns {Promise<string>}
 */
async function createMirror(moduleRoot) {
  const name = 'vitest-self-hack'
  const link = resolve(moduleRoot, `node_modules/${name}`)

  await ensureEmptyDir(link)

  // Symlink everything except package.json & lib
  for (const ent of await fs.readdir(moduleRoot, { withFileTypes: true })) {
    let type
    if (ent.isDirectory()) {
      if (ent.name === 'lib') {
        continue
      }
      type = 'dir'
    } else if (ent.isFile()) {
      if (ent.name === 'package.json') {
        continue
      }
      type = 'file'
    } else {
      continue
    }
    await fs.symlink(
      resolve(moduleRoot, ent.name),
      resolve(link, ent.name),
      type
    )
  }

  // Copy lib
  await recursiveCopyDir(
    resolve(moduleRoot, 'lib'),
    resolve(link, 'lib')
  )

  // Copy package.json (with our fake name)
  const pkgJson = JSON.parse(await fs.readFile(resolve(moduleRoot, 'package.json'), { encoding: 'utf-8' }))
  pkgJson.name = name
  await fs.writeFile(
    resolve(link, 'package.json'),
    (new TextEncoder()).encode(JSON.stringify(pkgJson, null, 4)),
    { flag: 'w' }
  )
  return name
}

async function main() {
  // Execute the test
  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  const moduleRoot = resolve(__dirname, '../..')
  const viteRoot = resolve(__dirname, './fixtures/vite')
  const start = performance.now()

  console.log('Creating module mirror...')
  const moduleName = await createMirror(moduleRoot)

  const middleware = createMiddleware()
  const server = await createServer({
    configFile: resolve(viteRoot, 'vite.config.mjs'),
    root: viteRoot,
    plugins: [
      {
        name: 'Status Broker',
        configureServer: async (server) => {
          console.log('Binding status middleware')
          server.middlewares.use(middleware)
        }
      }
    ],
    server: {
      port: 1337
    },
    resolve: {
      alias: {
        '@me': moduleName
      }
    }
  })

  await server.listen()
  console.log('Vite server started')
  server.printUrls()

  try {
    /** @type {Promise<0 | 1 | 2>} */
    const statePromise = middleware.awaitStateChange(TIMEOUT_MS)

    console.log('Opening in browser and awaiting test results...')
    server.openBrowser()

    const state = await statePromise
    const elapsed = performance.now() - start
    const elapsedStr = elapsed.toFixed(2) + ' ms'
    switch (state) {
      case State.SUCCESS:
        console.log('Test succeeded in ' + elapsedStr)
        break
      case State.ERROR:
        console.log('Test failed in ' + elapsedStr)
        throw middleware.getError()
      default:
        throw new Error('Assertion failed: state is out of bounds (' + state + ' / ' + State[state] + ')')
    }
  } finally {
    await server.close()
    console.log('Vite server stopped')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
