import styles from './Services.module.css'
import {
  MagnifierIcon,
  GearIcon,
  ChartIcon,
  TargetIcon,
  BookIcon,
  HandshakeIcon,
} from './Icons'

const services = [
  {
    num: '01',
    Icon: MagnifierIcon,
    title: 'Диагностика финансовой системы',
    text: 'Анализирую текущее состояние учёта и процессов. Выявляю слабые места и точки роста вашей компании.',
  },
  {
    num: '02',
    Icon: GearIcon,
    title: 'Внедрение управленческого учёта',
    text: 'Создаю систему инструментов и отчётности, которая даёт реальную картину финансов — без сложных терминов.',
  },
  {
    num: '03',
    Icon: ChartIcon,
    title: 'Финансовое сопровождение',
    text: 'Ежемесячная аналитика и презентация финансовых результатов. Вы всегда знаете, где стоит ваш бизнес.',
  },
  {
    num: '04',
    Icon: TargetIcon,
    title: 'Консультации по управлению финансами',
    text: 'Разовые и регулярные консультации по бюджетированию, движению денег, рентабельности.',
  },
  {
    num: '05',
    Icon: BookIcon,
    title: 'Обучение финансовой грамотности',
    text: 'Обучаю собственников и руководителей управлять бизнесом на основе цифр — просто и понятно.',
  },
]

export default function Services() {
  return (
    <section className={styles.services} id="services">
      <div className={styles.inner}>
        <div className={styles.tag}>Услуги</div>
        <h2 className={styles.title}>
          Что я делаю<br />для вашего бизнеса
        </h2>
        <p className={styles.sub}>
          Каждая услуга — шаг к финансовой прозрачности и осознанному управлению компанией.
        </p>

        <div className={styles.grid}>
          {services.map(({ num, Icon, title, text }) => (
            <div key={num} className={styles.card}>
              <div className={styles.cardNum}>{num}</div>
              <div className={styles.cardIcon}>
                <Icon size={28} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}

          <div className={`${styles.card} ${styles.ctaCard}`}>
            <div className={styles.ctaBig}>
              <HandshakeIcon size={48} />
            </div>
            <p>
              Первая консультация — <strong>бесплатно</strong>
            </p>
            <small>Стоимость проекта — индивидуально</small>
            <a href="#contact" className={styles.ctaBtn}>
              Записаться
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
