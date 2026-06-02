import styles from './Reviews.module.css'

const reviews = [
  { initials: 'АС', name: 'Андрей С.', role: 'Собственник строительной компании', text: '«Любовь помогла нам наконец разобраться, куда уходят деньги в компании. После внедрения учёта мы видим реальную картину и принимаем решения осознанно.»' },
  { initials: 'МК', name: 'Михаил К.', role: 'Руководитель торговой сети', text: '«До работы с Любовью я вообще не понимал своих финансов. Теперь знаю цифры, умею их читать и использую для роста бизнеса.»' },
  { initials: 'ЕВ', name: 'Елена В.', role: 'Директор сервисной компании', text: '«Ценю в Любови то, что она не просто делает отчёты — она объясняет, что они значат, и помогает принимать стратегические решения.»' },
]

export default function Reviews() {
  return (
    <section className={styles.reviews} id="reviews">
      <div className={styles.inner}>
        <div className={styles.tag}>Отзывы</div>
        <h2 className={styles.title}>Что говорят клиенты</h2>
        <div className={styles.grid}>
          {reviews.map(r => (
            <div key={r.initials} className={styles.card}>
              <div className={styles.stars}>★★★★★</div>
              <blockquote>{r.text}</blockquote>
              <div className={styles.auth}>
                <div className={styles.av}>{r.initials}</div>
                <div>
                  <strong>{r.name}</strong>
                  <span>{r.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
