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
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Завершена',
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: '#6b9fc9',
  in_progress: '#f0a500',
  done: '#4caf72',
}

const AUTO_REFRESH_INTERVAL = 30000 // 30 секунд

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
      const res = await fetch('/api/leads', {
        headers: { 'x-admin-secret': sec },
      })

      if (res.status === 401) {
        setError('Неверный пароль')
        setAuthed(false)
        return
      }
      if (!res.ok) throw new Error()

      const data = await res.json()
      setLeads(Array.isArray(data.leads) ? data.leads : [])
      setAuthed(true)
    } catch {
      if (!silent) setError('Ошибка загрузки')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  // Автообновление
  useEffect(() => {
    if (!authed) return
    const interval = setInterval(() => {
      fetchLeads(secretRef.current, true)
    }, AUTO_REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [authed, fetchLeads])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    fetchLeads(secret)
  }

  const handleLogout = () => {
    setAuthed(false)
    setSecret('')
    setLeads([])
    setSelected(null)
    setFilterStatus('all')
    setShowFilters(false)
  }

  const updateStatus = async (id: number, status: LeadStatus) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) return
      setLeads(prev => prev.map(l => (l.id === id ? { ...l, status } : l)))
      setSelected(prev => (prev && prev.id === id ? { ...prev, status } : prev))
    } catch (err) {
      console.error(err)
    }
  }

  const removeLead = async (id: number) => {
    if (!window.confirm('Удалить заявку?')) return
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': secret },
      })
      if (!res.ok) return
      setLeads(prev => prev.filter(l => l.id !== id))
      setSelected(prev => (prev && prev.id === id ? null : prev))
    } catch (err) {
      console.error(err)
    }
  }

  const filteredLeads = leads
    .filter(l => filterStatus === 'all' || l.status === filterStatus)
    .filter(l => 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase()))
    )

  const counts = {
    all: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    in_progress: leads.filter(l => l.status === 'in_progress').length,
    done: leads.filter(l => l.status === 'done').length,
  }

  const formatDate = (str: string) => {
    const d = new Date(str)
    return Number.isNaN(d.getTime()) ? str : d.toLocaleString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  if (!authed) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginBox}>
          <div className={styles.loginLogo}>Соколова Любовь <span>· Админ</span></div>
          <div className={styles.loginTitle}>Панель управления</div>
          <div className={styles.loginSub}>Введите пароль для доступа к заявкам</div>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <input
              type="password"
              placeholder="Пароль"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              className={styles.loginInput}
              autoFocus
            />
            {error && <div className={styles.loginError}>{error}</div>}
            <button type="submit" className={styles.loginBtn} disabled={loading}>
              {loading ? 'Проверяем...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const filterItems = [
    { key: 'all', label: 'Все заявки' },
    { key: 'new', label: 'Новые' },
    { key: 'in_progress', label: 'В работе' },
    { key: 'done', label: 'Завершены' },
  ] as const

  return (
    <div className={styles.page}>
      {/* Мобильная шапка */}
      <div className={styles.mobileHeader}>
        <div className={styles.mobileLogo}>Соколова Любовь</div>
        
        <input
          type="text"
          placeholder="Поиск..."
          className={styles.mobileSearch}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button 
          className={styles.hamburger} 
          onClick={() => setShowFilters(!showFilters)}
        >
          ☰
        </button>
      </div>

      {/* Синяя плашка */}
      <div className={styles.statusBar}>
        Заявки клиентов — {filteredLeads.length} шт.
      </div>

      {/* Мобильные фильтры */}
      {showFilters && (
        <div className={styles.mobileFilters}>
          {filterItems.map(item => (
            <button
              key={item.key}
              className={`${styles.filterBtn} ${filterStatus === item.key ? styles.active : ''}`}
              onClick={() => {
                setFilterStatus(item.key)
                setShowFilters(false)
              }}
            >
              {item.label} ({counts[item.key as keyof typeof counts]})
            </button>
          ))}
        </div>
      )}

      {/* Основной контент */}
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Заявки клиентов</h1>
          </div>
          <button
            type="button"
            className={styles.refreshBtn}
            onClick={() => fetchLeads(secret)}
          >
            ↻ Обновить
          </button>
        </div>

        {loading && <div className={styles.loader}>Загрузка...</div>}

        {!loading && filteredLeads.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📭</div>
            Заявок нет
          </div>
        )}

        {filteredLeads.length > 0 && (
          /* Здесь оставь свою таблицу или карточки — я не менял этот блок */
          <div className={styles.tableWrap}>
            {/* ... твоя таблица ... */}
            {/* (если нужно — могу обновить и её) */}
          </div>
        )}

        {/* Детальная панель */}
        {selected && (
          <div className={styles.detail}>
            {/* ... твоя детальная панель ... */}
          </div>
        )}
      </main>
    </div>
  )
}
