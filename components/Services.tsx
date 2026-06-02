import styles from './Services.module.css'

const services = [
  { num: '01', icon: '🔍', title: 'Диагностика финансовой системы', text: 'Анализирую текущее состояние учёта и процессов. Выявляю слабые места и точки роста вашей компании.' },
  { num: '02', icon: '⚙️', title: 'Внедрение управленческого учёта', text: 'Создаю систему инструментов и отчётности, которая даёт реальную картину финансов — без сложных терминов.' },
  { num: '03', icon: '📊', title: 'Финансовое сопровождение', text: 'Ежемесячная аналитика и презентация финансовых результатов. Вы всегда знаете, где стоит ваш бизнес.' },
  { num: '04', icon: '🎯', title: 'Консультации по управлению финансами', text: 'Разовые и регулярные консультации по бюджетированию, движению денег, рентабельности.' },
  { num: '05', icon: '📚', title: 'Обучение финансовой грамотности', text: 'Обучаю собственников и руководителей управлять бизнесом на основе цифр — просто и понятно.' },
]

export default function Services() {
  return (
    <section className={styles.services} id="services">
      <div className={styles.inner}>
        <div className={styles.tag}>Услуги</div>
        <h2 className={styles.title}>Что я делаю<br />для вашего бизнеса</h2>
        <p className={styles.sub}>Каждая услуга — шаг к финансовой прозрачности и осознанному управлению компанией.</p>

        <div className={styles.grid}>
          {services.map(s => (
            <div key={s.num} className={styles.card}>
              <div className={styles.cardNum}>{s.num}</div>
              <div className={styles.cardIcon}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}

          <div className={`${styles.card} ${styles.ctaCard}`}>
            <div className={styles.ctaBig}>🤝</div>
            <p>Первая консультация — <strong>бесплатно</strong></p>
            <small>Стоимость проекта — индивидуально</small>
            <a href="#contact" className={styles.ctaBtn}>Записаться</a>
          </div>
        </div>
      </div>
    </section>
  )
}
