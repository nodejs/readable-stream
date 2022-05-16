import { build } from 'esbuild'

build({
  entryPoints: ['test/browser/test-browser.js'],
  outfile: 'tmp/esbuild/suite.node.js',
  bundle: true,
  platform: 'node'
}).catch(() => process.exit(1))
