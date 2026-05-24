import StickyNavbar from '@/components/StickyNavbar'
import VerificationWidget from '@/components/VerificationWidget'
import CounterSection from '@/components/CounterSection'
import CargoStatsSection from '@/components/CargoStatsSection'
import TrackingWidget from '@/components/TrackingWidget'
import ContactSection from '@/components/ContactSection'

export default function HomePage() {
  return (
    <>
      <StickyNavbar />
      <main className="relative overflow-hidden bg-slate-950 text-slate-100">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.24),_transparent_32%)] blur-3xl" />
        <section id="home" className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[0.95fr_0.8fr] lg:items-center lg:gap-16">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-emerald-400/15 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 shadow-lg shadow-emerald-900/10">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">✓</span>
                Trusted security verification for premium vaults
              </div>
              <div className="space-y-6">
                <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                  Shield Approved protection for elite cargo, high-value assets, and secure verification.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  Modernize your security presence with a dark-glass experience, a live verification portal, and an intuitive wallet-safe platform for Shield Approved.
                </p>
              </div>
              <div className="grid gap-4 sm:max-w-xl sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-900/10">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Brand</p>
                  <p className="mt-3 text-2xl font-semibold text-white">Iron Vault Security</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-900/10">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Experience</p>
                  <p className="mt-3 text-2xl font-semibold text-white">Secure verification built for premium workflows</p>
                </div>
              </div>
            </div>
            <div className="rounded-[32px] border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.34em] text-emerald-300/90">Shield verification</p>
                <h2 className="text-3xl font-semibold text-white">Verification Portal</h2>
                <p className="text-slate-400">
                  Check Shield IDs instantly with premium validation and secure server-side lookup. Enter your code and get approval status in seconds.
                </p>
              </div>
              <div className="mt-8">
                <VerificationWidget />
              </div>
            </div>
          </div>
        </section>

        <section id="stats" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <CounterSection />
        </section>

        <section id="cargo-stats" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <CargoStatsSection />
        </section>

        <section id="tracking" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <TrackingWidget />
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <ContactSection />
        </section>

        <section className="border-t border-white/10 bg-slate-950/80 px-4 py-10 text-slate-400 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">© {new Date().getFullYear()} Shield Approved · Iron Vault Security.</p>
            <p className="text-sm">Secure verification, trusted cargo routing, and premium shield assurance.</p>
          </div>
        </section>
      </main>
    </>
  )
}
