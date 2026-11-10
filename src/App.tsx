import { useEffect, useMemo, useState } from 'react'
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useParams,
} from 'react-router-dom'
import {
  Button,
  ButtonLink,
  CopyButton,
} from '@openai/apps-sdk-ui/components/Button'
import { Input } from '@openai/apps-sdk-ui/components/Input'
import {
  ArrowLeft,
  ArrowUpRight,
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
  },
  {
    id: 'typescript',
    name: 'TypeScript',
  },
  {
    id: 'react',
    name: 'React',
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

function SiteHeader() {
  const [starCount, setStarCount] = useState<number | null>(null)

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

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
      <Link
        className="flex shrink-0 items-center gap-2 font-semibold tracking-tight"
        to="/"
        aria-label="Stickers home"
      >
        <span className="grid size-7 place-items-center rounded-lg bg-primary-solid text-primary-solid">
          <SimpleSmile className="size-4" aria-hidden="true" />
        </span>
        stickers
      </Link>

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
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-subtle">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-6 text-sm text-tertiary sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span>© 2026 stickers</span>
        <span>Stored and served on Cloudflare.</span>
      </div>
    </footer>
  )
}

function GalleryPage() {
  const [query, setQuery] = useState('')
  const [selectedTechnology, setSelectedTechnology] = useState('all')
  const [collections, setCollections] = useState<StickerCollection[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadCollections() {
      setLoadError(null)
      setCollections([])

      try {
        const technologyIds =
          selectedTechnology === 'all'
            ? technologies.map((technology) => technology.id)
            : [selectedTechnology]
        const nextCollections = await Promise.all(
          technologyIds.map(async (technology) => {
            const response = await fetch(
              `/api/technologies/${technology}/stickers`,
              { signal: controller.signal },
            )

            if (!response.ok) {
              throw new Error(`Sticker API returned ${response.status}`)
            }

            return (await response.json()) as StickerCollection
          }),
        )
        setCollections(nextCollections)
      } catch (error) {
        if (controller.signal.aborted) return

        setCollections([])
        setLoadError(
          error instanceof Error ? error.message : 'Could not load stickers',
        )
      }
    }

    void loadCollections()
    return () => controller.abort()
  }, [reloadKey, selectedTechnology])

  const filteredStickers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const stickers = collections.flatMap((collection) => collection.stickers)

    if (!normalizedQuery) {
      return stickers
    }

    return stickers.filter((sticker) =>
      `${sticker.name} ${sticker.technology} ${sticker.tags.join(' ')}`
        .toLowerCase()
        .includes(normalizedQuery),
    )
  }, [collections, query])

  return (
    <div className="min-h-screen bg-surface text-primary">
      <SiteHeader />

      <main>
        <section className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 pb-12 pt-10 text-center sm:px-8 sm:pb-16 sm:pt-14">
          <h1 className="max-w-xl text-balance text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            Your tech stack has feelings too.
          </h1>
          <p className="mt-5 max-w-2xl text-balance font-mono text-sm leading-6 text-secondary">
            Expressive stickers for every deploy, type error, rerender, and clean
            build.
          </p>
          <div className="mt-7 flex w-full max-w-2xl flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink as="a" href="#stickers" color="primary" size="lg">
              <Download aria-hidden="true" />
              Download
            </ButtonLink>
            <span className="text-sm text-tertiary">or</span>
            <div className="flex w-full items-center gap-2 rounded-xl border border-default bg-surface-secondary p-2 pl-4 shadow-sm sm:max-w-md">
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
              />
            </div>
          </div>
        </section>

        <section id="stickers" className="scroll-mt-2">
          <div className="sticky top-0 z-20 border-y border-subtle bg-surface/95 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:px-8">
              <Input
                className="w-full sm:max-w-lg"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search stickers…"
                aria-label="Search stickers"
                startAdornment={<Search className="size-4" aria-hidden="true" />}
                size="lg"
                pill
              />
              <label className="sm:ml-auto">
                <span className="sr-only">Sticker category</span>
                <select
                  className="h-10 w-full rounded-full border border-default bg-surface px-4 text-sm font-medium text-primary outline-none transition focus:border-strong sm:w-44"
                  value={selectedTechnology}
                  onChange={(event) => {
                    setSelectedTechnology(event.target.value)
                    setQuery('')
                  }}
                >
                  <option value="all">All technologies</option>
                  {technologies.map((technology) => (
                    <option key={technology.id} value={technology.id}>
                      {technology.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
            {collections.length === 0 && !loadError ? (
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
                    The R2 sticker collections could not be loaded. {loadError}.
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
                    className="transition duration-basic hover:-translate-y-0.5"
                    key={`${sticker.technology}:${sticker.id}`}
                  >
                    <div className="grid aspect-square place-items-center p-6 sm:p-8">
                      <Link
                        className="grid h-full w-full place-items-center"
                        to={`/stickers/${sticker.technology}/${sticker.id}`}
                        aria-label={`View ${sticker.name}`}
                      >
                        <img
                          className="h-full w-full object-contain"
                          src={sticker.imageUrl}
                          alt={`${sticker.name} ${sticker.technology} sticker`}
                          loading="lazy"
                        />
                      </Link>
                    </div>
                    <div className="flex flex-col items-center gap-1 px-5 pb-2 pt-4 text-center">
                      <h3 className="w-full truncate font-mono text-sm font-medium">
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
      </main>

      <SiteFooter />
    </div>
  )
}

function StickerDetailPage() {
  const { technology, stickerId } = useParams()
  const [collection, setCollection] = useState<StickerCollection | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadSticker() {
      setCollection(null)
      setLoadError(null)

      if (!technology || !stickerId) {
        setLoadError('Sticker not found')
        return
      }

      try {
        const response = await fetch(
          `/api/technologies/${technology}/stickers`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`Sticker API returned ${response.status}`)
        }

        setCollection((await response.json()) as StickerCollection)
      } catch (error) {
        if (controller.signal.aborted) return

        setLoadError(
          error instanceof Error ? error.message : 'Could not load sticker',
        )
      }
    }

    window.scrollTo(0, 0)
    void loadSticker()
    return () => controller.abort()
  }, [stickerId, technology])

  const sticker = collection?.stickers.find((item) => item.id === stickerId)
  const relatedStickers =
    collection?.stickers.filter((item) => item.id !== stickerId) ?? []
  const technologyName = collection?.technology.name ?? technology ?? 'Technology'

  return (
    <div className="min-h-screen bg-surface text-primary">
      <SiteHeader />
      <main>
        {!collection && !loadError ? (
          <div className="mx-auto w-full max-w-4xl animate-pulse px-5 py-12 sm:px-8">
            <div className="mx-auto aspect-square max-w-2xl rounded-3xl bg-surface-secondary" />
          </div>
        ) : loadError || !sticker ? (
          <div className="mx-auto grid min-h-[60vh] w-full max-w-4xl place-items-center px-5 py-16 text-center sm:px-8">
            <div>
              <h1 className="heading-2xl">Sticker not found</h1>
              <p className="mt-3 text-secondary">
                This sticker may have moved or does not exist.
              </p>
              <ButtonLink as={Link} to="/" className="mt-6" color="primary">
                <ArrowLeft aria-hidden="true" />
                Back to stickers
              </ButtonLink>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-6 sm:px-8 sm:pt-10">
            <Link
              className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary"
              to="/"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              All stickers
            </Link>

            <section className="mx-auto mt-8 max-w-3xl text-center">
              <div className="grid aspect-square place-items-center p-6 sm:p-12">
                <img
                  className="h-full w-full object-contain"
                  src={sticker.imageUrl}
                  alt={`${sticker.name} ${technologyName} sticker`}
                />
              </div>
              <ButtonLink
                as="a"
                href={sticker.imageUrl}
                download={sticker.file}
                className="mt-4"
                color="primary"
                size="lg"
              >
                <Download aria-hidden="true" />
                Download PNG
              </ButtonLink>

              <div className="mt-10 border-t border-subtle pt-10">
                <p className="font-mono text-sm text-secondary">
                  {technologyName}
                </p>
                <h1 className="heading-3xl mt-3 text-balance sm:heading-4xl">
                  {sticker.name}
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-balance text-secondary">
                  {sticker.name} is a {technologyName} reaction
                  sticker for {sticker.tags.join(', ')}.
                </p>
              </div>
            </section>

            <section className="mx-auto mt-16 max-w-3xl rounded-2xl border border-default bg-surface-secondary p-5 sm:p-7">
              <h2 className="heading-xl">Use it with npm</h2>
              <p className="mt-2 text-sm text-secondary">
                Install the package now. The final sticker export API is coming
                with the package release.
              </p>
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-default bg-surface p-2 pl-4">
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
                />
              </div>
              <div className="mt-3 rounded-xl border border-default bg-surface px-4 py-3">
                <span className="block text-xs text-tertiary">Sticker key</span>
                <code className="mt-1 block overflow-x-auto whitespace-nowrap font-mono text-sm">
                  {sticker.technology}/{sticker.id}
                </code>
              </div>
            </section>

            <section className="mt-20 border-t border-subtle pt-12">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-sm text-secondary">
                    {technologyName}
                  </p>
                  <h2 className="heading-2xl mt-2">More from this collection</h2>
                </div>
                <Link className="text-sm text-secondary hover:text-primary" to="/">
                  View all
                </Link>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedStickers.map((relatedSticker) => (
                  <Link
                    className="group text-center"
                    key={relatedSticker.id}
                    to={`/stickers/${relatedSticker.technology}/${relatedSticker.id}`}
                  >
                    <div className="grid aspect-square place-items-center p-4">
                      <img
                        className="h-full w-full object-contain transition duration-basic group-hover:scale-[1.02]"
                        src={relatedSticker.imageUrl}
                        alt={`${relatedSticker.name} ${technologyName} sticker`}
                      />
                    </div>
                    <span className="mt-3 block truncate font-mono text-sm">
                      {relatedSticker.name}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route
          path="/stickers/:technology/:stickerId"
          element={<StickerDetailPage />}
        />
        <Route path="*" element={<GalleryPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
