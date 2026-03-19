import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'health-course-progress'

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveProgress(map) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // ignore
  }
}

export function useCourseProgress() {
  const [progressMap, setProgressMap] = useState(loadProgress)

  useEffect(() => {
    saveProgress(progressMap)
  }, [progressMap])

  const updateModule = useCallback((courseId, moduleIndex) => {
    if (courseId == null || Number.isNaN(Number(courseId))) return
    setProgressMap((prev) => {
      const key = String(courseId)
      const prevIndex = typeof prev[key] === 'number' ? prev[key] : -1
      const nextIndex = Math.max(prevIndex, moduleIndex)
      if (nextIndex === prevIndex) return prev
      return { ...prev, [key]: nextIndex }
    })
  }, [])

  const getPercent = useCallback(
    (courseId, totalModules) => {
      if (!courseId || !totalModules || totalModules <= 0) return 0
      const key = String(courseId)
      const idx = typeof progressMap[key] === 'number' ? progressMap[key] : -1
      if (idx < 0) return 0
      const percent = ((idx + 1) / totalModules) * 100
      return Math.max(0, Math.min(100, Math.round(percent)))
    },
    [progressMap],
  )

  const isCompleted = useCallback(
    (courseId, totalModules) => getPercent(courseId, totalModules) >= 100,
    [getPercent],
  )

  const resetCourse = useCallback((courseId) => {
    setProgressMap((prev) => {
      const key = String(courseId)
      if (!(key in prev)) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  return { progressMap, updateModule, getPercent, isCompleted, resetCourse }
}

