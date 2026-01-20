"use client";

import { useEffect, useState, useRef } from "react";
import RollingDigit from "./RollingDigit";

interface TimeDigits {
  h1: number; // Hour tens (0-2)
  h2: number; // Hour ones (0-9)
  m1: number; // Minute tens (0-5)
  m2: number; // Minute ones (0-9)
  s1: number; // Second tens (0-5)
  s2: number; // Second ones (0-9)
}

interface TimeState {
  digits: TimeDigits;
  milliseconds: number;
}

function getTimeState(date: Date): TimeState {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  return {
    digits: {
      h1: Math.floor(hours / 10),
      h2: hours % 10,
      m1: Math.floor(minutes / 10),
      m2: minutes % 10,
      s1: Math.floor(seconds / 10),
      s2: seconds % 10,
    },
    milliseconds,
  };
}

interface RollingClockProps {
  textColor?: string;
}

export default function RollingClock({ textColor = "#ffffff" }: RollingClockProps) {
  const [timeState, setTimeState] = useState<TimeState>(() =>
    getTimeState(new Date())
  );
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const updateTime = () => {
      setTimeState(getTimeState(new Date()));
      requestRef.current = requestAnimationFrame(updateTime);
    };

    requestRef.current = requestAnimationFrame(updateTime);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const { digits, milliseconds } = timeState;

  // Calculate which digits will change at the next second
  // s2 always changes every second
  const s2WillChange = true;
  // s1 changes when s2 goes from 9 to 0
  const s1WillChange = digits.s2 === 9;
  // m2 changes when s1 goes from 5 to 0 (which means s2 is also 9)
  const m2WillChange = digits.s1 === 5 && digits.s2 === 9;
  // m1 changes when m2 goes from 9 to 0
  const m1WillChange = digits.m2 === 9 && m2WillChange;
  // h2 changes when m1 goes from 5 to 0
  const h2WillChange = digits.m1 === 5 && m1WillChange;
  // h1 changes when h2 goes from 9 to 0 OR when time goes from 19:59:59 to 20:00:00 OR from 23:59:59 to 00:00:00
  const h1WillChange = (digits.h2 === 9 || (digits.h1 === 1 && digits.h2 === 9) || (digits.h1 === 2 && digits.h2 === 3)) && h2WillChange;

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-1">
        {/* Hours */}
        <div className="flex">
          <RollingDigit digit={digits.h1} maxDigit={2} textColor={textColor} milliseconds={milliseconds} willChange={h1WillChange} />
          <RollingDigit digit={digits.h2} maxDigit={9} textColor={textColor} milliseconds={milliseconds} willChange={h2WillChange} />
        </div>

        {/* Separator */}
        <Separator color={textColor} />

        {/* Minutes */}
        <div className="flex">
          <RollingDigit digit={digits.m1} maxDigit={5} textColor={textColor} milliseconds={milliseconds} willChange={m1WillChange} />
          <RollingDigit digit={digits.m2} maxDigit={9} textColor={textColor} milliseconds={milliseconds} willChange={m2WillChange} />
        </div>

        {/* Separator */}
        <Separator color={textColor} />

        {/* Seconds */}
        <div className="flex">
          <RollingDigit digit={digits.s1} maxDigit={5} textColor={textColor} milliseconds={milliseconds} willChange={s1WillChange} />
          <RollingDigit digit={digits.s2} maxDigit={9} textColor={textColor} milliseconds={milliseconds} willChange={s2WillChange} />
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

