import React from 'react'
import styles from './HabitCard.module.css'
import { fmtTime, fmtTotal, getTotalMs } from '../utils'

function PlayIcon() {
  return (
    <svg viewBox="0 0 12 12" width="14" height="14">
      <polygon points="2,1 11,6 2,11" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 12 12" width="14" height="14">
      <rect x="1" y="1" width="3.5" height="10" rx="1" />
      <rect x="7.5" y="1" width="3.5" height="10" rx="1" />
    </svg>
  )
}

export default function HabitCard({ habit, history, onToggle, onDelete, maxTotal }) {
  const isActive = habit.startedAt !== null
  const sessions = (history || []).length
  const liveElapsed = isActive
    ? habit.elapsed + (Date.now() - habit.startedAt)
    : habit.elapsed
  const totalMs = getTotalMs(history)
  const barPct = maxTotal > 0 ? Math.max(2, Math.round((totalMs / maxTotal) * 100)) : 2

  return (
    <div className={`${styles.card} ${isActive ? styles.active : ''}`} data-id={habit.id}>
      <div className={styles.top}>
        {isActive && <div className={styles.pulseDot} />}
        <div className={styles.info}>
          <div className={styles.name}>{habit.name}</div>
          <div className={styles.meta}>
            {isActive ? 'En progreso...' : `${sessions} sesión${sessions !== 1 ? 'es' : ''}`}
          </div>
        </div>
        <div className={styles.timerDisplay}>{fmtTime(liveElapsed)}</div>
        <button className={styles.timerBtn} onClick={() => onToggle(habit.id)}>
          {isActive ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(habit.id)}
          title="Eliminar"
        >
          ✕
        </button>
      </div>
      <div className={styles.footer}>
        <span className={styles.totalLabel}>Total acumulado</span>
        <div className={styles.barTrack}>
          <div className={styles.barFill} style={{ width: `${barPct}%` }} />
        </div>
        <span className={styles.totalValue}>{totalMs > 0 ? fmtTotal(totalMs) : '—'}</span>
      </div>
    </div>
  )
}
