import { useEffect, useMemo, useState } from 'react'
import { Badge } from '@openai/apps-sdk-ui/components/Badge'
import {
  Button,
  ButtonLink,
  CopyButton,
} from '@openai/apps-sdk-ui/components/Button'
import { Input } from '@openai/apps-sdk-ui/components/Input'
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Search,
  SimpleSmile,
  Star,
} from '@openai/apps-sdk-ui/components/Icon'

const installCommand = 'npm install @amarmanhala/stickers'

const technologies = [
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    searchPlaceholder: 'Search deploy, cache, outage…',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    searchPlaceholder: 'Search compiler, strict, types…',
  },
  {
    id: 'react',
    name: 'React',
    searchPlaceholder: 'Search hooks, props, render…',
  },
] as const

interface Sticker {
  id: string
  name: string
  file: string
  tags: string[]
  technology: string
  imageUrl: string
}

interface StickerCollection {
  technology: {
    id: string
    name: string
    description: string
  }
  stickers: Sticker[]
}

function App() {
  const [query, setQuery] = useState('')
  const [selectedTechnology, setSelectedTechnology] = useState('cloudflare')
  const [collection, setCollection] = useState<StickerCollection | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const collectionEndpoint = `/api/technologies/${selectedTechnology}/stickers`

    async function loadCollection() {
      setLoadError(null)
      setCollection(null)

      try {
        const response = await fetch(collectionEndpoint, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Sticker API returned ${response.status}`)
        }

        const nextCollection = (await response.json()) as StickerCollection
        setCollection(nextCollection)
      } catch (error) {
        if (controller.signal.aborted) return

        setCollection(null)
        setLoadError(
          error instanceof Error ? error.message : 'Could not load stickers',
        )
      }
    }

    void loadCollection()
    return () => controller.abort()
  }, [reloadKey, selectedTechnology])

  const activeTechnology =
    technologies.find((technology) => technology.id === selectedTechnology) ??
    technologies[0]

  const filteredStickers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const stickers = collection?.stickers ?? []

    if (!normalizedQuery) {
      return stickers
    }

    return stickers.filter((sticker) =>
      `${sticker.name} ${sticker.tags.join(' ')}`
        .toLowerCase()
        .includes(normalizedQuery),
    )
  }, [collection, query])

  return (
    <div className="min-h-screen bg-surface text-primary">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <a
          className="flex shrink-0 items-center gap-2 font-semibold tracking-tight"
          href="/"
          aria-label="Stickers home"
        >
          <span className="grid size-7 place-items-center rounded-lg bg-primary-solid text-primary-solid">
            <SimpleSmile className="size-4" aria-hidden="true" />
          </span>
          stickers
        </a>

        <nav className="flex items-center gap-1" aria-label="Project links">
          <ButtonLink
            as="a"
            href="https://github.com/amarmanhala/stickers"
            target="_blank"
            rel="noreferrer"
            external
            color="secondary"
            variant="ghost"
            size="sm"
          >
            GitHub
            <ArrowUpRight aria-hidden="true" />
          </ButtonLink>
          <ButtonLink
            as="a"
            href="https://github.com/amarmanhala/stickers/stargazers"
            target="_blank"
            rel="noreferrer"
            external
            color="secondary"
            variant="outline"
            size="sm"
          >
            <Star aria-hidden="true" />
            Star
          </ButtonLink>
        </nav>
      </header>

      <main>
        <section className="mx-auto flex min-h-[640px] w-full max-w-4xl flex-col items-center justify-center px-5 py-20 text-center sm:px-8 sm:py-28">
          <Badge color="warning" variant="soft" pill>
            Three techs · twenty-seven moods
          </Badge>

          <h1 className="heading-4xl mt-7 max-w-3xl text-balance sm:heading-5xl">
            Your tech stack has feelings too.
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-lg text-secondary">
            Download expressive stickers for deploys, type errors, rerenders,
            clean builds, and every “why is production doing that?” moment.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink as="a" href="#stickers" color="primary" size="lg">
              Browse stickers
              <ArrowDown aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              as="a"
              href="https://github.com/amarmanhala/stickers"
              target="_blank"
              rel="noreferrer"
              external
              color="secondary"
              variant="outline"
              size="lg"
            >
              Follow the build
              <ArrowUpRight aria-hidden="true" />
            </ButtonLink>
          </div>

          <div
            className="mt-14 flex flex-wrap items-center justify-center gap-3"
            aria-label="Sticker technologies"
          >
            <span className="-rotate-3 rounded-xl border-2 border-black bg-white px-5 py-3 font-mono text-lg font-bold text-orange-600 shadow-md">
              Cloudflare
            </span>
            <span className="rotate-2 rounded-xl border-2 border-black bg-white px-5 py-3 font-mono text-lg font-bold text-blue-600 shadow-md">
              TypeScript
            </span>
            <span className="-rotate-1 rounded-xl border-2 border-black bg-white px-5 py-3 font-mono text-lg font-bold text-cyan-600 shadow-md">
              React
            </span>
          </div>
        </section>

        <section id="stickers" className="scroll-mt-2">
          <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
            <div className="flex flex-wrap gap-2" aria-label="Sticker collections">
              {technologies.map((technology) => {
                const selected = technology.id === selectedTechnology

                return (
                  <Button
                    key={technology.id}
                    color={selected ? 'primary' : 'secondary'}
                    variant={selected ? 'solid' : 'outline'}
                    onClick={() => {
                      setSelectedTechnology(technology.id)
                      setQuery('')
                    }}
                    aria-pressed={selected}
                  >
                    {technology.name}
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="sticky top-0 z-20 border-y border-subtle bg-surface/95 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:px-8">
              <Input
                className="w-full sm:max-w-md"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={activeTechnology.searchPlaceholder}
                aria-label={`Search ${activeTechnology.name} stickers`}
                startAdornment={<Search className="size-4" aria-hidden="true" />}
                size="lg"
                pill
              />
              <div className="flex items-center justify-between gap-3 sm:ml-auto sm:justify-end">
                <Badge color="info" variant="soft" pill>
                  {activeTechnology.name}
                </Badge>
                <span className="text-sm text-secondary" aria-live="polite">
                  {filteredStickers.length} result{filteredStickers.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
            {!collection && !loadError ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <div
                    className="h-96 animate-pulse rounded-3xl bg-surface-secondary"
                    key={index}
                    aria-hidden="true"
                  />
                ))}
              </div>
            ) : loadError ? (
              <div className="grid min-h-80 place-items-center rounded-3xl border border-dashed border-default bg-surface-secondary px-6 text-center">
                <div>
                  <p className="heading-lg">The sticker shelf is unavailable</p>
                  <p className="mt-2 max-w-md text-secondary">
                    The {activeTechnology.name} R2 collection could not be loaded.{' '}
                    {loadError}.
                  </p>
                  <Button
                    className="mt-5"
                    color="secondary"
                    variant="outline"
                    onClick={() => setReloadKey((value) => value + 1)}
                  >
                    Try again
                  </Button>
                </div>
              </div>
            ) : filteredStickers.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredStickers.map((sticker) => (
                  <article
                    className="group rounded-3xl border border-subtle bg-surface p-3 shadow-sm transition duration-basic hover:-translate-y-0.5 hover:shadow-md"
                    key={sticker.id}
                  >
                    <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl bg-surface-secondary p-5">
                      <img
                        className="h-full w-full object-contain transition duration-basic group-hover:scale-[1.03]"
                        src={sticker.imageUrl}
                        alt={`${sticker.name} ${collection?.technology.name ?? activeTechnology.name} sticker`}
                        loading="lazy"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3 px-2 pb-2 pt-4">
                      <div className="min-w-0">
                        <h3 className="truncate font-medium">{sticker.name}</h3>
                        <p className="mt-0.5 text-sm text-secondary">
                          {collection?.technology.name ?? activeTechnology.name}
                        </p>
                      </div>
                      <ButtonLink
                        as="a"
                        href={sticker.imageUrl}
                        download={sticker.file}
                        color="secondary"
                        variant="ghost"
                        size="sm"
                      >
                        <Download aria-hidden="true" />
                        Download
                      </ButtonLink>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="grid min-h-80 place-items-center rounded-3xl border border-dashed border-default bg-surface-secondary px-6 text-center">
                <div>
                  <p className="heading-lg">No tech mood found</p>
                  <p className="mt-2 text-secondary">
                    Try another feeling, event, or technology term.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-subtle">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 py-20 text-center sm:px-8">
            <Badge color="info" variant="soft" pill>
              npm package coming later
            </Badge>
            <h2 className="heading-3xl mt-5 text-balance sm:heading-4xl">
              One command. The whole tech crew.
            </h2>
            <p className="mt-4 max-w-xl text-secondary">
              The package is not published yet, but the install flow is ready for
              launch day.
            </p>
            <div className="mt-8 flex w-full max-w-xl items-center gap-3 rounded-xl border border-default bg-surface-secondary p-2 pl-4 shadow-sm">
              <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-left font-mono text-sm">
                {installCommand}
              </code>
              <CopyButton
                copyValue={installCommand}
                color="secondary"
                variant="ghost"
                size="lg"
                uniform
                aria-label="Copy npm install command"
              >
                {({ copied }) =>
                  copied ? (
                    <Check aria-hidden="true" />
                  ) : (
                    <Copy aria-hidden="true" />
                  )
                }
              </CopyButton>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-subtle">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-6 text-sm text-tertiary sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© 2026 stickers</span>
          <span>Stored and served on Cloudflare.</span>
        </div>
      </footer>
    </div>
  )
}

export default App
