import styles from './Hero.module.css'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.gridLines} />
      <div className={styles.glow} />

      <div className={styles.inner}>
        {/* Левая колонка */}
        <div className={styles.left}>
          <div className={styles.tag}>
            <span className={styles.dot} />Финансовый директор для МСБ
          </div>

          <h1 className={styles.h1}>
            Финансовая<br />
            <span className={styles.accent}>ясность</span><br />
            для вашего бизнеса
          </h1>

          <p className={styles.sub}>
            Помогаю собственникам МСБ выстроить систему управления деньгами —
            без хаоса, с уверенностью в каждом решении.
          </p>

          <div className={styles.btns}>
            <a href="#contact" className={styles.btnPrimary}>
              Записаться на консультацию
            </a>
            <a href="#services" className={styles.btnOutline}>
              Узнать об услугах
            </a>
          </div>
        </div>

        {/* Правая колонка с фото */}
        <div className={styles.photoCol}>
          <div className={styles.photo}>
            <Image
              src="/lovely.jpg"
              alt="Соколова Любовь"
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          <div className={styles.badge}>
            <div className={styles.badgeNum}>15+</div>
            <div className={styles.badgeLbl}>лет в финансах</div>
          </div>
        </div>
      </div>
    </section>
  )
}
