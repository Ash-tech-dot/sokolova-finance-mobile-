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

const AUTO_REFRESH_INTERVAL = 30_000 // 30 секунд

export default function AdminPage() {
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Lead | null>(null)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')


  const secretRef = useRef(secret)
  useEffect(() => { secretRef.current = secret }, [secret])

  const fetchLeads = useCallback(async (sec: string, silent = false) => {
    if (!sec) {
      setError('Введите пароль')
      return
    }
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
      if (!res.ok) {
        setError('Ошибка загрузки')
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

  // Автообновление каждые 30 секунд
  useEffect(() => {
    if (!authed) return

    const interval = setInterval(() => {
      fetchLeads(secretRef.current, true)
    }, AUTO_REFRESH_INTERVAL)


    return () => {
      clearInterval(interval)
    }
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
      if (!res.ok) {
        console.error('updateStatus failed', res.status)
        return
      }
      setLeads(prev => prev.map(l => (l.id === id ? { ...l, status } : l)))
      setSelected(prev => (prev && prev.id === id ? { ...prev, status } : prev))
    } catch (err) {
      console.error('updateStatus error', err)
    }
  }

  const removeLead = async (id: number) => {
    if (typeof window !== 'undefined' && !window.confirm('Удалить заявку?')) return
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': secret },
      })
      if (!res.ok) {
        console.error('delete failed', res.status)
        return
      }
      setLeads(prev => prev.filter(l => l.id !== id))
      setSelected(prev => (prev && prev.id === id ? null : prev))
    } catch (err) {
      console.error('delete error', err)
    }
  }

  const filtered =
    filterStatus === 'all' ? leads : leads.filter(l => l.status === filterStatus)

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

  const filterItems: ReadonlyArray<{ key: FilterStatus; label: string; count: number }> = [
    { key: 'all', label: 'Все заявки', count: counts.all },
    { key: 'new', label: 'Новые', count: counts.new },
    { key: 'in_progress', label: 'В работе', count: counts.in_progress },
    { key: 'done', label: 'Завершены', count: counts.done },
  ]

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          Соколова <span>Любовь</span>
        </div>
        <nav className={styles.sidebarNav}>
          <span className={styles.sidebarSection}>Фильтр</span>
          {filterItems.map(item => (
            <button
              key={item.key}
              type="button"
              className={`${styles.filterBtn} ${
                filterStatus === item.key ? styles.active : ''
              }`}
              onClick={() => setFilterStatus(item.key)}
            >
              <span>{item.label}</span>
              <span className={styles.badge}>{item.count}</span>
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

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Заявки клиентов</h1>
            <p className={styles.pageSub}>{filtered.length} заявок</p>
          </div>
          <button
            type="button"
            className={styles.refreshBtn}
            onClick={() => fetchLeads(secret)}
          >
            ↻ Обновить
          </button>
        </div>

        {loading ? (
          <div className={styles.loader}>Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📭</div>
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
                    <td className={styles.tdName} data-label="Имя">{lead.name}</td>
                    <td data-label="Телефон">
                      <a
                        href={`tel:${lead.phone}`}
                        onClick={e => e.stopPropagation()}
                        className={styles.phone}
                      >
                        {lead.phone}
                      </a>
                    </td>
                    <td className={styles.tdEmail} data-label="Email">{lead.email || '—'}</td>
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
                    <td className={styles.tdDate} data-label="Дата">{formatDate(lead.created_at)}</td>
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
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detail panel */}
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
                ✕
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
