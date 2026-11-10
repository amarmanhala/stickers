import { readFile, readdir, stat } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const remote = process.argv.includes('--remote')
const technologyArgumentIndex = process.argv.indexOf('--technology')
const requestedTechnology =
  technologyArgumentIndex >= 0 ? process.argv[technologyArgumentIndex + 1] : null

if (technologyArgumentIndex >= 0 && !requestedTechnology) {
  throw new Error('Pass a technology after --technology')
}

async function requireFile(filePath) {
  try {
    const fileStat = await stat(filePath)
    if (!fileStat.isFile()) throw new Error('not a file')
  } catch {
    throw new Error(`Missing sticker source file: ${filePath}`)
  }
}

function putObject(key, filePath, contentType) {
  const args = [
    'wrangler',
    'r2',
    'object',
    'put',
    `stickers/${key}`,
    '--file',
    filePath,
    '--content-type',
    contentType,
  ]

  if (remote) args.push('--remote')

  const result = spawnSync('npx', args, {
    cwd: projectRoot,
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    throw new Error(`Failed to upload ${key}`)
  }
}

const technologiesDirectory = path.join(projectRoot, 'data/technologies')
const technologies = requestedTechnology
  ? [requestedTechnology]
  : (await readdir(technologiesDirectory, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()

for (const technologyDirectory of technologies) {
  const manifestPath = path.join(
    technologiesDirectory,
    technologyDirectory,
    'manifest.json',
  )
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  const technology = manifest.technology.id
  const sourceDirectory = path.join(projectRoot, 'sticker-assets', technology)

  if (technology !== technologyDirectory) {
    throw new Error(
      `Technology id ${technology} does not match directory ${technologyDirectory}`,
    )
  }

  for (const sticker of manifest.stickers) {
    await requireFile(path.join(sourceDirectory, sticker.file))
  }

  putObject(
    `technologies/${technology}/manifest.json`,
    manifestPath,
    'application/json',
  )

  for (const sticker of manifest.stickers) {
    putObject(
      `technologies/${technology}/stickers/${sticker.file}`,
      path.join(sourceDirectory, sticker.file),
      'image/png',
    )
  }

  console.log(
    `Seeded ${manifest.stickers.length} ${technology} stickers to ${remote ? 'remote' : 'local'} R2.`,
  )
}
