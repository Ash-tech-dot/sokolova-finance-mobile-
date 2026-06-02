import styles from './About.module.css'
import Image from 'next/image'
import { GraduationIcon, BriefcaseIcon, UsersIcon } from './Icons'

const credentials = [
  {
    Icon: GraduationIcon,
    title: 'НИУ ВШЭ — Финансовый менеджмент',
    sub: 'Корпоративный университет НФ',
  },
  {
    Icon: BriefcaseIcon,
    title: 'Специализация: строительство, услуги, торговля',
    sub: 'Малый и средний бизнес',
  },
  {
    Icon: UsersIcon,
    title: 'Действующие клиенты на постоянном сопровождении',
    sub: 'Долгосрочные партнёрские отношения',
  },
]

export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className={styles.inner}>
        <div className={styles.tag}>Обо мне</div>
        <h2 className={styles.title}>
          Финансовый директор,<br />который говорит просто
        </h2>

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
            <p>
              Я не просто считаю деньги — я создаю финансовую гармонию в вашем бизнесе.
              Глубоко погружаясь в процессы компании, я выстраиваю систему управления так,
              чтобы собственник чувствовал уверенность и свободу в каждом решении.
            </p>
            <p>
              Работаю с компаниями из сферы строительства, услуг и торговли.
              Мои клиенты — собственники и руководители малого и среднего бизнеса.
            </p>

            <ul className={styles.credList}>
              {credentials.map(({ Icon, title, sub }) => (
                <li key={title} className={styles.credItem}>
                  <span className={styles.credIcon}>
                    <Icon size={22} />
                  </span>
                  <div>
                    <strong>{title}</strong>
                    <span>{sub}</span>
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
