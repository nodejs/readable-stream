import { transform } from '@babel/core'
import { createReadStream } from 'node:fs'
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { finished } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'
import prettier from 'prettier'
import { Parse } from 'tar'
import { request } from 'undici'
import prettierConfig from '../prettier.config.cjs'
import { aliases, skippedSources, sources } from './files.mjs'
import { footers } from './footers.mjs'
import { headers } from './headers.mjs'
import { replacements } from './replacements.mjs'
import pkg from '../package.json' with { type: "json" };

const baseMatcher = /^(?:lib|test)/
const strictMatcher = /^(['"']use strict.+)/

function highlightFile(file, color) {
  return `\x1b[${color}m${file.replace(process.cwd() + '/', '')}\x1b[0m`
}

function info(message) {
  console.log(`\x1b[34m[INFO]\x1b[0m ${message}`)
}

async function extract(nodeVersion, tarFile) {
  const sourcesMatcher = sources.map((s) => new RegExp(s))

  info(`Extracting Node.js ${nodeVersion} tar file ...`)
  const contents = []
  const tarPrefix = `node-v${nodeVersion}/`
  const parser = new Parse()

  parser.on('entry', (entry) => {
    const dst = entry.path.replace(tarPrefix, '')

    if (
      entry.type === 'Directory' ||
      skippedSources.includes(dst) ||
      !baseMatcher.test(dst) ||
      !sourcesMatcher.some((s) => s.test(dst))
    ) {
      return entry.resume()
    }

    let buffer = Buffer.alloc(0)

    entry.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk])
    })

    entry.on('end', () => {
      const content = buffer.toString('utf-8')

      // Enqueue file
      contents.push([dst, content])

      // Some special cases when file aliasing is needed
      if (aliases[dst]) {
        for (const alias of aliases[dst]) {
          contents.push([alias, content])
        }
      }
    })

    entry.resume()
  })

  await finished(tarFile.pipe(parser))
  info('extraction done')
  return contents
}

async function processFiles(contents) {
  const replacementsKeys = Object.keys(replacements)
  const headersKeys = Object.keys(headers)
  const footersKeys = Object.keys(footers)

  prettierConfig.parser = 'babel'

  for (let [path, content] of contents) {
    const modifications = []
    const matchingReplacements = replacementsKeys.filter((k) => new RegExp(k).test(path))
    const matchingHeaders = headersKeys.filter((k) => new RegExp(k).test(path))
    const matchingFooters = footersKeys.filter((k) => new RegExp(k).test(path))

    // Perform replacements
    if (matchingReplacements.length) {
      modifications.push(highlightFile('replacements', 33))

      for (const matching of matchingReplacements) {
        for (const [from, to] of replacements[matching]) {
          content = content.replaceAll(new RegExp(from, 'gm'), to)
        }
      }
    }

    // Prepend headers
    if (matchingHeaders.length) {
      modifications.push(highlightFile('headers', 33))

      for (const footerKey of matchingHeaders) {
        for (const header of headers[footerKey]) {
          if (content.match(strictMatcher)) {
            content = content.replace(strictMatcher, `$&;${header}`)
          } else {
            content = header + content
          }
        }
      }
    }

    // Append footers
    if (matchingFooters.length) {
      modifications.push(highlightFile('footers', 33))

      for (const footerKey of matchingFooters) {
        for (const footer of footers[footerKey]) {
          content += footer
        }
      }
    }

    // Process the file through babel and prettier
    if (path.endsWith('.js')) {
      modifications.push(highlightFile('babel', 33), highlightFile('prettier', 33))
      content = prettier.format(await transform(content).code.replaceAll('void 0', 'undefined'), prettierConfig)
    }

    if (!modifications.length) {
      modifications.push('no modifications')
    }

    // Write the file
    info(`Creating file ${highlightFile(path, 32)} (${modifications.join(', ')}) ...`)
    await writeFile(path, content, 'utf-8')
  }
}

async function downloadNode(nodeVersion) {
  // Download node
  const downloadUrl = `https://nodejs.org/dist/v${nodeVersion}/node-v${nodeVersion}.tar.gz`
  info(`Downloading ${downloadUrl} ...`)
  const { statusCode, body } = await request(downloadUrl, { pipelining: 0 })

  if (statusCode !== 200) {
    info(`Downloading failed with HTTP code ${statusCode}.`)
    process.exit(1)
  }

  return body
}

async function main() {
  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  const rootDir = resolve(__dirname, '..')

  if (process.cwd() !== rootDir) {
    console.error('Please run this from the root directory of readable-stream repository.')
    return process.exit(1)
  }

  const nodeVersion = process.argv[2] || pkg.config.node.version;

  if (!nodeVersion?.match(/^\d+\.\d+\.\d+/)) {
    console.error('Usage: build.js xx.yy.zz [node.tar.gz]')
    return process.exit(1)
  }

  // Cleanup existing folder
  await rm('lib', { recursive: true, force: true })
  await rm('test', { recursive: true, force: true })

  // Download or open the tar file
  let tarFile

  if (process.argv[3]) {
    tarFile = createReadStream(process.argv[3])
  } else {
    tarFile = await downloadNode(nodeVersion)
  }

  // Extract contents
  const contents = await extract(nodeVersion, tarFile)

  // Update Node version in README.md
  replacements['README.md'][0][1] = replacements['README.md'][0][1].replace('$2', nodeVersion)
  replacements['README.md'][1][1] = replacements['README.md'][1][1].replace('$2', nodeVersion)

  // Add custom files
  contents.push(['lib/ours/browser.js', await readFile('src/browser.js', 'utf-8')])
  contents.push(['lib/ours/index.js', await readFile('src/index.js', 'utf-8')])
  contents.push(['lib/ours/errors.js', await readFile('src/errors.js', 'utf-8')])
  contents.push(['lib/ours/primordials.js', await readFile('src/primordials.js', 'utf-8')])
  contents.push(['lib/ours/util.js', await readFile('src/util.js', 'utf-8')])

  for (const file of await readdir('src/test/ours')) {
    contents.push([`test/ours/${file}`, await readFile(`src/test/ours/${file}`, 'utf-8')])
  }

  for (const file of await readdir('src/test/browser')) {
    if (file.endsWith('fixtures')) {
      continue
    }

    contents.push([`test/browser/${file}`, await readFile(`src/test/browser/${file}`, 'utf-8')])
  }

  for (const file of await readdir('src/test/browser/fixtures')) {
    contents.push([`test/browser/fixtures/${file}`, await readFile(`src/test/browser/fixtures/${file}`, 'utf-8')])
  }

  contents.push(['README.md', await readFile('./README.md', 'utf-8')])

  // Create paths
  const paths = new Set(contents.map((c) => dirname(c[0])))
  paths.delete('.')

  for (const path of paths.values()) {
    info(`Creating directory ${highlightFile(path, 32)} ...`)
    await mkdir(path, { recursive: true, force: true })
  }

  // Perform replacements
  await processFiles(contents)
}

await main()
