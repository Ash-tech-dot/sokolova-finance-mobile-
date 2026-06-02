import styles from './Footer.module.css'

const links = [
  { href: '#about', label: 'Обо мне' },
  { href: '#services', label: 'Услуги' },
  { href: '#approach', label: 'Подход' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#contact', label: 'Контакты' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          Соколова <span>Любовь</span>
        </div>
        <ul className={styles.links}>
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <div className={styles.copy}>© {year} Соколова Любовь</div>
      </div>
    </footer>
  )
}
