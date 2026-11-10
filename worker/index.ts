interface Env {
  ASSETS: Fetcher
  STICKERS_BUCKET: R2Bucket
}

interface StickerManifestItem {
  id: string
  name: string
  file: string
  tags: string[]
}

interface TechnologyManifest {
  technology: {
    id: string
    name: string
    description: string
  }
  stickers: StickerManifestItem[]
}

const manifestKey = (technology: string) =>
  `technologies/${technology}/manifest.json`

const stickerKey = (technology: string, file: string) =>
  `technologies/${technology}/stickers/${file}`

const jsonResponse = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': status === 200 ? 'public, max-age=60' : 'no-store',
    },
  })

const isSafeSegment = (value: string) => /^[a-z0-9][a-z0-9.-]*$/.test(value)

async function getManifest(env: Env, technology: string) {
  const object = await env.STICKERS_BUCKET.get(manifestKey(technology))

  if (!object) {
    return null
  }

  return object.json<TechnologyManifest>()
}

async function handleTechnologyCollection(env: Env, technology: string) {
  if (!isSafeSegment(technology)) {
    return jsonResponse({ error: 'Invalid technology identifier' }, 400)
  }

  const manifest = await getManifest(env, technology)

  if (!manifest) {
    return jsonResponse({ error: 'Technology collection not found' }, 404)
  }

  return jsonResponse({
    ...manifest,
    stickers: manifest.stickers.map((sticker) => ({
      ...sticker,
      technology: manifest.technology.id,
      imageUrl: `/api/technologies/${manifest.technology.id}/stickers/${sticker.file}`,
    })),
  })
}

async function handleStickerAsset(
  env: Env,
  technology: string,
  file: string,
) {
  if (!isSafeSegment(technology) || !isSafeSegment(file)) {
    return jsonResponse({ error: 'Invalid sticker path' }, 400)
  }

  const manifest = await getManifest(env, technology)
  const belongsToTechnology = manifest?.stickers.some(
    (sticker) => sticker.file === file,
  )

  if (!belongsToTechnology) {
    return jsonResponse({ error: 'Sticker not found in this technology' }, 404)
  }

  const object = await env.STICKERS_BUCKET.get(stickerKey(technology, file))

  if (!object) {
    return jsonResponse({ error: 'Sticker asset not found' }, 404)
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('ETag', object.httpEtag)
  headers.set('Cache-Control', 'public, max-age=86400, immutable')
  headers.set('Content-Disposition', `inline; filename="${file}"`)

  return new Response(object.body, { headers })
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url)
    const segments = url.pathname.split('/').filter(Boolean)

    if (request.method === 'GET' && url.pathname === '/api/health') {
      return jsonResponse({ ok: true, storage: 'r2' })
    }

    if (
      request.method === 'GET' &&
      segments.length === 4 &&
      segments[0] === 'api' &&
      segments[1] === 'technologies' &&
      segments[3] === 'stickers'
    ) {
      return handleTechnologyCollection(env, segments[2])
    }

    if (
      request.method === 'GET' &&
      segments.length === 5 &&
      segments[0] === 'api' &&
      segments[1] === 'technologies' &&
      segments[3] === 'stickers'
    ) {
      return handleStickerAsset(env, segments[2], segments[4])
    }

    if (url.pathname.startsWith('/api/')) {
      return jsonResponse({ error: 'Not found' }, 404)
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
