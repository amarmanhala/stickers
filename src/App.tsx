import { useEffect, useMemo, useState } from 'react'
import { Badge } from '@openai/apps-sdk-ui/components/Badge'
import {
  Button,
  ButtonLink,
  CopyButton,
} from '@openai/apps-sdk-ui/components/Button'
import { Input } from '@openai/apps-sdk-ui/components/Input'
import {
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
  const [starCount, setStarCount] = useState<number | null>(null)
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

  useEffect(() => {
    const controller = new AbortController()

    async function loadStarCount() {
      try {
        const response = await fetch('/api/github/stars', {
          signal: controller.signal,
        })

        if (!response.ok) return

        const data = (await response.json()) as { stars: number }
        setStarCount(data.stars)
      } catch {
        // The GitHub link remains usable if the count is temporarily unavailable.
      }
    }

    void loadStarCount()
    return () => controller.abort()
  }, [])

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
            {starCount === null ? 'Star' : starCount.toLocaleString()}
          </ButtonLink>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-6 px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14 lg:grid-cols-2 lg:items-end lg:gap-16">
          <h1 className="max-w-xl text-balance text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            Your tech stack has feelings too.
          </h1>
          <p className="max-w-xl text-balance text-lg text-secondary lg:pb-1">
            Download expressive stickers for deploys, type errors, rerenders,
            clean builds, and every “why is production doing that?” moment.
          </p>
        </section>

        <section id="stickers" className="scroll-mt-2">
          <div className="mx-auto w-full max-w-6xl px-5 pb-7 sm:px-8 sm:pb-9">
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
                    className="group transition duration-basic hover:-translate-y-0.5"
                    key={sticker.id}
                  >
                    <div className="grid aspect-[4/3] place-items-center overflow-hidden p-5">
                      <img
                        className="h-full w-full object-contain transition duration-basic group-hover:scale-[1.03]"
                        src={sticker.imageUrl}
                        alt={`${sticker.name} ${collection?.technology.name ?? activeTechnology.name} sticker`}
                        loading="lazy"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3 px-5 pb-2 pt-2">
                      <h3 className="min-w-0 truncate font-medium">
                        {sticker.name}
                      </h3>
                      <ButtonLink
                        as="a"
                        href={sticker.imageUrl}
                        download={sticker.file}
                        color="secondary"
                        variant="ghost"
                        size="sm"
                        aria-label={`Download ${sticker.name}`}
                      >
                        <Download aria-hidden="true" />
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
