# readable-stream

**_Node.js core streams for userland_**

[![npm status](https://img.shields.io/npm/v/readable-stream.svg)](https://npm.im/readable-stream)
[![node](https://img.shields.io/node/v/readable-stream.svg)](https://www.npmjs.org/package/readable-stream)
[![Node.js Build](https://github.com/nodejs/readable-stream/workflows/Node.js/badge.svg)](https://github.com/nodejs/readable-stream/actions?query=workflow%3ANode.js)
[![Browsers Build](https://github.com/nodejs/readable-stream/workflows/Browsers/badge.svg)](https://github.com/nodejs/readable-stream/actions?query=workflow%3ABrowsers)

```bash
npm install readable-stream
```

This package is a mirror of the streams implementations in Node.js 18.0.0.

Full documentation may be found on the [Node.js website](https://nodejs.org/dist/v18.0.0/docs/api/stream.html).

If you want to guarantee a stable streams base, regardless of what version of
Node you, or the users of your libraries are using, use **readable-stream** _only_ and avoid the _"stream"_ module in Node-core, for background see [this blogpost](http://r.va.gg/2014/06/why-i-dont-use-nodes-core-stream-module.html).

As of version 2.0.0 **readable-stream** uses semantic versioning.

## Version 4.x.x

v4.x.x of `readable-stream` is a cut from Node 18. This version supports Node 12, 14, 16 and 18, as well as evergreen browsers.
The breaking changes introduced by v4 are composed of the combined breaking changes in:

- [Node v12](https://nodejs.org/en/blog/release/v12.0.0/)
- [Node v13](https://nodejs.org/en/blog/release/v13.0.0/)
- [Node v14](https://nodejs.org/en/blog/release/v14.0.0/)
- [Node v15](https://nodejs.org/en/blog/release/v15.0.0/)
- [Node v16](https://nodejs.org/en/blog/release/v16.0.0/)
- [Node v17](https://nodejs.org/en/blog/release/v17.0.0/)
- [Node v18](https://nodejs.org/en/blog/release/v18.0.0/)

This also includes _many_ new features.

## Version 3.x.x

v3.x.x of `readable-stream` is a cut from Node 10. This version supports Node 6, 8, and 10, as well as evergreen browsers, IE 11 and latest Safari. The breaking changes introduced by v3 are composed by the combined breaking changes in [Node v9](https://nodejs.org/en/blog/release/v9.0.0/) and [Node v10](https://nodejs.org/en/blog/release/v10.0.0/), as follows:

1. Error codes: https://github.com/nodejs/node/pull/13310,
   https://github.com/nodejs/node/pull/13291,
   https://github.com/nodejs/node/pull/16589,
   https://github.com/nodejs/node/pull/15042,
   https://github.com/nodejs/node/pull/15665,
   https://github.com/nodejs/readable-stream/pull/344
2. 'readable' have precedence over flowing
   https://github.com/nodejs/node/pull/18994
3. make virtual methods errors consistent
   https://github.com/nodejs/node/pull/18813
4. updated streams error handling
   https://github.com/nodejs/node/pull/18438
5. writable.end should return this.
   https://github.com/nodejs/node/pull/18780
6. readable continues to read when push('')
   https://github.com/nodejs/node/pull/18211
7. add custom inspect to BufferList
   https://github.com/nodejs/node/pull/17907
8. always defer 'readable' with nextTick
   https://github.com/nodejs/node/pull/17979

## Version 2.x.x

v2.x.x of `readable-stream` is a cut of the stream module from Node 8 (there have been no semver-major changes from Node 4 to 8). This version supports all Node.js versions from 0.8, as well as evergreen browsers and IE 10 & 11.

# Usage

You can swap your `require('stream')` with `require('readable-stream')`
without any changes, if you are just using one of the main classes and
functions.

```js
const { Readable, Writable, Transform, Duplex, pipeline, finished } = require('readable-stream')
```

Note that `require('stream')` will return `Stream`, while
`require('readable-stream')` will return `Readable`. We discourage using
whatever is exported directly, but rather use one of the properties as
shown in the example above.

## Usage with Bundlers and Browsers

### Browserify

Running with [Browserify](https://browserify.org/) works out of the box.

### ESBuild

When using ESBuild for the server, you don't need any special configuration value.

When using ESBuild for the browser, instead, you need to install the following packages:

- [esbuild-plugin-alias](https://github.com/igoradamenko/esbuild-plugin-alias)
- [crypto-browserify](https://github.com/browserify/crypto-browserify)
- [path-browserify](https://github.com/browserify/path-browserify)
- [stream-browserify](https://github.com/browserify/stream-browserify)

Then make sure your esbuild configuration file (let's say `esbuild.browser.config.mjs`) looks like the following one:

```js
import { build } from 'esbuild'
import alias from 'esbuild-plugin-alias'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

build({
  entryPoints: ['index.js'],
  outfile: 'bundle.js',
  bundle: true,
  platform: 'browser',
  plugins: [
    alias({
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify')
    })
  ],
  define: {
    global: 'globalThis'
  },
  inject: ['esbuild-browsers-shims.mjs']
}).catch(() => process.exit(1))
```

The content of `esbuild-browsers-shims.mjs` should be the following:

```js
import * as bufferModule from 'buffer-es6'
import * as processModule from 'process-es6'

export const process = processModule
export const Buffer = bufferModule.Buffer

export function setImmediate(fn, ...args) {
  setTimeout(() => fn(...args), 1)
}
```

Finally, build your bundle by running:

```
node esbuild.browser.config.mjs
```

### Rollup

You will need to install the following plugins:

- [@rollup/plugin-commonjs](https://github.com/rollup/plugins)
- [@rollup/plugin-node-resolve](https://github.com/rollup/plugins)

For the browser, you also need the following plugins:

- [@rollup/plugin-inject](https://github.com/rollup/plugins)
- [rollup-plugin-polyfill-node](https://github.com/FredKSchott/rollup-plugin-polyfill-node)

When bundling for the server, set your `rollup.config.mjs` to be similar to this:

```js
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'

export default {
  input: ['source.js'],
  output: {
    file: 'destination.js'
  },
  plugins: [
    commonjs(),
    nodeResolve({
      browser: false,
      preferBuiltins: true
    })
  ]
}
```

When bundling for the browser, set your `rollup.config.mjs` to be similar to this:

```js
import commonjs from '@rollup/plugin-commonjs'
import inject from '@rollup/plugin-inject'
import nodeResolve from '@rollup/plugin-node-resolve'
import { resolve } from 'path'
import nodePolyfill from 'rollup-plugin-polyfill-node'

export default {
  input: ['index.js'],
  output: {
    intro: 'function setImmediate(fn, ...args) { setTimeout(() => fn(...args), 1) }',
    file: 'destination.js'
  },
  plugins: [
    commonjs(),
    nodePolyfill(),
    inject({
      process: resolve('node_modules/process-es6/browser.js'),
      Buffer: [resolve('node_modules/buffer-es6/index.js'), 'Buffer']
    }),
    nodeResolve({
      browser: true,
      preferBuiltins: false
    })
  ]
}
```

You are good to go:

```
rollup -c rollup.config.mjs
```

### Webpack

When using Webpack for the server, you don't need any special configuration value.

When using Webpack for the browser, instead, you need to install the following packages:

- [esbuild-plugin-alias](https://github.com/igoradamenko/esbuild-plugin-alias)
- [crypto-browserify](https://github.com/browserify/crypto-browserify)
- [path-browserify](https://github.com/browserify/path-browserify)
- [stream-browserify](https://github.com/browserify/stream-browserify)

And then change your `webpack.config.mjs` file to be similar to the following one:

```js
import { createRequire } from 'module'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import webpack from 'webpack'

const require = createRequire(import.meta.url)
const rootDir = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../../')

export default {
  entry: 'source.js',
  output: {
    filename: 'destination.js'
  },
  mode: 'production',
  target: 'web',
  performance: false,
  plugins: [
    new webpack.BannerPlugin({
      banner: 'function setImmediate(fn, ...args) { setTimeout(() => fn(...args), 1) }',
      raw: true
    }),
    new webpack.ProvidePlugin({
      process: require.resolve('process-es6'),
      Buffer: [require.resolve('buffer-es6'), 'Buffer']
    })
  ],
  resolve: {
    aliasFields: ['browser'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify')
    }
  }
}
```

# Streams Working Group

`readable-stream` is maintained by the Streams Working Group, which
oversees the development and maintenance of the Streams API within
Node.js. The responsibilities of the Streams Working Group include:

- Addressing stream issues on the Node.js issue tracker.
- Authoring and editing stream documentation within the Node.js project.
- Reviewing changes to stream subclasses within the Node.js project.
- Redirecting changes to streams from the Node.js project to this
  project.
- Assisting in the implementation of stream providers within Node.js.
- Recommending versions of `readable-stream` to be included in Node.js.
- Messaging about the future of streams to give the community advance
  notice of changes.

<a name="members"></a>

# Running browsers test locally

If you want to run tests locally, you have to perform the additional steps:

1. Install `playwright` and one or more of the required browsers:

   ```shell
   npm install -D playwright@^1.22.2
   ./node_modules/.bin/playwright install $EXECUTABLE
   ```

   Where `$EXECUTABLE` must be one of:

   - `chrome`
   - `firefox`
   - `webkit`
   - `msedge`

2. Prepare your bundler of choice for tests:

   ```shell
   npm run test:prepare $BUNDLER
   ```

   Where `BUNDLER` must be one of:

   - `browserify`
   - `esbuild`
   - `rollup`
   - `webpack`

After that, you can run tests by running:

```shell
npm run test:browsers $BROWSER $BUNDLER
```

Where `$BROWSER` can be one of:

- `chrome`
- `firefox`
- `safari`
- `edge`

and `$BUNDLER` is the one you chose before.

# Team Members

- **Mathias Buus** ([@mafintosh](https://github.com/mafintosh)) &lt;mathiasbuus@gmail.com&gt;
- **Matteo Collina** ([@mcollina](https://github.com/mcollina)) &lt;matteo.collina@gmail.com&gt;
  - Release GPG key: 3ABC01543F22DD2239285CDD818674489FBC127E
- **Robert Nagy** ([@ronag](https://github.com/ronag)) &lt;ronagy@icloud.com&gt;
- **Vincent Weevers** ([@vweevers](https://github.com/vweevers)) &lt;mail@vincentweevers.nl&gt;
