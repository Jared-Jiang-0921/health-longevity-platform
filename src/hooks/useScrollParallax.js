import { useEffect, useRef } from 'react'

/**
 * 滚动视差：scrollY × rate，默认 4%（约 3–5% 区间）
 * @param {number} [rate=0.04]
 */
export function useScrollParallax(rate = 0.04) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let ticking = false

    const update = () => {
      const y = window.scrollY * rate
      el.style.transform = `translate3d(0, ${y}px, 0)`
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update)
        ticking = true
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [rate])

  return ref
}
