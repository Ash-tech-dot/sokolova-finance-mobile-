'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import styles from './admin.module.css'

/* ... все типы Lead, FilterStatus, STATUS_LABELS и STATUS_COLORS оставь как было ... */

export default function AdminPage() {
  // ... все состояния ...
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // ... fetchLeads, useEffect и другие функции без изменений ...

  const filteredLeads = leads
    .filter(l => filterStatus === 'all' || l.status === filterStatus)
    .filter(l => 
      !searchQuery || 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase()))
    )

  if (!authed) { /* ... логин остаётся ... */ }

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

        <button className={styles.refreshBtn} onClick={() => fetchLeads(secret)}>
          ↻
        </button>

        <button className={styles.hamburger} onClick={() => setShowFilters(true)}>
          ☰
        </button>
      </div>

      {/* Оверлей + меню фильтров */}
      <div 
        className={`${styles.filterOverlay} ${showFilters ? styles.show : ''}`} 
        onClick={() => setShowFilters(false)}
      />
      
      <div className={`${styles.mobileFilters} ${showFilters ? styles.show : ''}`}>
        <button 
          onClick={() => setShowFilters(false)}
          style={{position: 'absolute', top: '20px', right: '20px', fontSize: '28px', background: 'none', border: 'none', color: 'white'}}
        >
          ✕
        </button>

        {[
          { key: 'all', label: 'Все заявки' },
          { key: 'new', label: 'Новые' },
          { key: 'in_progress', label: 'В работе' },
          { key: 'done', label: 'Завершены' }
        ].map(item => (
          <button
            key={item.key}
            className={`${styles.filterBtn} ${filterStatus === item.key ? styles.active : ''}`}
            onClick={() => {
              setFilterStatus(item.key as FilterStatus)
              setShowFilters(false)
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Основной контент */}
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Заявки клиентов</h1>
        </div>

        {loading ? (
          <div className={styles.loader}>Загрузка...</div>
        ) : filteredLeads.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📬</div>
            <p>Заявок нет</p>
          </div>
        ) : (
          /* Здесь твоя таблица или карточки */
          <div> {/* ... твоя таблица ... */} </div>
        )}

        {/* Детальная панель */}
        {selected && ( /* ... */ )}
      </main>
    </div>
  )
}
