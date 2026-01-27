'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface CounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
}

export default function Counter({ end, duration = 2000, suffix = '', prefix = '', decimals = 0 }: CounterProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const counterRef = useRef<HTMLSpanElement>(null)

  const animateCounter = useCallback(() => {
    const startTime = Date.now()
    const startValue = 0

    const updateCounter = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)
      const easedProgress = easeOutQuart(progress)

      const currentValue = startValue + (end - startValue) * easedProgress
      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(updateCounter)
      }
    }

    requestAnimationFrame(updateCounter)
  }, [end, duration])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            animateCounter()
          }
        })
      },
      { threshold: 0.5 }
    )

    const currentRef = counterRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasAnimated, animateCounter])

  return (
    <span ref={counterRef}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  )
}
