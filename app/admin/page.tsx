'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import styles from './admin.module.css'

type LeadStatus = 'new' | 'in_progress' | 'done'
type Lead = {
  id: number
  name: string
  phone: string
  email: string | null
  sphere: string | null
  message: string | null
  status: LeadStatus
  created_at: string
}

type FilterStatus = LeadStatus | 'all'

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Новая', in_progress: 'В работе', done: 'Завершена'
}

const AUTO_REFRESH_INTERVAL = 30000

export default function AdminPage() {
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Lead | null>(null)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const secretRef = useRef(secret)
  useEffect(() => { secretRef.current = secret }, [secret])

  const fetchLeads = useCallback(async (sec: string, silent = false) => {
    if (!sec) return
    if (!silent) setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/leads', { headers: { 'x-admin-secret': sec } })
      if (res.status === 401) {
        setError('Неверный пароль')
        setAuthed(false)
        return
      }
      const data = await res.json()
      setLeads(Array.isArray(data.leads) ? data.leads : [])
      setAuthed(true)
    } catch {
      if (!silent) setError('Ошибка загрузки')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authed) return
    const interval = setInterval(() => fetchLeads(secretRef.current, true), AUTO_REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [authed, fetchLeads])

  const filteredLeads = leads.filter(l => 
    (filterStatus === 'all' || l.status === filterStatus) &&
    (!searchQuery || 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.phone.includes(searchQuery))
  )

  if (!authed) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginBox}>
          <div className={styles.loginLogo}>Соколова Любовь <span>· Админ</span></div>
          <div className={styles.loginTitle}>Панель управления</div>
          <div className={styles.loginSub}>Введите пароль для доступа к заявкам</div>
          <form onSubmit={(e) => {e.preventDefault(); fetchLeads(secret)}} className={styles.loginForm}>
            <input type="password" placeholder="Пароль" value={secret} onChange={e => setSecret(e.target.value)} className={styles.loginInput} autoFocus />
            {error && <div className={styles.loginError}>{error}</div>}
            <button type="submit" className={styles.loginBtn} disabled={loading}>
              {loading ? 'Проверяем...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Desktop Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarLogo}>Соколова Любовь</div>
        <div className={styles.sidebarNav}>
          {['all','new','in_progress','done'].map(key => (
            <button key={key} className={`${styles.filterBtn} ${filterStatus === key ? styles.active : ''}`} onClick={() => setFilterStatus(key as FilterStatus)}>
              {key === 'all' ? 'Все заявки' : key === 'new' ? 'Новые' : key === 'in_progress' ? 'В работе' : 'Завершены'}
            </button>
          ))}
        </div>
        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={() => {setAuthed(false); setSecret('')}}>Выйти</button>
          <a href="/" className={styles.siteLink}>← На сайт</a>
        </div>
      </div>

      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <div className={styles.mobileLogo}>Соколова Любовь</div>
        <input type="text" placeholder="Поиск..." className={styles.mobileSearch} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        <button className={styles.refreshBtn} onClick={() => fetchLeads(secret)}>↻</button>
        <button className={styles.hamburger} onClick={() => setShowFilters(true)}>☰</button>
      </div>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Заявки клиентов</h1>
        </div>

        {loading ? (
          <div>Загрузка...</div>
        ) : filteredLeads.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📬</div>
            <p>Заявок нет</p>
          </div>
        ) : (
          // Здесь оставь свою таблицу
          <div>Таблица с заявками...</div>
        )}
      </main>
    </div>
  )
}
