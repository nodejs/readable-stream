import { createReadStream } from 'node:fs'
import { copyFile, cp, mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { finished } from 'node:stream/promises'
import { Parse } from 'tar'
import { request } from 'undici'
import { aliases, skippedSources, sources } from './files.mjs'
import { footers } from './footers.mjs'
import { replacements } from './replacements.mjs'

const baseMatcher = /^lib|test/

function highlightFile(file, color) {
  return `\x1b[${color}m${file.replace(process.cwd() + '/', '')}\x1b[0m`
}

async function extract(nodeVersion, tarFile) {
  const sourcesMatcher = sources.map((s) => new RegExp(s))

  console.log(`Extracting Node.js ${nodeVersion} tar file ...`)
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
  return contents
}

async function processFiles(contents) {
  const replacementsKeys = Object.keys(replacements)
  const footersKeys = Object.keys(footers)

  for (let [path, content] of contents) {
    const modifications = []
    const matchingReplacements = replacementsKeys.filter((k) => new RegExp(k).test(path))
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

    // Append trailers
    if (matchingReplacements.length) {
      modifications.push(highlightFile('footers', 33))

      for (const footerKey of matchingFooters) {
        for (const footer of footers[footerKey]) {
          content += footer
        }
      }
    }

    if (!modifications.length) {
      modifications.push('no modifications')
    }

    // Write the file
    console.log(`Creating file ${highlightFile(path, 32)} (${modifications.join(', ')}) ...`)
    await writeFile(path, content, 'utf-8')
  }
}

async function downloadNode(nodeVersion) {
  // Download node
  const downloadUrl = `https://nodejs.org/v${nodeVersion}/node-v${nodeVersion}.tar.gz`
  console.log(`Downloading ${downloadUrl} ...`)
  const { statusCode, body } = await request(downloadUrl, { pipelining: 0 })

  if (statusCode !== 200) {
    console.log(`Downloading failed with HTTP code ${statusCode}.`)
    process.exit(1)
  }

  return body
}

async function main() {
  const rootDir = resolve(dirname(new URL(import.meta.url).pathname), '..')

  if (process.cwd() !== rootDir) {
    console.error('Please run this from the root directory of readable-stream repository.')
    return process.exit(1)
  }

  const nodeVersion = process.argv[2]

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

  // Extract and process contents
  const contents = await extract(nodeVersion, tarFile)

  await mkdir('lib/internal/streams', { recursive: true, force: true })
  await mkdir('test/common', { recursive: true, force: true })
  await mkdir('test/parallel', { recursive: true, force: true })

  await processFiles(contents)

  // Copy template files
  console.log(`Copying template to file ${highlightFile('lib/browser.js', 32)} ...`)
  await copyFile('src/browser.js', 'lib/browser.js')

  console.log(`Copying template to file ${highlightFile('lib/index.js', 32)} ...`)
  await copyFile('src/index.js', 'lib/index.js')

  console.log(`Copying template to file ${highlightFile('lib/util.js', 32)} ...`)
  await copyFile('src/util.js', 'lib/util.js')

  console.log(`Copying template to file ${highlightFile('lib/internal/uv-browser.js', 32)} ...`)
  await copyFile('src/uv-browser.js', 'lib/internal/uv-browser.js')

  console.log(`Copying template to file ${highlightFile('test/test-browser.js', 32)} ...`)
  await copyFile('src/test/test-browser.js', 'test/test-browser.js')

  console.log(`Copying template to file ${highlightFile('test/browser', 32)} ...`)
  await cp('src/test/browser', 'test/browser', { recursive: true })

  console.log(`Copying template to file ${highlightFile('test/ours', 32)} ...`)
  await cp('src/test/ours', 'test/ours', { recursive: true })

  // TODO@PI
  // // Update Node version in README
  // // processFile(readmePath, readmePath, [
  // //   [readmeVersionRegex, "$1" + nodeVersion]
  // // ])
}

await main()
