import { NextRequest, NextResponse } from 'next/server'
import { updateLeadStatus, deleteLead, getLead, type LeadStatus } from '@/lib/db'

export const runtime = 'nodejs'

const ALLOWED_STATUSES: ReadonlyArray<LeadStatus> = ['new', 'in_progress', 'done']

function isAdmin(req: NextRequest): boolean {
  const secret = req.headers.get('x-admin-secret')
  return !!process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET
}

function parseId(value: string): number | null {
  const id = Number.parseInt(value, 10)
  return Number.isFinite(id) && id > 0 ? id : null
}

// PATCH /api/leads/[id] — обновить статус
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  const id = parseId(params.id)
  if (id === null) {
    return NextResponse.json({ error: 'Неверный id' }, { status: 400 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Некорректный JSON' }, { status: 400 })
  }

  const status = (body as { status?: unknown })?.status
  if (typeof status !== 'string' || !ALLOWED_STATUSES.includes(status as LeadStatus)) {
    return NextResponse.json({ error: 'Неверный статус' }, { status: 400 })
  }

  const ok = updateLeadStatus(id, status as LeadStatus)
  if (!ok) {
    return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 })
  }

  return NextResponse.json({ success: true, lead: getLead(id) })
}

// DELETE /api/leads/[id] — удалить заявку
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  const id = parseId(params.id)
  if (id === null) {
    return NextResponse.json({ error: 'Неверный id' }, { status: 400 })
  }

  const ok = deleteLead(id)
  if (!ok) {
    return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
