'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Stats.module.css'

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          let cur = 0
          const step = Math.max(1, Math.ceil(to / 40))
          const t = setInterval(() => {
            cur = Math.min(cur + step, to)
            setVal(cur)
            if (cur >= to) clearInterval(t)
          }, 45)
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [to])

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <div className={styles.stat}>
          <div className={styles.num}>
            <Counter to={15} suffix="+" />
          </div>
          <div className={styles.unit}>лет</div>
          <div className={styles.lbl}>опыта в финансовом управлении</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.num}>
            <Counter to={10} suffix="+" />
          </div>
          <div className={styles.unit}>компаний</div>
          <div className={styles.lbl}>с внедрённым управленческим учётом</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.num}>100%</div>
          <div className={styles.unit}>онлайн</div>
          <div className={styles.lbl}>работаю по всей России</div>
        </div>
      </div>
    </div>
  )
}
