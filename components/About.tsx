import styles from './Approach.module.css'
import { DiamondIcon, HandshakeIcon, BookIcon } from './Icons'

const items = [
  {
    Icon: DiamondIcon,
    title: 'Стратегическая картина, не просто отчёты',
    text: 'Помогаю увидеть логику в каждом финансовом показателе и выстроить систему, работающую на результат вашего бизнеса.',
  },
  {
    Icon: HandshakeIcon,
    title: 'Партнёрство, а не сторонняя экспертиза',
    text: 'Я становлюсь частью вашей команды — создаю атмосферу доверия и вовлечённости в финансовые решения компании.',
  },
  {
    Icon: BookIcon,
    title: 'Сложное — простым языком',
    text: 'Объясняю так, чтобы вы сами понимали свои финансы и принимали решения уверенно, без зависимости от консультанта.',
  },
]

export default function Approach() {
  return (
    <section className={styles.approach} id="approach">
      <div className={styles.inner}>
        <div className={styles.tag}>Мой подход</div>
        <h2 className={styles.title}>
          Финансы как искусство<br />управления
        </h2>

        <div className={styles.grid}>
          <div className={styles.items}>
            {items.map(({ Icon, title, text }) => (
              <div key={title} className={styles.item}>
                <div className={styles.itemNum}>
                  <Icon size={22} />
                </div>
                <div>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.quote}>
            <span className={styles.quoteMark}>&ldquo;</span>
            <blockquote>
              Для собственников, с которыми я работаю, я выступаю не просто как
              сторонний консультант — я становлюсь партнёром, который создаёт
              гармонию в финансах бизнеса.
            </blockquote>
            <div className={styles.quoteAuthor}>
              <div className={styles.quoteAv}>СЛ</div>
              <div>
                <strong>Соколова Любовь</strong>
                <span>Финансовый директор для МСБ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
