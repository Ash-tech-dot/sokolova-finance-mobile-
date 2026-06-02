import styles from './About.module.css'
import Image from 'next/image'

const credentials = [
  { icon: '🎓', title: 'НИУ ВШЭ — Финансовый менеджмент', sub: 'Корпоративный университет НФ' },
  { icon: '💼', title: 'Специализация: строительство, услуги, торговля', sub: 'Малый и средний бизнес' },
  { icon: '✅', title: 'Действующие клиенты на постоянном сопровождении', sub: 'Долгосрочные партнёрские отношения' },
]

export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className={styles.inner}>
        <div className={styles.tag}>Обо мне</div>
        <h2 className={styles.title}>Финансовый директор,<br />который говорит просто</h2>

        <div className={styles.grid}>
          <div className={styles.photoWrap}>
            <div className={styles.photo}>
              <Image
                src="/lovely.jpg"
                alt="Соколова Любовь"
                fill
                sizes="(max-width: 768px) 100vw, 440px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={styles.photoDeco} />
          </div>

          <div className={styles.text}>
            <p>Я не просто считаю деньги — я создаю финансовую гармонию в вашем бизнесе.
              Глубоко погружаясь в процессы компании, я выстраиваю систему управления так,
              чтобы собственник чувствовал уверенность и свободу в каждом решении.</p>
            <p>Работаю с компаниями из сферы строительства, услуг и торговли.
              Мои клиенты — собственники и руководители малого и среднего бизнеса.</p>

            <ul className={styles.credList}>
              {credentials.map(c => (
                <li key={c.title} className={styles.credItem}>
                  <span className={styles.credIcon}>{c.icon}</span>
                  <div>
                    <strong>{c.title}</strong>
                    <span>{c.sub}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
