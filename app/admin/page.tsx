'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import styles from './admin.module.css'
import {
  TrashIcon,
  RefreshIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
  InboxIcon,
} from '@/components/Icons'

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
const FILTER_LABELS: Record<FilterStatus, string> = {
  all: 'Все заявки',
  new: 'Новые',
  in_progress: 'В работе',
  done: 'Завершены',
}

// Авто-обновление списка заявок раз в 30 секунд (без визуального таймера)
const AUTO_REFRESH_INTERVAL = 30_000

export default function AdminPage() {
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Lead | null>(null)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // ref на актуальный secret для useEffect авто-обновления
  const secretRef = useRef(secret)
  useEffect(() => {
    secretRef.current = secret
  }, [secret])

  const fetchLeads = useCallback(async (sec: string, silent = false) => {
    if (!sec) {
      setError('Введите пароль')
      return
    }
    if (!silent) setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/leads', { headers: { 'x-admin-secret': sec } })
      if (res.status === 401) {
        setError('Неверный пароль')
        setAuthed(false)
        return
      }
      if (!res.ok) {
        if (!silent) setError('Ошибка загрузки')
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

  // Авто-обновление при авторизованном состоянии
  useEffect(() => {
    if (!authed) return
    const id = setInterval(() => {
      fetchLeads(secretRef.current, true)
    }, AUTO_REFRESH_INTERVAL)
    return () => clearInterval(id)
  }, [authed, fetchLeads])

  // Блокируем прокрутку body когда открыт мобильный drawer
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = mobileFiltersOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileFiltersOpen])

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
    setSearchQuery('')
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
    } catch {
      /* ignore */
    }
  }

  const removeLead = async (id: number) => {
    if (typeof window !== 'undefined' && !window.confirm('Удалить заявку?')) return
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': secret },
      })
      if (!res.ok) return
      setLeads(prev => prev.filter(l => l.id !== id))
      setSelected(prev => (prev && prev.id === id ? null : prev))
    } catch {
      /* ignore */
    }
  }

  // Применение фильтра по статусу и поиска
  const q = searchQuery.trim().toLowerCase()
  const filtered = leads.filter(l => {
    const okStatus = filterStatus === 'all' || l.status === filterStatus
    const okSearch =
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.phone.toLowerCase().includes(q) ||
      (l.email ?? '').toLowerCase().includes(q) ||
      (l.sphere ?? '').toLowerCase().includes(q)
    return okStatus && okSearch
  })

  const counts = {
    all: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    in_progress: leads.filter(l => l.status === 'in_progress').length,
    done: leads.filter(l => l.status === 'done').length,
  }

  const formatDate = (str: string) => {
    const d = new Date(str)
    if (Number.isNaN(d.getTime())) return str
    return d.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // ===== Login screen =====
  if (!authed) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginBox}>
          <div className={styles.loginLogo}>
            Соколова <span>Любовь</span>
          </div>
          <h1 className={styles.loginTitle}>Панель управления</h1>
          <p className={styles.loginSub}>Введите пароль для доступа к заявкам</p>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <input
              type="password"
              placeholder="Пароль"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              className={styles.loginInput}
              autoFocus
              autoComplete="current-password"
            />
            {error && <p className={styles.loginError}>{error}</p>}
            <button type="submit" className={styles.loginBtn} disabled={loading}>
              {loading ? 'Проверяем...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const filterKeys: ReadonlyArray<FilterStatus> = ['all', 'new', 'in_progress', 'done']

  // ===== Main admin screen =====
  return (
    <div className={styles.page}>
      {/* ===== Боковая колонка (десктоп) ===== */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          Соколова <span>Любовь</span>
        </div>
        <nav className={styles.sidebarNav}>
          {filterKeys.map(key => (
            <button
              key={key}
              type="button"
              className={`${styles.filterBtn} ${filterStatus === key ? styles.active : ''}`}
              onClick={() => setFilterStatus(key)}
            >
              <span>{FILTER_LABELS[key]}</span>
              <span className={styles.badge}>{counts[key]}</span>
            </button>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            Выйти
          </button>
          <a href="/" className={styles.siteLink}>
            ← На сайт
          </a>
        </div>
      </aside>

      {/* ===== Мобильная шапка ===== */}
      <header className={styles.mobileHeader}>
        <div className={styles.mobileLogo}>
          Соколова <span>Любовь</span>
        </div>
        <div className={styles.mobileSearchWrap}>
          <SearchIcon size={16} />
          <input
            type="text"
            placeholder="Поиск..."
            className={styles.mobileSearch}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => fetchLeads(secret)}
          aria-label="Обновить"
        >
          <RefreshIcon size={18} />
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => setMobileFiltersOpen(true)}
          aria-label="Открыть фильтры"
        >
          <MenuIcon size={20} />
        </button>
      </header>

      {/* ===== Мобильный drawer с фильтрами ===== */}
      {mobileFiltersOpen && (
        <div
          className={styles.drawerBackdrop}
          onClick={() => setMobileFiltersOpen(false)}
          role="presentation"
        >
          <aside
            className={styles.drawer}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-label="Фильтры"
          >
            <div className={styles.drawerHeader}>
              <span>Фильтры</span>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Закрыть"
              >
                <CloseIcon size={20} />
              </button>
            </div>
            <nav className={styles.drawerNav}>
              {filterKeys.map(key => (
                <button
                  key={key}
                  type="button"
                  className={`${styles.filterBtn} ${filterStatus === key ? styles.active : ''}`}
                  onClick={() => {
                    setFilterStatus(key)
                    setMobileFiltersOpen(false)
                  }}
                >
                  <span>{FILTER_LABELS[key]}</span>
                  <span className={styles.badge}>{counts[key]}</span>
                </button>
              ))}
            </nav>
            <div className={styles.drawerFooter}>
              <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
                Выйти
              </button>
              <a href="/" className={styles.siteLink}>
                ← На сайт
              </a>
            </div>
          </aside>
        </div>
      )}

      {/* ===== Основная область ===== */}
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Заявки клиентов</h1>
            <p className={styles.pageSub}>{filtered.length} заявок</p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.searchWrap}>
              <SearchIcon size={16} />
              <input
                type="text"
                placeholder="Поиск по имени, телефону, email..."
                className={styles.search}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="button"
              className={styles.refreshBtn}
              onClick={() => fetchLeads(secret)}
              aria-label="Обновить"
            >
              <RefreshIcon size={16} />
              <span>Обновить</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loader}>Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <InboxIcon size={64} />
            </div>
            <p>Заявок нет</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>№</th>
                  <th>Имя</th>
                  <th>Телефон</th>
                  <th>Email</th>
                  <th>Сфера</th>
                  <th>Статус</th>
                  <th>Дата</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => (
                  <tr
                    key={lead.id}
                    className={`${styles.row} ${
                      selected?.id === lead.id ? styles.rowSelected : ''
                    }`}
                    onClick={() =>
                      setSelected(selected?.id === lead.id ? null : lead)
                    }
                  >
                    <td className={styles.tdId}>#{lead.id}</td>
                    <td className={styles.tdName} data-label="Имя">
                      {lead.name}
                    </td>
                    <td data-label="Телефон">
                      <a
                        href={`tel:${lead.phone}`}
                        onClick={e => e.stopPropagation()}
                        className={styles.phone}
                      >
                        {lead.phone}
                      </a>
                    </td>
                    <td className={styles.tdEmail} data-label="Email">
                      {lead.email || '—'}
                    </td>
                    <td data-label="Сфера">{lead.sphere || '—'}</td>
                    <td data-label="Статус">
                      <span
                        className={styles.status}
                        style={{
                          background: STATUS_COLORS[lead.status] + '22',
                          color: STATUS_COLORS[lead.status],
                          border: `1px solid ${STATUS_COLORS[lead.status]}55`,
                        }}
                      >
                        {STATUS_LABELS[lead.status]}
                      </span>
                    </td>
                    <td className={styles.tdDate} data-label="Дата">
                      {formatDate(lead.created_at)}
                    </td>
                    <td data-label="Действия" onClick={e => e.stopPropagation()}>
                      <div className={styles.actions}>
                        <select
                          value={lead.status}
                          onChange={e =>
                            updateStatus(lead.id, e.target.value as LeadStatus)
                          }
                          className={styles.statusSelect}
                          aria-label="Изменить статус"
                        >
                          <option value="new">Новая</option>
                          <option value="in_progress">В работе</option>
                          <option value="done">Завершена</option>
                        </select>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => removeLead(lead.id)}
                          title="Удалить"
                          aria-label="Удалить заявку"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Детальная карточка выбранной заявки */}
        {selected && (
          <div className={styles.detail}>
            <div className={styles.detailHeader}>
              <h3>Заявка #{selected.id}</h3>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className={styles.closeBtn}
                aria-label="Закрыть"
              >
                <CloseIcon size={20} />
              </button>
            </div>
            <div className={styles.detailGrid}>
              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Имя</span>
                <span>{selected.name}</span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Телефон</span>
                <a href={`tel:${selected.phone}`} className={styles.phone}>
                  {selected.phone}
                </a>
              </div>
              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Email</span>
                <span>{selected.email || '—'}</span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Сфера</span>
                <span>{selected.sphere || '—'}</span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Дата</span>
                <span>{formatDate(selected.created_at)}</span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Статус</span>
                <select
                  value={selected.status}
                  onChange={e =>
                    updateStatus(selected.id, e.target.value as LeadStatus)
                  }
                  className={styles.statusSelect}
                  aria-label="Изменить статус"
                >
                  <option value="new">Новая</option>
                  <option value="in_progress">В работе</option>
                  <option value="done">Завершена</option>
                </select>
              </div>
            </div>
            {selected.message && (
              <div className={styles.detailMsg}>
                <span className={styles.detailLabel}>Сообщение</span>
                <p>{selected.message}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
