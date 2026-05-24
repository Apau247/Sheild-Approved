'use client'

import { useState, useTransition, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Loader2, ShieldCheck, Sparkles } from 'lucide-react'
import { ShieldIdSchema } from '@/lib/validators'
import { verifyShieldId } from '@/lib/actions'

type VerificationResponse =
  | {
      status: 'approved'
      id: string
      entity: string
      approvedAt: string
      message: string
    }
  | {
      status: 'invalid'
      id: string
      message: string
    }

export default function VerificationWidget() {
  const [shieldId, setShieldId] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [result, setResult] = useState<VerificationResponse | null>(null)
  const [isPending, startTransition] = useTransition()

  const clientValidation = useMemo(() => {
    if (shieldId.length === 0) return null
    const parsed = ShieldIdSchema.safeParse(shieldId.toUpperCase())
    return parsed.success ? null : parsed.error.issues[0].message
  }, [shieldId])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const parsed = ShieldIdSchema.safeParse(shieldId.toUpperCase())
    if (!parsed.success) {
      setValidationError('Shield ID must use format SH-2024-XYZ.')
      setResult(null)
      return
    }

    setValidationError(null)
    startTransition(() => {
      verifyShieldId(formData).then((response) => {
        setResult(response)
      })
    })
  }

  return (
    <section className="mx-auto w-full max-w-3xl rounded-[28px] border border-white/10 bg-black/40 p-6 shadow-2xl shadow-emerald-900/10 backdrop-blur-xl sm:p-10">
      <div className="flex flex-col gap-6 text-center text-slate-100">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-300 shadow-lg shadow-emerald-500/10">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.36em] text-emerald-300/80">Verification Portal</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Confirm shield identities instantly.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Enter a Shield ID to verify secure vault clearance with trust, speed, and premium glassmorphism styling.
          </p>
        </div>
      </div>

      <form className="mt-10 grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-left text-sm font-medium text-slate-200" htmlFor="shieldId">
          Shield ID
          <input
            id="shieldId"
            name="shieldId"
            value={shieldId}
            onChange={(event) => {
              setShieldId(event.target.value)
              setResult(null)
              setValidationError(null)
            }}
            placeholder="SH-2024-XYZ"
            className="rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-white outline-none transition focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-500/20"
            aria-invalid={Boolean(clientValidation || validationError)}
            aria-describedby="shieldIdHelp"
            autoComplete="off"
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p id="shieldIdHelp" className="text-xs text-slate-400">
            Pattern: <span className="font-semibold text-slate-100">SH-YYYY-XXX</span>
          </p>
          <button
            type="submit"
            disabled={isPending || shieldId.trim().length === 0 || Boolean(clientValidation)}
            className="inline-flex items-center justify-center rounded-3xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 disabled:cursor-not-allowed disabled:bg-emerald-500/40"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify'
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {(clientValidation || validationError) && (
            <motion.div
              key="validation"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-3xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
            >
              {clientValidation || validationError}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="mt-8 min-h-[220px]">
        <AnimatePresence mode="wait">
          {isPending ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-xl shadow-emerald-900/10"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded-3xl bg-slate-800/70" />
                <div className="space-y-3 flex-1">
                  <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-800/70" />
                  <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-800/70" />
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="h-3 rounded-full bg-slate-800/70" />
                <div className="h-3 rounded-full bg-slate-800/70" />
                <div className="h-3 w-5/6 rounded-full bg-slate-800/70" />
              </div>
            </motion.div>
          ) : result ? (
            <motion.div
              key={result.status}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`rounded-[28px] border p-6 shadow-xl shadow-emerald-900/15 ${
                result.status === 'approved'
                  ? 'border-emerald-400/20 bg-emerald-500/10'
                  : 'border-rose-400/20 bg-rose-500/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`grid h-14 w-14 place-items-center rounded-3xl ${
                    result.status === 'approved' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'
                  }`}
                >
                  {result.status === 'approved' ? (
                    <CheckCircle2 className="h-8 w-8" />
                  ) : (
                    <AlertTriangle className="h-8 w-8" />
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-300">
                    {result.status === 'approved' ? 'Approved' : 'Invalid / Not Found'}
                  </p>
                  <h3 className="text-xl font-semibold text-white">
                    {result.status === 'approved'
                      ? `${result.entity} verified`
                      : `Shield ID ${result.id} could not be located`}
                  </h3>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-black/30 p-4 text-sm text-slate-200">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Shield ID</p>
                  <p className="mt-2 font-semibold text-white">{result.id}</p>
                </div>
                {result.status === 'approved' ? (
                  <div className="rounded-3xl border border-white/10 bg-black/30 p-4 text-sm text-slate-200">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Approval date</p>
                    <p className="mt-2 font-semibold text-white">{result.approvedAt}</p>
                  </div>
                ) : null}
                <div className="rounded-3xl border border-white/10 bg-black/30 p-4 text-sm text-slate-200">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Status details</p>
                  <p className={`mt-2 font-semibold ${result.status === 'approved' ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {result.status === 'approved' ? 'Verified vault asset' : 'Verification failed'}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-300">{result.message}</p>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 text-slate-400"
            >
              <div className="flex items-center gap-3 text-sm leading-6">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-300">
                  <Sparkles className="h-5 w-5" />
                </span>
                <span>Enter a Shield ID to reveal verification status and secure credential details.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
