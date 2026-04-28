import React, { useState } from 'react'
import styles from './Sidebar.module.css'
import { fmtTime, fmtTotal, fmtDate, getTotalMs } from '../utils'

export default function Sidebar({ isOpen, onClose, habits, history }) {
  const [visibleCounts, setVisibleCounts] = useState({})

  function seeMore(id, total) {
    setVisibleCounts(prev => {
      const current = prev[id] || { count: 5, clicks: 0 }
      return {
        ...prev,
        [id]: { count: current.count + 5, clicks: current.clicks + 1 },
      }
    })
  }

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.show : ''}`}
        onClick={onClose}
      />
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Historial</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.content}>
          {habits.length === 0 ? (
            <p className={styles.noHistory}>No hay hábitos todavía.</p>
          ) : (
            habits.map(h => {
              const sessions = (history[h.id] || []).slice().reverse()
              const vc = visibleCounts[h.id] || { count: 5, clicks: 0 }
              const showAll = vc.clicks >= 4
              const shown = showAll ? sessions : sessions.slice(0, vc.count)
              const hasMore = !showAll && sessions.length > vc.count
              const remaining = sessions.length - vc.count
              const totalMs = getTotalMs(history[h.id])

              return (
                <div key={h.id} className={styles.habitSection}>
                  <div className={styles.sectionTitle}>
                    <span className={styles.sectionName}>{h.name}</span>
                    <span className={styles.sessionCount}>{sessions.length} ses.</span>
                  </div>

                  <div className={styles.totalSummary}>
                    <div>
                      <div className={styles.tsLabel}>Tiempo total dedicado</div>
                      <div className={styles.tsSessions}>
                        {sessions.length} sesión{sessions.length !== 1 ? 'es' : ''} registrada{sessions.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className={styles.tsValue}>
                      {totalMs > 0 ? fmtTotal(totalMs) : '—'}
                    </div>
                  </div>

                  {shown.length === 0 ? (
                    <div className={styles.noHistory}>Sin sesiones aún</div>
                  ) : (
                    shown.map((s, i) => (
                      <div key={i} className={styles.sessionItem}>
                        <div className={styles.sessionDot} />
                        <div className={styles.sessionDate}>{fmtDate(s.startedAt)}</div>
                        <div className={styles.sessionDuration}>{fmtTime(s.duration)}</div>
                      </div>
                    ))
                  )}

                  {hasMore && (
                    <button
                      className={styles.seeMoreBtn}
                      onClick={() => seeMore(h.id, sessions.length)}
                    >
                      Ver {Math.min(5, remaining)} más →
                    </button>
                  )}
                </div>
              )
            })
          )}
        </div>
      </aside>
    </>
  )
}
