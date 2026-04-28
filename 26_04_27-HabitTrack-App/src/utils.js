export function fmtTime(ms) {
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sc = s % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sc).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(sc).padStart(2, '0')}`
}

export function fmtTotal(ms) {
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m} min`
  return `${s} seg`
}

export function fmtDate(ts) {
  const d = new Date(ts)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  if (sameDay)
    return 'Hoy ' + d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  return (
    d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) +
    ' ' +
    d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  )
}

export function getTotalMs(history) {
  return (history || []).reduce((acc, s) => acc + s.duration, 0)
}

export function getMaxTotal(habits, history) {
  return Math.max(1, ...habits.map(h => getTotalMs(history[h.id])))
}
