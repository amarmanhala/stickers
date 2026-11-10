import { useMemo, useState } from 'react'
import { Badge } from '@openai/apps-sdk-ui/components/Badge'
import {
  ButtonLink,
  CopyButton,
} from '@openai/apps-sdk-ui/components/Button'
import { Input } from '@openai/apps-sdk-ui/components/Input'
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Copy,
  Search,
  SimpleSmile,
  Star,
} from '@openai/apps-sdk-ui/components/Icon'

const installCommand = 'npm install @amarmanhala/stickers'

const stickers = [
  {
    name: 'React',
    displayName: 'React',
    category: 'Library',
    color: 'text-blue-500',
    tilt: '-rotate-2',
  },
  {
    name: 'Angular',
    displayName: 'Angular',
    category: 'Framework',
    color: 'text-red-600',
    tilt: 'rotate-2',
  },
  {
    name: 'Vue',
    displayName: 'Vue.js',
    category: 'Framework',
    color: 'text-green-600',
    tilt: '-rotate-1',
  },
  {
    name: 'Svelte',
    displayName: 'Svelte',
    category: 'Framework',
    color: 'text-orange-600',
    tilt: 'rotate-2',
  },
  {
    name: 'TypeScript',
    displayName: 'TypeScript',
    category: 'Language',
    color: 'text-blue-700',
    tilt: 'rotate-1',
  },
  {
    name: 'JavaScript',
    displayName: '{ JavaScript }',
    category: 'Language',
    color: 'text-yellow-800',
    tilt: '-rotate-2',
  },
  {
    name: 'Next.js',
    displayName: 'next.js',
    category: 'Framework',
    color: 'text-black',
    tilt: '-rotate-1',
  },
  {
    name: 'Node.js',
    displayName: 'node.js',
    category: 'Runtime',
    color: 'text-green-700',
    tilt: 'rotate-2',
  },
  {
    name: 'Tailwind CSS',
    displayName: 'tailwindcss',
    category: 'Tool',
    color: 'text-cyan-600',
    tilt: 'rotate-1',
  },
  {
    name: 'Python',
    displayName: 'Python',
    category: 'Language',
    color: 'text-blue-600',
    tilt: '-rotate-2',
  },
  {
    name: 'Rust',
    displayName: 'Rust',
    category: 'Language',
    color: 'text-orange-800',
    tilt: 'rotate-2',
  },
  {
    name: 'Go',
    displayName: 'Go',
    category: 'Language',
    color: 'text-cyan-700',
    tilt: '-rotate-1',
  },
]

function App() {
  const [query, setQuery] = useState('')

  const filteredStickers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return stickers
    }

    return stickers.filter((sticker) =>
      `${sticker.name} ${sticker.category}`
        .toLowerCase()
        .includes(normalizedQuery),
    )
  }, [query])

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
          <Badge color="discovery" variant="soft" pill>
            Tech sticker pack · coming soon
          </Badge>

          <h1 className="heading-4xl mt-7 max-w-3xl text-balance sm:heading-5xl">
            Your stack deserves better stickers.
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-lg text-secondary">
            React on your laptop. Angular on your bottle. Tiny text stickers for
            the frameworks, languages, and tools you actually use.
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

          <div className="mt-14 flex flex-wrap items-center justify-center gap-3" aria-label="Sticker examples">
            <span className="-rotate-3 rounded-xl border-2 border-black bg-white px-5 py-3 font-mono text-lg font-bold text-blue-600 shadow-md">
              React
            </span>
            <span className="rotate-2 rounded-xl border-2 border-black bg-white px-5 py-3 font-mono text-lg font-bold text-red-600 shadow-md">
              Angular
            </span>
            <span className="-rotate-1 rounded-xl border-2 border-black bg-white px-5 py-3 font-mono text-lg font-bold text-blue-700 shadow-md">
              TypeScript
            </span>
          </div>
        </section>

        <section className="border-y border-subtle bg-surface-secondary">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3 sm:px-8 sm:py-16">
            <div>
              <p className="font-medium">Framework favourites</p>
              <p className="mt-2 text-sm text-secondary">
                React, Angular, Vue, Svelte, and the tools around them.
              </p>
            </div>
            <div>
              <p className="font-medium">Made for developers</p>
              <p className="mt-2 text-sm text-secondary">
                Clean type, strong outlines, and a little terminal energy.
              </p>
            </div>
            <div>
              <p className="font-medium">Download or install</p>
              <p className="mt-2 text-sm text-secondary">
                Grab one sticker or add the complete pack from npm.
              </p>
            </div>
          </div>
        </section>

        <section id="stickers" className="scroll-mt-2">
          <div className="mx-auto w-full max-w-6xl px-5 pb-4 pt-20 sm:px-8 sm:pt-24">
            <div className="max-w-2xl">
              <Badge color="secondary" variant="soft" pill>
                The sticker shelf
              </Badge>
              <h2 className="heading-3xl mt-5 text-balance sm:heading-4xl">
                Find your favourite technology.
              </h2>
              <p className="mt-4 text-lg text-secondary">
                Search the first collection. The artwork is placeholder text for
                now, ready to be swapped with the final sticker files.
              </p>
            </div>
          </div>

          <div className="sticky top-0 z-20 border-y border-subtle bg-surface/95 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:px-8">
              <Input
                className="w-full sm:max-w-md"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search React, Angular, TypeScript…"
                aria-label="Search stickers"
                startAdornment={<Search className="size-4" aria-hidden="true" />}
                size="lg"
                pill
              />
              <div className="flex items-center justify-between gap-3 sm:ml-auto sm:justify-end">
                <Badge color="secondary" variant="soft" pill>
                  All stickers
                </Badge>
                <span className="text-sm text-secondary" aria-live="polite">
                  {filteredStickers.length} result{filteredStickers.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
            {filteredStickers.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredStickers.map((sticker) => (
                  <article
                    className="group rounded-3xl border border-subtle bg-surface p-3 shadow-sm transition duration-basic hover:-translate-y-0.5 hover:shadow-md"
                    key={sticker.name}
                  >
                    <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl bg-surface-secondary p-6">
                      <div
                        className={`${sticker.tilt} max-w-full rounded-xl border-[3px] border-black bg-white px-5 py-4 text-center font-mono text-xl font-bold tracking-tight shadow-md transition duration-basic group-hover:rotate-0 sm:text-2xl ${sticker.color}`}
                      >
                        {sticker.displayName}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 px-2 pb-2 pt-4">
                      <div>
                        <h3 className="font-medium">{sticker.name}</h3>
                        <p className="mt-0.5 text-sm text-secondary">
                          {sticker.category}
                        </p>
                      </div>
                      <Badge color="discovery" variant="soft" pill>
                        Soon
                      </Badge>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="grid min-h-80 place-items-center rounded-3xl border border-dashed border-default bg-surface-secondary px-6 text-center">
                <div>
                  <p className="heading-lg">No sticker found</p>
                  <p className="mt-2 text-secondary">
                    Try another framework, language, or tool.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-subtle">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 py-20 text-center sm:px-8 sm:py-24">
            <Badge color="info" variant="soft" pill>
              npm package coming later
            </Badge>
            <h2 className="heading-3xl mt-5 text-balance">
              One command. The whole sticker drawer.
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
          <span>Built for the tools you love.</span>
        </div>
      </footer>
    </div>
  )
}

export default App
