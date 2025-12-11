"use client"

import { useEffect, useState } from "react"

export function WallClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const seconds = time.getSeconds()
  const minutes = time.getMinutes()
  const hours = time.getHours() % 12

  // Calculate rotation angles
  const secondDegrees = seconds * 6 // 360 / 60 = 6 degrees per second
  const minuteDegrees = minutes * 6 + seconds * 0.1 // 6 degrees per minute + smooth transition
  const hourDegrees = hours * 30 + minutes * 0.5 // 30 degrees per hour + smooth transition

  // Hour markers positions (12 markers)
  const hourMarkers = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180)
    const isMainHour = i % 3 === 0
    const outerRadius = 44
    const innerRadius = isMainHour ? 38 : 40

    return {
      x1: 50 + Math.cos(angle) * innerRadius,
      y1: 50 + Math.sin(angle) * innerRadius,
      x2: 50 + Math.cos(angle) * outerRadius,
      y2: 50 + Math.sin(angle) * outerRadius,
      isMain: isMainHour,
    }
  })

  // Minute markers positions (60 markers)
  const minuteMarkers = Array.from({ length: 60 }, (_, i) => {
    if (i % 5 === 0) return null // Skip hour positions
    const angle = (i * 6 - 90) * (Math.PI / 180)
    const outerRadius = 44
    const innerRadius = 42

    return {
      x1: 50 + Math.cos(angle) * innerRadius,
      y1: 50 + Math.sin(angle) * innerRadius,
      x2: 50 + Math.cos(angle) * outerRadius,
      y2: 50 + Math.sin(angle) * outerRadius,
    }
  }).filter(Boolean)

  return (
    <div className="relative">
      {/* Subtle shadow effect */}
      <div className="absolute inset-0 rounded-full bg-foreground/5 blur-2xl scale-110" />

      <svg viewBox="0 0 100 100" className="w-72 h-72 md:w-96 md:h-96 drop-shadow-lg">
        {/* Clock face background */}
        <circle cx="50" cy="50" r="48" className="fill-card stroke-border" strokeWidth="0.5" />

        {/* Inner subtle ring */}
        <circle cx="50" cy="50" r="46" fill="none" className="stroke-border/50" strokeWidth="0.3" />

        {/* Minute markers */}
        {minuteMarkers.map((marker, i) => (
          <line
            key={`minute-${i}`}
            x1={marker!.x1}
            y1={marker!.y1}
            x2={marker!.x2}
            y2={marker!.y2}
            className="stroke-muted-foreground/30"
            strokeWidth="0.3"
            strokeLinecap="round"
          />
        ))}

        {/* Hour markers */}
        {hourMarkers.map((marker, i) => (
          <line
            key={`hour-${i}`}
            x1={marker.x1}
            y1={marker.y1}
            x2={marker.x2}
            y2={marker.y2}
            className={marker.isMain ? "stroke-foreground" : "stroke-foreground/70"}
            strokeWidth={marker.isMain ? "1.2" : "0.6"}
            strokeLinecap="round"
          />
        ))}

        {/* Hour hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="26"
          className="stroke-foreground"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            transformOrigin: "50px 50px",
            transform: `rotate(${hourDegrees}deg)`,
            transition: "transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44)",
          }}
        />

        {/* Minute hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="16"
          className="stroke-foreground"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{
            transformOrigin: "50px 50px",
            transform: `rotate(${minuteDegrees}deg)`,
            transition: "transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44)",
          }}
        />

        {/* Second hand */}
        <g
          style={{
            transformOrigin: "50px 50px",
            transform: `rotate(${secondDegrees}deg)`,
            transition: "transform 0.1s cubic-bezier(0.4, 2.08, 0.55, 0.44)",
          }}
        >
          <line x1="50" y1="58" x2="50" y2="12" className="stroke-accent" strokeWidth="0.8" strokeLinecap="round" />
          {/* Second hand counterweight */}
          <circle cx="50" cy="56" r="1.5" className="fill-accent" />
        </g>

        {/* Center cap */}
        <circle cx="50" cy="50" r="3" className="fill-foreground" />
        <circle cx="50" cy="50" r="1.5" className="fill-card" />
      </svg>
    </div>
  )
}
