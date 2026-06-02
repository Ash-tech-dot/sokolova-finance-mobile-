import styles from './Process.module.css'

const steps = [
  { n: '1', title: 'Бесплатная консультация', text: 'Знакомимся, обсуждаем ситуацию и определяем задачи' },
  { n: '2', title: 'Диагностика', text: 'Анализирую текущую систему учёта, выявляю точки роста' },
  { n: '3', title: 'Внедрение', text: 'Создаём и запускаем систему управленческого учёта' },
  { n: '4', title: 'Сопровождение', text: 'Ежемесячная аналитика и поддержка на всём пути роста' },
]

export default function Process() {
  return (
    <section className={styles.process}>
      <div className={styles.inner}>
        <div className={styles.tag}>Как мы работаем</div>
        <h2 className={styles.title}>4 шага к финансовой<br />прозрачности</h2>
        <div className={styles.grid}>
          {steps.map(s => (
            <div key={s.n} className={styles.step}>
              <div className={styles.stepNum}>{s.n}</div>
              <h4>{s.title}</h4>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
