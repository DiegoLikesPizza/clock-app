"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface RollingDigitProps {
  digit: number;
  maxDigit?: number;
  textColor?: string;
}

// The digit height in pixels
const DIGIT_HEIGHT = 120;
// Digits to show above and below
const VISIBLE_ABOVE = 10;
const VISIBLE_BELOW = 10;
// Total visible height
const VISIBLE_HEIGHT = (VISIBLE_ABOVE + 1 + VISIBLE_BELOW) * DIGIT_HEIGHT;
// Animation duration in ms
const ANIMATION_DURATION = 350;

export default function RollingDigit({ digit, maxDigit = 9, textColor = "#ffffff" }: RollingDigitProps) {
  const [displayDigit, setDisplayDigit] = useState(digit);
  const [offset, setOffset] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const totalDigits = maxDigit + 1;

  // Easing function for smooth animation
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
    const easedProgress = easeOutCubic(progress);

    setOffset(-DIGIT_HEIGHT * easedProgress);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Animation complete - update to new digit and reset
      setDisplayDigit(digit);
      setOffset(0);
      startTimeRef.current = 0;
    }
  }, [digit]);

  useEffect(() => {
    if (displayDigit !== digit) {
      // Cancel any ongoing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      startTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [digit, displayDigit, animate]);

  // Build strip based on displayDigit (the digit currently shown)
  const getDigitStrip = useCallback(() => {
    const strip: number[] = [];

    // 10 digits above (descending, wrapping around)
    for (let i = VISIBLE_ABOVE; i >= 1; i--) {
      let d = displayDigit - i;
      while (d < 0) d += totalDigits;
      strip.push(d % totalDigits);
    }

    // Current displayed digit
    strip.push(displayDigit);

    // 10 digits below (ascending, wrapping around)
    for (let i = 1; i <= VISIBLE_BELOW; i++) {
      strip.push((displayDigit + i) % totalDigits);
    }

    return strip;
  }, [displayDigit, totalDigits]);

  const digitStrip = getDigitStrip();

  // Calculate opacity and scale based on distance from center
  const getDigitStyle = (index: number) => {
    const centerIndex = VISIBLE_ABOVE;
    const distance = Math.abs(index - centerIndex);

    // Current digit is fully opaque, others fade gradually
    const opacity = distance === 0 ? 1 : Math.max(0.05, 0.35 - distance * 0.03);

    // Scale: current digit is 1, others only slightly smaller
    const scale = distance === 0 ? 1 : Math.max(0.75, 0.95 - distance * 0.02);

    return { opacity, scale };
  };

  return (
    <div
      className="relative overflow-hidden"
      style={{
        height: `${VISIBLE_HEIGHT}px`,
        width: "135px"
      }}
    >
      {/* The strip that slides upward */}
      <div
        className="absolute w-full will-change-transform"
        style={{
          transform: `translateY(${offset}px)`,
        }}
      >
        {digitStrip.map((d, index) => {
          const style = getDigitStyle(index);
          return (
            <div
              key={`pos-${index}`}
              className="flex items-center justify-center"
              style={{
                height: `${DIGIT_HEIGHT}px`,
                fontSize: "7.5rem",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontWeight: 500,
                lineHeight: 1,
                color: textColor,
                opacity: style.opacity,
                transform: `scale(${style.scale})`,
              }}
            >
              <DigitDisplay digit={d} textColor={textColor} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Component to render digits with dot indicator for circular digits like 0
function DigitDisplay({ digit, textColor }: { digit: number; textColor: string }) {
  const hasInnerDot = digit === 0 || digit === 8;

  return (
    <span className="relative inline-block">
      {digit}
      {hasInnerDot && (
        <span
          className="absolute rounded-full"
          style={{
            width: "6px",
            height: "6px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: textColor,
            opacity: 0.4,
          }}
        />
      )}
    </span>
  );
}

