import { Badge } from '@openai/apps-sdk-ui/components/Badge'
import {
  ButtonLink,
  CopyButton,
} from '@openai/apps-sdk-ui/components/Button'
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  SimpleSmile,
} from '@openai/apps-sdk-ui/components/Icon'

const installCommand = 'npm install @amarmanhala/stickers'

function App() {
  return (
    <div className="min-h-screen bg-surface text-primary">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <a
          className="flex items-center gap-2 font-semibold tracking-tight"
          href="/"
          aria-label="Stickers home"
        >
          <span className="grid size-7 place-items-center rounded-lg bg-primary-solid text-primary-solid">
            <SimpleSmile className="size-4" aria-hidden="true" />
          </span>
          stickers
        </a>

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
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:py-32">
          <div className="max-w-2xl">
            <Badge color="discovery" variant="soft" pill>
              Package coming soon
            </Badge>

            <h1 className="heading-4xl mt-6 max-w-xl text-balance sm:heading-5xl">
              A small sticker for your big ideas.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-secondary">
              Download it, drop it into your project, or install the package when
              it lands on npm. One sticker, kept beautifully simple.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink
                as="a"
                href="/sticker-placeholder.svg"
                download="stickers-placeholder.svg"
                color="primary"
                size="lg"
              >
                <Download aria-hidden="true" />
                Download sticker
              </ButtonLink>
              <span className="text-sm text-tertiary">SVG placeholder</span>
            </div>

            <div className="mt-10 max-w-xl">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-sm font-medium">Install with npm</span>
                <span className="text-xs text-tertiary">Copy command</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-default bg-surface-secondary p-2 pl-4 shadow-sm">
                <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm">
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
          </div>

          <div className="max-w-xl lg:justify-self-end">
            <div className="grid aspect-square place-items-center rounded-4xl border border-subtle bg-surface p-10 shadow-lg sm:p-14">
              <img
                className="h-auto w-full max-w-72 drop-shadow-xl"
                src="/sticker-placeholder.svg"
                alt="Placeholder sticker with a smiling face"
              />
            </div>
            <div className="mt-4 flex items-center justify-between px-2 text-sm text-secondary">
              <span>Preview</span>
              <span>Final artwork coming soon</span>
            </div>
          </div>
        </section>

        <section className="border-t border-subtle">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3 sm:px-8 sm:py-16">
            <div>
              <p className="font-medium">Download ready</p>
              <p className="mt-2 text-sm text-secondary">
                Save the sticker directly from the page in one click.
              </p>
            </div>
            <div>
              <p className="font-medium">Package friendly</p>
              <p className="mt-2 text-sm text-secondary">
                A simple npm command will add it to any project.
              </p>
            </div>
            <div>
              <p className="font-medium">Easy to replace</p>
              <p className="mt-2 text-sm text-secondary">
                The placeholder is ready for the final artwork when it arrives.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-subtle">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-6 text-sm text-tertiary sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© 2026 stickers</span>
          <span>Made for small moments.</span>
        </div>
      </footer>
    </div>
  )
}

export default App
