import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// База данных хранится в папке /data рядом с проектом
const DB_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DB_DIR, 'leads.db')

// Создаём папку data если не существует
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true })
}

const db = new Database(DB_PATH)
try {
  db.pragma('journal_mode = WAL')
} catch (e) {
  // ignore during build
}

// Создаём таблицу заявок если не существует
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    phone       TEXT    NOT NULL,
    email       TEXT,
    sphere      TEXT,
    message     TEXT,
    status      TEXT    DEFAULT 'new',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`)

export type LeadStatus = 'new' | 'in_progress' | 'done'

export interface Lead {
  id: number
  name: string
  phone: string
  // Эти поля в БД допускают NULL — отражаем это в типе
  email: string | null
  sphere: string | null
  message: string | null
  status: LeadStatus
  created_at: string
}

export type NewLead = {
  name: string
  phone: string
  email?: string | null
  sphere?: string | null
  message?: string | null
}

// Создать новую заявку
export function createLead(data: NewLead): Lead {
  const stmt = db.prepare(`
    INSERT INTO leads (name, phone, email, sphere, message)
    VALUES (@name, @phone, @email, @sphere, @message)
  `)
  const result = stmt.run({
    name: data.name,
    phone: data.phone,
    email: data.email ?? null,
    sphere: data.sphere ?? null,
    message: data.message ?? null,
  })
  // lastInsertRowid имеет тип number | bigint — безопасно приводим к number
  const id = Number(result.lastInsertRowid)
  const lead = getLead(id)
  if (!lead) {
    throw new Error(`Не удалось получить созданную заявку id=${id}`)
  }
  return lead
}

// Получить одну заявку по id
export function getLead(id: number): Lead | undefined {
  return db.prepare('SELECT * FROM leads WHERE id = ?').get(id) as Lead | undefined
}

// Получить все заявки (новые сначала)
export function getAllLeads(): Lead[] {
  return db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all() as Lead[]
}

// Обновить статус заявки
export function updateLeadStatus(id: number, status: LeadStatus): boolean {
  const result = db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, id)
  return result.changes > 0
}

// Удалить заявку
export function deleteLead(id: number): boolean {
  const result = db.prepare('DELETE FROM leads WHERE id = ?').run(id)
  return result.changes > 0
}

export default db
