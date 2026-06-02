import { NextRequest, NextResponse } from 'next/server'
import { createLead, getAllLeads } from '@/lib/db'

// Принудительно используем Node.js Runtime — better-sqlite3 нативный
export const runtime = 'nodejs'

// POST /api/leads — создать новую заявку
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : ''
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const sphere = typeof body?.sphere === 'string' ? body.sphere.trim() : ''
    const message = typeof body?.message === 'string' ? body.message.trim() : ''

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Имя и телефон обязательны' },
        { status: 400 }
      )
    }

    const lead = createLead({
      name,
      phone,
      email: email || null,
      sphere: sphere || null,
      message: message || null,
    })

    return NextResponse.json({ success: true, lead }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/leads]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

// GET /api/leads — список всех заявок (для админки)
export async function GET(req: NextRequest) {
  // Простая защита по секретному ключу из заголовка
  const secret = req.headers.get('x-admin-secret')
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  const leads = getAllLeads()
  return NextResponse.json({ leads })
}
