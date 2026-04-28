import { useState, useEffect, useRef, useCallback } from 'react'

const STORAGE_KEY = 'habittrack_v2'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { habits: [], history: {} }
  } catch {
    return { habits: [], history: {} }
  }
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function useHabits() {
  const [state, setState] = useState(loadState)
  const intervalsRef = useRef({})
  const activeIdRef = useRef(null)

  // persist to localStorage on every state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  // cleanup intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval)
    }
  }, [])

  const addHabit = useCallback((name) => {
    if (!name.trim()) return
    const habit = {
      id: uid(),
      name: name.trim(),
      createdAt: Date.now(),
      elapsed: 0,
      startedAt: null,
    }
    setState(prev => ({
      habits: [...prev.habits, habit],
      history: { ...prev.history, [habit.id]: [] },
    }))
  }, [])

  const deleteHabit = useCallback((id) => {
    // stop timer silently
    if (intervalsRef.current[id]) {
      clearInterval(intervalsRef.current[id])
      delete intervalsRef.current[id]
    }
    if (activeIdRef.current === id) activeIdRef.current = null

    setState(prev => {
      const { [id]: _, ...history } = prev.history
      return {
        habits: prev.habits.filter(h => h.id !== id),
        history,
      }
    })
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

    intervalsRef.current[id] = setInterval(() => {
      setState(prev => ({
        ...prev,
        habits: prev.habits.map(h => h),  // trigger re-render to update displayed time
      }))
    }, 500)
  }, [])

  const stopTimer = useCallback((id, save = true) => {
    if (intervalsRef.current[id]) {
      clearInterval(intervalsRef.current[id])
      delete intervalsRef.current[id]
    }
    if (activeIdRef.current === id) activeIdRef.current = null

    setState(prev => {
      const habit = prev.habits.find(h => h.id === id)
      if (!habit || habit.startedAt === null) return prev

      const duration = Date.now() - habit.startedAt
      const newSession = { startedAt: habit.startedAt, duration }
      const shouldSave = save && duration > 1000

      return {
        habits: prev.habits.map(h =>
          h.id === id
            ? { ...h, elapsed: h.elapsed + duration, startedAt: null }
            : h
        ),
        history: {
          ...prev.history,
          [id]: shouldSave
            ? [...(prev.history[id] || []), newSession]
            : prev.history[id],
        },
      }
    })
  }, [])

  const toggleTimer = useCallback((id) => {
    setState(prev => {
      const habit = prev.habits.find(h => h.id === id)
      if (!habit) return prev

      const currentActive = activeIdRef.current

      // if another habit is running, stop it first
      if (currentActive && currentActive !== id) {
        const activeHabit = prev.habits.find(h => h.id === currentActive)
        if (activeHabit && activeHabit.startedAt !== null) {
          // we'll stop it via side effect after render
          setTimeout(() => stopTimer(currentActive, true), 0)
        }
      }

      if (habit.startedAt !== null) {
        // will stop
        setTimeout(() => stopTimer(id, true), 0)
      } else {
        // will start
        setTimeout(() => startTimer(id), 0)
      }

      return prev
    })
  }, [startTimer, stopTimer])

  return { state, addHabit, deleteHabit, toggleTimer }
}
