import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div className="min-h-screen bg-[var(--bg-0)] text-[var(--text-1)]">
      <header className="mx-auto max-w-[1200px] px-6 pt-8">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">JARVIS</div>
            <div className="mt-1 text-base font-semibold tracking-[-0.01em]">AI Assistant</div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="h-9 px-3 text-sm font-medium border border-[var(--stroke-1)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--stroke-2)] inline-flex items-center"
              style={{ borderRadius: 'var(--r-1)' }}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="h-9 px-3 text-sm font-medium border border-[var(--stroke-1)] bg-[var(--accent-soft)] text-[var(--text-1)] hover:border-[var(--stroke-2)] inline-flex items-center"
              style={{ borderRadius: 'var(--r-1)' }}
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 pb-16 pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <section className="lg:col-span-6">
            <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">PREMIUM AI WORKSPACE</div>
            <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-[-0.04em] leading-[1.05]">
              Calm, intelligent assistance.
              <span className="block text-[var(--text-2)] mt-3">Built for daily productivity.</span>
            </h1>
            <p className="mt-6 text-base text-[var(--text-2)] leading-7 max-w-[56ch]">
              A clean AI console for chat, planning, and focused execution. Minimal visuals, comfortable typography, and subtle depth.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/app"
                className="h-11 px-5 text-sm font-medium border border-[var(--stroke-1)] bg-[var(--text-1)] text-[var(--bg-0)] hover:opacity-90 inline-flex items-center"
                style={{ borderRadius: 'var(--r-1)', boxShadow: 'var(--shadow-1)' }}
              >
                Open Dashboard
              </Link>
              <Link
                to="/register"
                className="h-11 px-5 text-sm font-medium border border-[var(--stroke-1)] text-[var(--text-1)] hover:border-[var(--stroke-2)] inline-flex items-center"
                style={{ borderRadius: 'var(--r-1)' }}
              >
                Create account
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { k: 'Clean UI', v: 'Off-white theme, calm contrast, long-session comfort.' },
                { k: 'Focused Chat', v: 'Elegant bubbles, premium composer, minimal distractions.' },
                { k: 'Widgets', v: 'Calendar and email flows with preview → confirm.' },
              ].map((x) => (
                <div key={x.k} className="jarvis-surface p-4" style={{ borderRadius: 'var(--r-2)' }}>
                  <div className="text-xs font-medium tracking-[0.16em] text-[var(--text-3)]">{x.k.toUpperCase()}</div>
                  <div className="mt-2 text-sm text-[var(--text-2)] leading-6">{x.v}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="lg:col-span-6">
            <div className="jarvis-surface p-5" style={{ borderRadius: 'var(--r-2)', boxShadow: 'var(--shadow-2)' }}>
              <div className="border border-[var(--stroke-1)] bg-[var(--bg-2)]" style={{ borderRadius: 'var(--r-2)' }}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--stroke-1)]">
                  <div className="text-xs font-medium tracking-[0.16em] text-[var(--text-3)]">AI DASHBOARD PREVIEW</div>
                  <div className="text-xs font-mono text-[var(--text-3)]">/app</div>
                </div>
                <div className="p-4 grid grid-cols-12 gap-3">
                  <div className="col-span-5">
                    <div className="h-9 border border-[var(--stroke-1)] bg-[var(--bg-1)]" style={{ borderRadius: 'var(--r-1)' }} />
                    <div className="mt-3 space-y-2">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-11 border border-[var(--stroke-1)] bg-[var(--bg-1)]"
                          style={{ borderRadius: 'var(--r-1)', opacity: 1 - i * 0.12 }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="col-span-7">
                    <div className="h-9 border border-[var(--stroke-1)] bg-[var(--bg-1)]" style={{ borderRadius: 'var(--r-1)' }} />
                    <div className="mt-3 space-y-3">
                      <div className="border border-[var(--stroke-1)] bg-[var(--bg-1)] p-3" style={{ borderRadius: 'var(--r-2)' }}>
                        <div className="text-[11px] font-medium tracking-[0.16em] text-[var(--text-3)]">YOU</div>
                        <div className="mt-2 text-sm text-[var(--text-2)]">Plan my day. Keep it calm and focused.</div>
                      </div>
                      <div className="border border-[var(--stroke-1)] bg-[var(--bg-2)] p-3" style={{ borderRadius: 'var(--r-2)' }}>
                        <div className="text-[11px] font-medium tracking-[0.16em] text-[var(--text-3)]">JARVIS</div>
                        <div className="mt-2 text-sm text-[var(--text-2)] leading-6">
                          Here’s a minimal plan with three priorities, two deep-work blocks, and one recovery window.
                        </div>
                      </div>
                      <div className="jarvis-input h-11 px-4 flex items-center" style={{ borderRadius: 'var(--r-1)' }}>
                        <div className="text-sm text-[var(--text-3)]">Type a message…</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-16">
          <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">FEATURES</div>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">Everything you need, nothing you don’t.</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Minimal dashboard',
                desc: 'A clean grid layout with subtle depth, designed for long sessions.',
              },
              {
                title: 'Safe actions',
                desc: 'Calendar/email actions use Preview → Confirm to stay reliable.',
              },
              {
                title: 'Comfort typography',
                desc: 'Calm contrast, modern sans-serif, and generous whitespace.',
              },
            ].map((f) => (
              <div key={f.title} className="jarvis-surface p-5" style={{ borderRadius: 'var(--r-2)' }}>
                <div className="text-base font-semibold tracking-[-0.01em]">{f.title}</div>
                <div className="mt-2 text-sm text-[var(--text-2)] leading-6">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 jarvis-surface p-6" style={{ borderRadius: 'var(--r-2)' }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-xs font-medium tracking-[0.18em] text-[var(--text-3)]">GET STARTED</div>
              <div className="mt-2 text-xl font-semibold tracking-[-0.02em]">Open the console in seconds.</div>
              <div className="mt-2 text-sm text-[var(--text-2)]">No visual noise. Just a premium AI workspace.</div>
            </div>
            <div className="flex gap-2">
              <Link
                to="/app"
                className="h-11 px-5 text-sm font-medium border border-[var(--stroke-1)] bg-[var(--text-1)] text-[var(--bg-0)] hover:opacity-90 inline-flex items-center"
                style={{ borderRadius: 'var(--r-1)', boxShadow: 'var(--shadow-1)' }}
              >
                Open Dashboard
              </Link>
              <Link
                to="/login"
                className="h-11 px-5 text-sm font-medium border border-[var(--stroke-1)] text-[var(--text-1)] hover:border-[var(--stroke-2)] inline-flex items-center"
                style={{ borderRadius: 'var(--r-1)' }}
              >
                Login
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-[1200px] px-6 pb-10">
        <div className="text-xs text-[var(--text-3)]">© {new Date().getFullYear()} JARVIS. Premium AI assistant UI.</div>
      </footer>
    </div>
  );
}
