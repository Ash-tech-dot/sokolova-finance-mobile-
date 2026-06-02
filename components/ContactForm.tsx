'use client'

import { useState } from 'react'
import styles from './ContactForm.module.css'
import { CheckCircleIcon } from './Icons'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [sphere, setSphere] = useState('')
  const [msg, setMsg] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const resetForm = () => {
    setName('')
    setPhone('')
    setEmail('')
    setSphere('')
    setMsg('')
  }

  const submit = async () => {
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Пожалуйста, заполните имя и телефон')
      return
    }
    setErrorMsg('')
    setStatus('loading')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, sphere, message: msg }),
      })

      if (!res.ok) {
        // Сервер мог вернуть не-JSON (502, html-страница и т.п.) — безопасно разбираем
        let serverMessage = 'Ошибка отправки'
        try {
          const data = await res.json()
          if (data?.error) serverMessage = data.error
        } catch {
          /* ignore — оставим сообщение по умолчанию */
        }
        throw new Error(serverMessage)
      }

      setStatus('success')
      resetForm()
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Что-то пошло не так. Попробуйте ещё раз.'
      setErrorMsg(message)
      setStatus('error')
    }
  }

  return (
    <section className={styles.section} id="contact">
      <div className={styles.deco} />
      <div className={styles.deco2} />
      <div className={styles.inner}>
        <div className={styles.tag}>Записаться</div>
        <h2 className={styles.title}>Записаться на<br />бесплатную консультацию</h2>
        <p className={styles.sub}>Оставьте заявку — я свяжусь с вами в течение 24 часов</p>

        {status === 'success' ? (
          <div className={styles.success}>
            <div className={styles.check}>
              <CheckCircleIcon size={64} />
            </div>
            <h3>Заявка отправлена!</h3>
            <p>Любовь свяжется с вами в течение 24 часов</p>
          </div>
        ) : (
          <div className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="cf-name">Ваше имя *</label>
                <input
                  id="cf-name"
                  type="text"
                  placeholder="Иван Иванов"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                  disabled={status === 'loading'}
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="cf-phone">Телефон *</label>
                <input
                  id="cf-phone"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  autoComplete="tel"
                  disabled={status === 'loading'}
                  required
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="cf-email">Email</label>
                <input
                  id="cf-email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={status === 'loading'}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="cf-sphere">Сфера бизнеса</label>
                <select
                  id="cf-sphere"
                  value={sphere}
                  onChange={e => setSphere(e.target.value)}
                  disabled={status === 'loading'}
                >
                  <option value="">Выберите сферу</option>
                  <option>Строительство</option>
                  <option>Торговля</option>
                  <option>Услуги</option>
                  <option>Производство</option>
                  <option>Другое</option>
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="cf-message">Коротко о вашем запросе</label>
              <textarea
                id="cf-message"
                placeholder="Расскажите, что вас беспокоит в финансах вашего бизнеса..."
                value={msg}
                onChange={e => setMsg(e.target.value)}
                disabled={status === 'loading'}
              />
            </div>

            {errorMsg && <p className={styles.error}>{errorMsg}</p>}

            <p className={styles.note}>
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных
            </p>
            <button
              type="button"
              className={styles.submit}
              onClick={submit}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Отправляем...' : 'Отправить заявку — это бесплатно'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
