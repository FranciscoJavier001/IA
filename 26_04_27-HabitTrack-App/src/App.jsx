import React, { useState, useEffect, useRef, useCallback } from 'react'
import styles from './App.module.css'
import HabitCard from './components/HabitCard'
import Sidebar from './components/Sidebar'
import { getMaxTotal } from './utils'

const STORAGE_KEY = 'habittrack_v2'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { habits: [], history: {} }
  } catch {
    return { habits: [], history: {} }
  }
}

export default function App() {
  const [state, setState] = useState(loadState)
  const [inputValue, setInputValue] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [, forceUpdate] = useState(0)
  const intervalsRef = useRef({})
  const activeIdRef = useRef(null)

  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  // Tick running timers every 500ms
  useEffect(() => {
    const tick = setInterval(() => {
      if (activeIdRef.current) forceUpdate(n => n + 1)
    }, 500)
    return () => clearInterval(tick)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => Object.values(intervalsRef.current).forEach(clearInterval)
  }, [])

  const addHabit = useCallback(() => {
    const name = inputValue.trim()
    if (!name) return
    const habit = {
      id: uid(),
      name,
      createdAt: Date.now(),
      elapsed: 0,
      startedAt: null,
    }
    setState(prev => ({
      habits: [...prev.habits, habit],
      history: { ...prev.history, [habit.id]: [] },
    }))
    setInputValue('')
  }, [inputValue])

  const stopTimer = useCallback((id, save = true) => {
    setState(prev => {
      const habit = prev.habits.find(h => h.id === id)
      if (!habit || habit.startedAt === null) return prev
      const duration = Date.now() - habit.startedAt
      const shouldSave = save && duration > 1000
      return {
        habits: prev.habits.map(h =>
          h.id === id ? { ...h, elapsed: h.elapsed + duration, startedAt: null } : h
        ),
        history: {
          ...prev.history,
          [id]: shouldSave
            ? [...(prev.history[id] || []), { startedAt: habit.startedAt, duration }]
            : prev.history[id],
        },
      }
    })
    activeIdRef.current = null
  }, [])

  const startTimer = useCallback((id) => {
    const now = Date.now()
    activeIdRef.current = id
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h =>
        h.id === id ? { ...h, startedAt: now } : h
      ),
    }))
  }, [])

  const toggleTimer = useCallback((id) => {
    setState(prev => {
      const habit = prev.habits.find(h => h.id === id)
      if (!habit) return prev

      // Stop active habit if different
      const currentActive = activeIdRef.current
      if (currentActive && currentActive !== id) {
        const activeHabit = prev.habits.find(h => h.id === currentActive)
        if (activeHabit?.startedAt !== null) {
          setTimeout(() => stopTimer(currentActive, true), 0)
        }
      }

      if (habit.startedAt !== null) {
        setTimeout(() => stopTimer(id, true), 0)
      } else {
        setTimeout(() => startTimer(id), 0)
      }
      return prev
    })
  }, [startTimer, stopTimer])

  const deleteHabit = useCallback((id) => {
    if (activeIdRef.current === id) activeIdRef.current = null
    setState(prev => {
      const { [id]: _, ...history } = prev.history
      return {
        habits: prev.habits.filter(h => h.id !== id),
        history,
      }
    })
  }, [])

  const maxTotal = getMaxTotal(state.habits, state.history)

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.logo}>
          habit<span className={styles.dot}>.</span>track
        </h1>
        <button
          className={`${styles.burgerBtn} ${sidebarOpen ? styles.open : ''}`}
          onClick={() => setSidebarOpen(o => !o)}
          aria-label="Abrir historial"
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* Input */}
      <div className={styles.inputSection}>
        <div className={styles.inputRow}>
          <input
            type="text"
            className={styles.input}
            placeholder="Nuevo hábito... (ej: Meditar)"
            maxLength={40}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addHabit()}
          />
          <button className={styles.addBtn} onClick={addHabit}>
            + Agregar
          </button>
        </div>
      </div>

      {/* Habits list */}
      <main className={styles.habitsList}>
        {state.habits.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>◎</div>
            <div>
              Agrega tu primer hábito arriba
              <br />y empieza a registrar tu tiempo
            </div>
          </div>
        ) : (
          state.habits.map(h => (
            <HabitCard
              key={h.id}
              habit={h}
              history={state.history[h.id]}
              onToggle={toggleTimer}
              onDelete={deleteHabit}
              maxTotal={maxTotal}
            />
          ))
        )}
      </main>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        habits={state.habits}
        history={state.history}
      />
    </div>
  )
}
