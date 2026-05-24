'use client'

import { useMemo, useState, useTransition } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, PackageSearch, Clock, Loader2, ShieldAlert } from 'lucide-react'
import { TrackingIdSchema } from '@/lib/validators'
import { trackCargo } from '@/lib/actions'

export default function TrackingWidget() {
  const [trackingId, setTrackingId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any | null>(null)
  const [isPending, startTransition] = useTransition()

  const validationMessage = useMemo(() => {
    if (!trackingId) return null
    const validation = TrackingIdSchema.safeParse(trackingId.toUpperCase())
    return validation.success ? null : validation.error.issues[0].message
  }, [trackingId])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    if (validationMessage) {
      setError('Please use TRK-2025-XYZ to continue.')
      setResult(null)
      return
    }

    setError(null)
    startTransition(() => {
      trackCargo(formData).then((response) => {
        setResult(response)
      })
    })
  }

  return (
    <section className="glass-panel rounded-[32px] border border-white/10 p-6 shadow-2xl shadow-emerald-900/10 sm:p-10">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-12">
        <div>
          <p className="text-sm uppercase tracking-[0.36em] text-emerald-300/80">Cargo tracking</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Track shield-protected routes in real time.</h2>
          <p className="mt-4 text-slate-400">
            Enter your tracking reference to see a secure route summary, current location, and status timeline for high-value shipments.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="text-sm font-medium text-slate-200" htmlFor="trackingId">
              Tracking ID
            </label>
            <input
              id="trackingId"
              name="trackingId"
              value={trackingId}
              onChange={(event) => {
                setTrackingId(event.target.value)
                setError(null)
                setResult(null)
              }}
              placeholder="TRK-2025-001"
              className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-5 py-4 text-white outline-none transition focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-500/20"
              autoComplete="off"
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
              <p className="text-xs text-slate-400">Pattern: TRK-2025-XXX</p>
              <button
                type="submit"
                disabled={isPending || !trackingId || Boolean(validationMessage)}
                className="inline-flex items-center justify-center rounded-3xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/40"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Locating...
                  </>
                ) : (
                  'Track shipment'
                )}
              </button>
            </div>
            {(validationMessage || error) && (
              <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {validationMessage || error}
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="mt-8 min-h-[260px]">
        <AnimatePresence mode="wait">
          {isPending ? (
            <motion.div
              key="tracking-skeleton"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-[28px] border border-white/10 bg-slate-950/70 p-6"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded-3xl bg-slate-800/70" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-800/70" />
                  <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-800/70" />
                </div>
              </div>
              <div className="mt-6 grid gap-3">
                <div className="h-3 rounded-full bg-slate-800/70" />
                <div className="h-3 rounded-full bg-slate-800/70" />
                <div className="h-3 rounded-full bg-slate-800/70" />
              </div>
            </motion.div>
          ) : result ? (
            <motion.div
              key={result.trackingId || 'tracking-result'}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6"
            >
              {result.status === 'found' ? (
                <>
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.32em] text-emerald-300/80">Route confirmed</p>
                      <h3 className="mt-3 text-2xl font-semibold text-white">{result.trackingId}</h3>
                      <p className="mt-2 text-sm text-slate-400">{result.route}</p>
                    </div>
                    <div className="rounded-3xl bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
                      {result.progress}% complete
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Current location</p>
                      <p className="mt-2 text-sm font-semibold text-white">{result.currentLocation}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">ETA</p>
                      <p className="mt-2 text-sm font-semibold text-white">{result.eta}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Status</p>
                      <p className="mt-2 text-sm font-semibold text-emerald-300">In transit</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {result.timeline.map((event: any) => (
                      <div key={`${event.time}-${event.location}`} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{event.time}</p>
                        <p className="mt-1 font-semibold text-white">{event.location}</p>
                        <p className="mt-2 text-sm text-slate-300">{event.detail}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-[28px] border border-rose-400/20 bg-rose-500/10 p-6 text-rose-100">
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <ShieldAlert className="h-6 w-6 text-rose-300" />
                    <span>Tracking ID not recognized.</span>
                  </div>
                  <p className="mt-3 text-sm text-rose-100/90">{result.message}</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="tracking-placeholder"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 text-slate-400"
            >
              <div className="flex items-center gap-3 text-sm leading-7">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-slate-900/80 text-emerald-300">
                  <PackageSearch className="h-5 w-5" />
                </div>
                <p>Enter a tracking ID to view the route summary for secure Shield shipments.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
