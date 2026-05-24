'use client'

import { useMemo, useState, useTransition } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, ShieldCheck, Loader2 } from 'lucide-react'
import { ContactSchema } from '@/lib/validators'
import { submitContact } from '@/lib/actions'

export default function ContactSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [result, setResult] = useState<any | null>(null)
  const [isPending, startTransition] = useTransition()

  const validationMessage = useMemo(() => {
    const parsed = ContactSchema.safeParse({ name, email, message })
    if (name === '' && email === '' && message === '') return null
    return parsed.success ? null : parsed.error.errors[0]?.message ?? null
  }, [name, email, message])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    if (validationMessage) {
      setFeedback('Please complete all fields before sending.')
      setResult(null)
      return
    }

    setFeedback(null)
    startTransition(() => {
      submitContact(formData).then((response) => {
        if (response.status === 'submitted') {
          setResult(response)
          setName('')
          setEmail('')
          setMessage('')
        } else {
          setFeedback(response.message)
        }
      })
    })
  }

  return (
    <section className="glass-panel rounded-[32px] border border-white/10 p-6 shadow-2xl shadow-emerald-900/10 sm:p-10">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14">
        <div>
          <p className="text-sm uppercase tracking-[0.36em] text-emerald-300/80">Contact support</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Secure request intake for Shield Approved.</h2>
          <p className="mt-4 text-slate-400">
            Send a secure message to Iron Vault Security and receive fast, trusted response guidance for verification, cargo routing, or service onboarding.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</p>
              <p className="mt-2 text-sm font-semibold text-white">support@shieldapproved.co</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Response</p>
              <p className="mt-2 text-sm font-semibold text-white">Within 24 hours</p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="text-sm font-medium text-slate-200">
                Full name
              </label>
              <input
                id="name"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Alex Morgan"
                className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-4 text-white outline-none transition focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-slate-200">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="alex@domain.com"
                className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-4 text-white outline-none transition focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-medium text-slate-200">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={5}
                placeholder="Tell us about your verification or cargo request."
                className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-4 text-white outline-none transition focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <button
              type="submit"
              disabled={isPending || !name || !email || !message || Boolean(validationMessage)}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/40"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending request
                </>
              ) : (
                'Send request'
              )}
            </button>
            <AnimatePresence mode="wait">
              {feedback ? (
                <motion.div
                  key="contact-feedback"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-3xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                >
                  {feedback}
                </motion.div>
              ) : null}
              {result ? (
                <motion.div
                  key="contact-success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
                >
                  <div className="flex items-center gap-2 font-semibold text-emerald-300">
                    <ShieldCheck className="h-4 w-4" />
                    Request sent successfully
                  </div>
                  <p className="mt-2 text-slate-100">Thanks, {result.name}. We will respond within one business day.</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  )
}
