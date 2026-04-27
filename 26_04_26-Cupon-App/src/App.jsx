import { useState, useEffect } from 'react'
import styles from './App.module.css'

const STORAGE_COUPONS = 'cupones_v1'
const STORAGE_HISTORY = 'historial_v1'

function loadFromStorage(key, fallback) {
  try {
    const val = localStorage.getItem(key)
    return val ? JSON.parse(val) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch {}
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatDateTime(iso) {
  const d = new Date(iso)
  return (
    d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  )
}

export default function App() {
  const [tab, setTab] = useState('enviar')
  const [coupons, setCoupons] = useState(() => loadFromStorage(STORAGE_COUPONS, []))
  const [history, setHistory] = useState(() => loadFromStorage(STORAGE_HISTORY, []))
  const [phone, setPhone] = useState('')
  const [couponInput, setCouponInput] = useState('')
  const [preview, setPreview] = useState(null)
  const [alert, setAlert] = useState(null)

  useEffect(() => { saveToStorage(STORAGE_COUPONS, coupons) }, [coupons])
  useEffect(() => { saveToStorage(STORAGE_HISTORY, history) }, [history])

  useEffect(() => {
    if (!alert) return
    const t = setTimeout(() => setAlert(null), 3500)
    return () => clearTimeout(t)
  }, [alert])

  function showAlert(msg, type = 'success') {
    setAlert({ msg, type })
  }

  function handlePhoneInput(e) {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10)
    setPhone(val)
  }

  function generarCupon() {
    if (phone.length !== 10) return showAlert('Ingresa un número de WhatsApp de 10 dígitos.', 'error')
    if (!coupons.length) return showAlert('No hay cupones disponibles. Agrega cupones primero.', 'error')
    const coupon = coupons[0]
    const msg = `Tu cupón es: ${coupon.code} y fue agregado a la red el día ${formatDate(coupon.addedAt)}`
    setPreview({ coupon, phone, msg })
  }

  function cancelarPreview() {
    setPreview(null)
    setPhone('')
  }

  function confirmarEnvio() {
    if (!preview) return
    const { coupon, phone: pPhone, msg } = preview
    const newHistory = [
      { phone: pPhone, code: coupon.code, addedAt: coupon.addedAt, sentAt: new Date().toISOString() },
      ...history,
    ]
    const newCoupons = coupons.filter(c => c.code !== coupon.code)
    setCoupons(newCoupons)
    setHistory(newHistory)
    setPreview(null)
    setPhone('')
    showAlert(`Cupón ${coupon.code} enviado y eliminado de la lista.`, 'success')
    const url = `https://wa.me/52${pPhone}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
  }

  function agregarCupon() {
    const val = couponInput.trim().toUpperCase()
    if (val.length !== 10) return showAlert('El código debe tener exactamente 10 caracteres.', 'error')
    if (coupons.find(c => c.code === val)) return showAlert('Ese cupón ya existe en la lista.', 'error')
    setCoupons(prev => [...prev, { code: val, addedAt: new Date().toISOString() }])
    setCouponInput('')
    showAlert('Cupón agregado correctamente.', 'success')
  }

  function eliminarCupon(code) {
    setCoupons(prev => prev.filter(c => c.code !== code))
  }

  function limpiarHistorial() {
    if (!history.length) return
    if (window.confirm('¿Seguro que quieres borrar todo el historial?')) {
      setHistory([])
    }
  }

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🎟</span>
            <div>
              <h1 className={styles.title}>Gestor de cupones</h1>
              <p className={styles.subtitle}>Distribuye códigos por WhatsApp</p>
            </div>
          </div>
          <div className={styles.statsPill}>
            <span className={styles.statNum}>{coupons.length}</span>
            <span className={styles.statLabel}>disponibles</span>
          </div>
        </header>

        {alert && (
          <div className={`${styles.alert} ${styles[`alert_${alert.type}`]}`}>
            {alert.type === 'success' ? '✓ ' : '✕ '}{alert.msg}
          </div>
        )}

        <nav className={styles.tabs}>
          {['enviar', 'cupones', 'historial'].map(t => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
              onClick={() => { setTab(t); setAlert(null) }}
            >
              {t === 'enviar' ? 'Enviar cupón' : t === 'cupones' ? 'Mis cupones' : 'Historial'}
              {t === 'historial' && history.length > 0 && (
                <span className={styles.badge}>{history.length}</span>
              )}
              {t === 'cupones' && coupons.length > 0 && (
                <span className={styles.badge}>{coupons.length}</span>
              )}
            </button>
          ))}
        </nav>

        {/* TAB: ENVIAR */}
        {tab === 'enviar' && (
          <div className={styles.section}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statCardLabel}>Cupones disponibles</div>
                <div className={styles.statCardVal}>{coupons.length}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statCardLabel}>Cupones enviados</div>
                <div className={styles.statCardVal}>{history.length}</div>
              </div>
            </div>

            <div className={styles.card}>
              <label className={styles.fieldLabel}>Número de WhatsApp (10 dígitos)</label>
              <div className={styles.phoneRow}>
                <span className={styles.prefix}>+52</span>
                <input
                  type="tel"
                  placeholder="4491231213"
                  value={phone}
                  onChange={handlePhoneInput}
                  maxLength={10}
                  disabled={!!preview}
                />
                {!preview && (
                  <button className="primary" onClick={generarCupon}>
                    Generar cupón
                  </button>
                )}
              </div>

              {preview && (
                <div className={styles.previewArea}>
                  <div className={styles.previewLabel}>Vista previa del mensaje</div>
                  <div className={styles.previewBox}>
                    <span className={styles.waIcon}>💬</span>
                    <p className={styles.previewMsg}>{preview.msg}</p>
                  </div>
                  <div className={styles.previewActions}>
                    <button className="success" onClick={confirmarEnvio}>
                      Confirmar envío por WhatsApp
                    </button>
                    <button onClick={cancelarPreview}>Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: CUPONES */}
        {tab === 'cupones' && (
          <div className={styles.section}>
            <div className={styles.card}>
              <label className={styles.fieldLabel}>Agregar nuevo cupón (10 caracteres)</label>
              <div className={styles.addRow}>
                <input
                  type="text"
                  placeholder="XXXXXXXXXX"
                  value={couponInput}
                  maxLength={10}
                  onChange={e => setCouponInput(e.target.value.replace(/\s/g, '').toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && agregarCupon()}
                />
                <button className="primary" onClick={agregarCupon}>Agregar</button>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.listHeader}>
                <span className={styles.listTitle}>
                  Cupones disponibles
                  <span className={styles.countBadge}>{coupons.length}</span>
                </span>
              </div>
              {coupons.length === 0 ? (
                <div className={styles.empty}>
                  <span>📭</span>
                  <p>No hay cupones cargados</p>
                </div>
              ) : (
                <div className={styles.couponList}>
                  {coupons.map((c, i) => (
                    <div key={c.code} className={styles.couponItem}>
                      <div className={styles.couponLeft}>
                        <span className={styles.couponIndex}>#{i + 1}</span>
                        <div>
                          <div className={styles.couponCode}>{c.code}</div>
                          <div className={styles.couponDate}>Agregado: {formatDate(c.addedAt)}</div>
                        </div>
                      </div>
                      <button className="danger sm" onClick={() => eliminarCupon(c.code)}>
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: HISTORIAL */}
        {tab === 'historial' && (
          <div className={styles.section}>
            <div className={styles.card}>
              <div className={styles.listHeader}>
                <span className={styles.listTitle}>Cupones enviados</span>
                {history.length > 0 && (
                  <button className="danger sm" onClick={limpiarHistorial}>
                    Limpiar historial
                  </button>
                )}
              </div>
              {history.length === 0 ? (
                <div className={styles.empty}>
                  <span>📋</span>
                  <p>Sin historial aún</p>
                </div>
              ) : (
                <div className={styles.historyList}>
                  {history.map((h, i) => (
                    <div key={i} className={styles.historyItem}>
                      <div className={styles.historyLeft}>
                        <div className={styles.historyPhone}>+52 {h.phone}</div>
                        <div className={styles.historyCode}>{h.code}</div>
                        <div className={styles.historyMeta}>
                          Agregado: {formatDate(h.addedAt)}
                        </div>
                      </div>
                      <div className={styles.historyRight}>
                        <div className={styles.historyTime}>{formatDateTime(h.sentAt)}</div>
                        <span className={styles.sentBadge}>Enviado</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
