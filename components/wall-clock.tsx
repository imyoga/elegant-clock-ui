"use client"

import { useEffect, useState, useRef } from "react"

export function WallClock() {
  const [time, setTime] = useState(new Date())
  
  // Track cumulative rotations to avoid counter-clockwise snap at 12 o'clock
  const secondRotation = useRef(0)
  const minuteRotation = useRef(0)
  const hourRotation = useRef(0)
  const prevSeconds = useRef(-1)
  const prevMinutes = useRef(-1)
  const prevHours = useRef(-1)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Use UTC time
  const seconds = time.getUTCSeconds()
  const minutes = time.getUTCMinutes()
  const hours24 = time.getUTCHours()
  const hours = hours24 % 12

  // Calculate base rotation angles
  const baseSecondDegrees = seconds * 6
  const baseMinuteDegrees = minutes * 6 + seconds * 0.1
  const baseHourDegrees = hours * 30 + minutes * 0.5

  // Handle seconds wrap-around (59 -> 0)
  if (prevSeconds.current !== -1) {
    if (prevSeconds.current > 45 && seconds < 15) {
      // Crossed from 59 to 0, add a full rotation
      secondRotation.current += 360
    }
  }
  prevSeconds.current = seconds

  // Handle minutes wrap-around (59 -> 0)
  if (prevMinutes.current !== -1) {
    if (prevMinutes.current > 45 && minutes < 15) {
      minuteRotation.current += 360
    }
  }
  prevMinutes.current = minutes

  // Handle hours wrap-around (11 -> 0)
  if (prevHours.current !== -1) {
    if (prevHours.current > 9 && hours < 3) {
      hourRotation.current += 360
    }
  }
  prevHours.current = hours

  // Final rotation values (cumulative)
  const secondDegrees = baseSecondDegrees + secondRotation.current
  const minuteDegrees = baseMinuteDegrees + minuteRotation.current
  const hourDegrees = baseHourDegrees + hourRotation.current

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

  // Format digital time as 24h with leading zeros
  const digitalTime = `${hours24.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

  return (
    <div className="relative flex flex-col items-center gap-4">
      {/* UTC label fixed in viewport corner */}
      <div className="fixed top-4 right-4 z-50 px-3 py-1 rounded-md bg-accent/10 border border-accent/30 backdrop-blur-sm">
        <span className="text-xs font-medium text-accent tracking-wider">UTC</span>
      </div>

      {/* Clock container */}
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

      {/* Digital clock display */}
      <div className="flex flex-col items-center gap-1">
        <div className="font-mono text-3xl md:text-4xl font-light tracking-widest text-foreground tabular-nums">
          {digitalTime}
        </div>
        <span className="text-xs text-muted-foreground tracking-wide">24-HOUR FORMAT</span>
      </div>
    </div>
  )
}
