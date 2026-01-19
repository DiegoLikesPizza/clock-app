"use client";

import { useEffect, useState, useRef } from "react";

interface AnalogClockProps {
  color?: string;
}

export default function AnalogClock({ color = "#ffffff" }: AnalogClockProps) {
  const [time, setTime] = useState(() => new Date());
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date());
      requestRef.current = requestAnimationFrame(updateTime);
    };

    requestRef.current = requestAnimationFrame(updateTime);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();
  const hours12 = hours % 12;

  // Calculate rotation angles
  const secondDeg = seconds * 6; // 360 / 60 = 6 degrees per second
  const minuteDeg = minutes * 6 + seconds * 0.1; // 6 degrees per minute + slight movement from seconds
  const hourDeg = hours12 * 30 + minutes * 0.5; // 30 degrees per hour + movement from minutes

  // Format time string
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const size = 500;
  const center = size / 2;
  const tickOuter = size / 2 - 20;
  const tickInnerMajor = size / 2 - 50;
  const tickInnerMinor = size / 2 - 35;

  // Generate tick marks
  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const angle = (i * 6 - 90) * (Math.PI / 180);
    const isMajor = i % 5 === 0;
    const innerRadius = isMajor ? tickInnerMajor : tickInnerMinor;
    
    const x1 = center + tickOuter * Math.cos(angle);
    const y1 = center + tickOuter * Math.sin(angle);
    const x2 = center + innerRadius * Math.cos(angle);
    const y2 = center + innerRadius * Math.sin(angle);
    
    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={isMajor ? 3 : 1}
        strokeLinecap="round"
        opacity={isMajor ? 1 : 0.5}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 md:gap-6 p-4">
      {/* Digital time display - smaller on mobile */}
      <div
        className="text-4xl md:text-6xl font-medium"
        style={{
          color: color,
          fontFamily: "var(--font-jetbrains-mono), monospace",
        }}
      >
        {timeString}
      </div>

      {/* SVG clock - responsive sizing */}
      <svg
        className="w-[320px] h-[320px] md:w-[500px] md:h-[500px]"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Outer circle */}
        <circle
          cx={center}
          cy={center}
          r={size / 2 - 10}
          fill="none"
          stroke={color}
          strokeWidth="3"
        />

        {/* Tick marks */}
        {ticks}

        {/* Hour hand */}
        <line
          x1={center}
          y1={center}
          x2={center}
          y2={center - 120}
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          transform={`rotate(${hourDeg}, ${center}, ${center})`}
        />

        {/* Minute hand */}
        <line
          x1={center}
          y1={center}
          x2={center}
          y2={center - 170}
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${minuteDeg}, ${center}, ${center})`}
        />

        {/* Second hand */}
        <line
          x1={center}
          y1={center + 30}
          x2={center}
          y2={center - 190}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${secondDeg}, ${center}, ${center})`}
        />

        {/* Center dot */}
        <circle
          cx={center}
          cy={center}
          r="8"
          fill={color}
        />
      </svg>
    </div>
  );
}

