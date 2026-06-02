'use client'

import { useState, useEffect } from 'react'
import styles from './Navbar.module.css'

const links = [
  { href: '#about',    label: 'Обо мне' },
  { href: '#services', label: 'Услуги' },
  { href: '#approach', label: 'Подход' },
  { href: '#reviews',  label: 'Отзывы' },
  { href: '#contact',  label: 'Контакты' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    document.body.style.overflow = ''
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} id="navbar">
        <a href="#" className={styles.logo}>
          Соколова <span>Любовь</span>
        </a>

        <ul className={styles.links}>
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} onClick={e => { e.preventDefault(); scrollTo(l.href) }}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className={styles.cta}
          onClick={() => scrollTo('#contact')}
        >
          Записаться
        </button>

        <button
          className={`${styles.burger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Меню"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ''}`}>
        {links.map(l => (
          <a key={l.href} href={l.href} onClick={e => { e.preventDefault(); scrollTo(l.href) }}>
            {l.label}
          </a>
        ))}
        <button className={styles.mobileCta} onClick={() => scrollTo('#contact')}>
          Записаться бесплатно
        </button>
      </div>
    </>
  )
}
