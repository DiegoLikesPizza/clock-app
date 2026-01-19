"use client";

import { useEffect, useState, useRef } from "react";
import RollingDigit from "./RollingDigit";
import { useAtomicTime } from "@/hooks/useAtomicTime";

interface TimeDigits {
  h1: number; // Hour tens (0-2)
  h2: number; // Hour ones (0-9)
  m1: number; // Minute tens (0-5)
  m2: number; // Minute ones (0-9)
  s1: number; // Second tens (0-5)
  s2: number; // Second ones (0-9)
}

function getTimeDigits(date: Date): TimeDigits {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return {
    h1: Math.floor(hours / 10),
    h2: hours % 10,
    m1: Math.floor(minutes / 10),
    m2: minutes % 10,
    s1: Math.floor(seconds / 10),
    s2: seconds % 10,
  };
}

interface RollingClockProps {
  textColor?: string;
}

export default function RollingClock({ textColor = "#ffffff" }: RollingClockProps) {
  const { time } = useAtomicTime();
  const [timeDigits, setTimeDigits] = useState<TimeDigits>(() =>
    getTimeDigits(new Date())
  );
  const previousTimeRef = useRef<string>("");

  useEffect(() => {
    const timeString = time.toLocaleTimeString("en-US", { hour12: false });

    // Only update if time has changed (to avoid unnecessary re-renders)
    if (timeString !== previousTimeRef.current) {
      previousTimeRef.current = timeString;
      setTimeDigits(getTimeDigits(time));
    }
  }, [time]);

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-1">
        {/* Hours */}
        <div className="flex">
          <RollingDigit digit={timeDigits.h1} maxDigit={2} textColor={textColor} />
          <RollingDigit digit={timeDigits.h2} maxDigit={9} textColor={textColor} />
        </div>

        {/* Separator */}
        <Separator color={textColor} />

        {/* Minutes */}
        <div className="flex">
          <RollingDigit digit={timeDigits.m1} maxDigit={5} textColor={textColor} />
          <RollingDigit digit={timeDigits.m2} maxDigit={9} textColor={textColor} />
        </div>

        {/* Separator */}
        <Separator color={textColor} />

        {/* Seconds */}
        <div className="flex">
          <RollingDigit digit={timeDigits.s1} maxDigit={5} textColor={textColor} />
          <RollingDigit digit={timeDigits.s2} maxDigit={9} textColor={textColor} />
        </div>
      </div>
    </div>
  );
}

function Separator({ color }: { color: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 px-6">
      <div className="h-5 w-5 rounded-full" style={{ backgroundColor: color }} />
      <div className="h-5 w-5 rounded-full" style={{ backgroundColor: color }} />
    </div>
  );
}

