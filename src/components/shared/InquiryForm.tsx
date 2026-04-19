'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Send, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  type: z.string(),
})

type FormData = z.infer<typeof schema>

interface InquiryFormProps {
  propertyId?: string
  propertyTitle?: string
  agentName?: string
  className?: string
}

const INQUIRY_TYPES = [
  { value: 'RENT', label: 'Interested in Renting' },
  { value: 'PURCHASE', label: 'Interested in Buying' },
  { value: 'GENERAL', label: 'General Enquiry' },
  { value: 'VALUATION', label: 'Request Valuation' },
]

export function InquiryForm({ propertyId, propertyTitle, agentName, className }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'GENERAL' },
  })

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, propertyId }),
      })
      setSubmitted(true)
    } catch {
      // silently handled — in production this would show a toast
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn('bg-bg-card border border-bg-border p-8 text-center', className)}
      >
        <CheckCircle className="w-12 h-12 text-gold mx-auto mb-4" />
        <h3 className="font-display text-xl text-white mb-2">Message Sent!</h3>
        <p className="text-text-muted text-sm">
          {agentName ? `${agentName} will` : 'Our team will'} be in touch within 24 hours.
        </p>
      </motion.div>
    )
  }

  return (
    <div className={cn('bg-bg-card border border-bg-border p-6', className)}>
      <h3 className="font-display text-xl font-medium text-white mb-1">Send an Enquiry</h3>
      {propertyTitle && (
        <p className="text-text-muted text-xs font-heading mb-5 line-clamp-1">Re: {propertyTitle}</p>
      )}
      {!propertyTitle && <div className="mb-5" />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Inquiry type */}
        <div>
          <label className="block text-xs text-text-muted font-heading uppercase tracking-widest mb-2">
            Enquiry Type
          </label>
          <select
            {...register('type')}
            className="w-full bg-bg-elevated border border-bg-border text-white text-sm py-3 px-4 focus:outline-none focus:border-gold/60 transition-colors font-body"
          >
            {INQUIRY_TYPES.map((t) => (
              <option key={t.value} value={t.value} className="bg-bg-elevated">
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs text-text-muted font-heading uppercase tracking-widest mb-2">
            Full Name *
          </label>
          <input
            {...register('name')}
            placeholder="Your full name"
            className={cn(
              'w-full bg-bg-elevated border text-white text-sm py-3 px-4 placeholder-text-muted focus:outline-none transition-colors font-body',
              errors.name ? 'border-red-500/60' : 'border-bg-border focus:border-gold/60'
            )}
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs text-text-muted font-heading uppercase tracking-widest mb-2">
            Email Address *
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="you@example.com"
            className={cn(
              'w-full bg-bg-elevated border text-white text-sm py-3 px-4 placeholder-text-muted focus:outline-none transition-colors font-body',
              errors.email ? 'border-red-500/60' : 'border-bg-border focus:border-gold/60'
            )}
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs text-text-muted font-heading uppercase tracking-widest mb-2">
            Phone (optional)
          </label>
          <input
            {...register('phone')}
            type="tel"
            placeholder="+1 (902) 555-0000"
            className="w-full bg-bg-elevated border border-bg-border text-white text-sm py-3 px-4 placeholder-text-muted focus:outline-none focus:border-gold/60 transition-colors font-body"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs text-text-muted font-heading uppercase tracking-widest mb-2">
            Message *
          </label>
          <textarea
            {...register('message')}
            rows={4}
            placeholder="Tell us about your requirements…"
            className={cn(
              'w-full bg-bg-elevated border text-white text-sm py-3 px-4 placeholder-text-muted focus:outline-none transition-colors resize-none font-body',
              errors.message ? 'border-red-500/60' : 'border-bg-border focus:border-gold/60'
            )}
          />
          {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-3 py-4 bg-gold text-bg-base font-heading font-bold text-xs uppercase tracking-widest hover:bg-gold-light transition-colors disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Enquiry
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-text-muted leading-relaxed">
          By submitting you agree to our privacy policy. We never share your details.
        </p>
      </form>
    </div>
  )
}
