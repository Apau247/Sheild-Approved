'use server'

import { ContactSchema, ShieldIdSchema, TrackingIdSchema } from './validators'

export type VerificationResponse =
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

export type TrackingResponse =
  | {
      status: 'found'
      trackingId: string
      route: string
      progress: number
      currentLocation: string
      eta: string
      timeline: Array<{ time: string; location: string; detail: string }>
    }
  | {
      status: 'invalid'
      trackingId: string
      message: string
    }

export type ContactResponse =
  | {
      status: 'submitted'
      name: string
      timestamp: string
    }
  | {
      status: 'invalid'
      message: string
    }

const MOCK_SHIELD_REGISTRY: Record<string, { id: string; entity: string; approvedAt: string; message: string }> = {
  'SH-2024-XYZ': {
    id: 'SH-2024-XYZ',
    entity: 'Aegis Private Vault',
    approvedAt: '2025-03-11',
    message: 'Shield identity confirmed. Vault security clearance granted.',
  },
  'SH-2024-ABC': {
    id: 'SH-2024-ABC',
    entity: 'Sentinel Asset Protection',
    approvedAt: '2024-12-01',
    message: 'Verified successfully. Entity is fully insured and approved.',
  },
  'SH-2024-QWE': {
    id: 'SH-2024-QWE',
    entity: 'Falcon Secure Holdings',
    approvedAt: '2025-02-08',
    message: 'Profile validated. All integrity checks completed.',
  },
  'SH-2024-RTY': {
    id: 'SH-2024-RTY',
    entity: 'Obsidian Trust Services',
    approvedAt: '2025-01-25',
    message: 'Authorization approved. Shield statement is authentic.',
  },
  'SH-2024-UOP': {
    id: 'SH-2024-UOP',
    entity: 'Helix Vault Consortium',
    approvedAt: '2024-11-18',
    message: 'Identity verified. Premium access confirmed.',
  },
}

const MOCK_TRACKING_REGISTRY: Record<
  string,
  {
    trackingId: string
    route: string
    progress: number
    currentLocation: string
    eta: string
    timeline: Array<{ time: string; location: string; detail: string }>
  }
> = {
  'TRK-2025-001': {
    trackingId: 'TRK-2025-001',
    route: 'London → Zurich → Dubai',
    progress: 88,
    currentLocation: 'Zurich Secure Hub',
    eta: '2025-05-24',
    timeline: [
      { time: '05:32 UTC', location: 'London Vault', detail: 'Armored shipment departed.' },
      { time: '12:15 UTC', location: 'Zurich Secure Hub', detail: 'Custody transferred to local partner.' },
      { time: '17:40 UTC', location: 'Dubai Clearance Center', detail: 'Customs pre-clearance in progress.' },
    ],
  },
  'TRK-2025-002': {
    trackingId: 'TRK-2025-002',
    route: 'New York → Geneva → Singapore',
    progress: 62,
    currentLocation: 'Geneva Distribution',
    eta: '2025-05-27',
    timeline: [
      { time: '03:00 UTC', location: 'New York Vault', detail: 'Asset secured for transport.' },
      { time: '10:20 UTC', location: 'Geneva Distribution', detail: 'Tracking updated with secure recheck.' },
      { time: '14:50 UTC', location: 'Dubai Gateway', detail: 'Awaiting final authorization.' },
    ],
  },
  'TRK-2025-009': {
    trackingId: 'TRK-2025-009',
    route: 'Tokyo → London → Johannesburg',
    progress: 95,
    currentLocation: 'London Transit Hub',
    eta: '2025-05-22',
    timeline: [
      { time: '01:10 UTC', location: 'Tokyo Vault', detail: 'Security manifest verified.' },
      { time: '11:40 UTC', location: 'London Transit Hub', detail: 'Transfer completed under escort.' },
      { time: '16:05 UTC', location: 'Johannesburg Gate', detail: 'Arrival ETA confirmed.' },
    ],
  },
}

export async function verifyShieldId(formData: FormData): Promise<VerificationResponse> {
  const shieldId = String(formData.get('shieldId') || '').trim().toUpperCase()
  const parsed = ShieldIdSchema.safeParse(shieldId)

  if (!parsed.success) {
    return {
      status: 'invalid',
      id: shieldId || 'UNKNOWN',
      message: 'Shield ID must use the format SH-YYYY-XXX.',
    }
  }

  if (!MOCK_SHIELD_REGISTRY[shieldId]) {
    return {
      status: 'invalid',
      id: shieldId,
      message: 'Shield ID not found in the secure registry.',
    }
  }

  return {
    status: 'approved',
    ...MOCK_SHIELD_REGISTRY[shieldId],
  }
}

export async function trackCargo(formData: FormData): Promise<TrackingResponse> {
  const trackingId = String(formData.get('trackingId') || '').trim().toUpperCase()
  const parsed = TrackingIdSchema.safeParse(trackingId)

  if (!parsed.success) {
    return {
      status: 'invalid',
      trackingId: trackingId || 'UNKNOWN',
      message: 'Tracking ID must use format TRK-2025-XXX.',
    }
  }

  if (!MOCK_TRACKING_REGISTRY[trackingId]) {
    return {
      status: 'invalid',
      trackingId,
      message: 'No active route matches that tracking reference.',
    }
  }

  return {
    status: 'found',
    ...MOCK_TRACKING_REGISTRY[trackingId],
  }
}

export async function submitContact(formData: FormData): Promise<ContactResponse> {
  const data = {
    name: String(formData.get('name') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    message: String(formData.get('message') || '').trim(),
  }

  const parsed = ContactSchema.safeParse(data)
  if (!parsed.success) {
    return {
      status: 'invalid',
      message: parsed.error.errors[0]?.message || 'Please complete the contact form correctly.',
    }
  }

  return {
    status: 'submitted',
    name: parsed.data.name,
    timestamp: new Date().toISOString(),
  }
}
