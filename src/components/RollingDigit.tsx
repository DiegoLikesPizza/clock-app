"use client";

interface RollingDigitProps {
  digit: number;
  maxDigit?: number;
  textColor?: string;
  milliseconds: number;
  willChange: boolean;
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
// Animation starts at this ms value (so it ends at ms=0 of next second)
const ANIMATION_START_MS = 1000 - ANIMATION_DURATION;

// Helper function to interpolate between two hex colors
function interpolateColor(color1: string, color2: string, factor: number): string {
  // Parse hex color to RGB
  const parseHex = (hex: string) => {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16),
    };
  };

  const c1 = parseHex(color1);
  const c2 = parseHex(color2);

  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);

  return `rgb(${r}, ${g}, ${b})`;
}

// Gray color for transition
const GRAY_COLOR = "#666666";

// Easing function for smooth animation
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function RollingDigit({ digit, maxDigit = 9, textColor = "#ffffff", milliseconds, willChange }: RollingDigitProps) {
  const totalDigits = maxDigit + 1;

  // Calculate animation progress based on milliseconds
  // Animation runs from ANIMATION_START_MS to 1000 (end of second)
  // Only animate if this digit will actually change
  const isAnimating = willChange && milliseconds >= ANIMATION_START_MS;
  const rawProgress = isAnimating
    ? (milliseconds - ANIMATION_START_MS) / ANIMATION_DURATION
    : 0;
  const animProgress = easeOutCubic(Math.min(1, rawProgress));

  // During animation, we show current digit transitioning to next
  // After animation (ms < ANIMATION_START_MS), we show the current digit statically
  const displayDigit = digit;
  const offset = isAnimating ? -DIGIT_HEIGHT * animProgress : 0;

  // Build strip based on displayDigit (the digit currently shown)
  const digitStrip: number[] = [];
  // 10 digits above (descending, wrapping around)
  for (let i = VISIBLE_ABOVE; i >= 1; i--) {
    let d = displayDigit - i;
    while (d < 0) d += totalDigits;
    digitStrip.push(d % totalDigits);
  }
  // Current displayed digit
  digitStrip.push(displayDigit);
  // 10 digits below (ascending, wrapping around)
  for (let i = 1; i <= VISIBLE_BELOW; i++) {
    digitStrip.push((displayDigit + i) % totalDigits);
  }

  // Calculate opacity, scale, and color based on distance from center
  const getDigitStyle = (index: number) => {
    const centerIndex = VISIBLE_ABOVE;
    const distance = Math.abs(index - centerIndex);

    // Current digit is fully opaque, others fade gradually
    const opacity = distance === 0 ? 1 : Math.max(0.05, 0.35 - distance * 0.03);

    // Scale: current digit is 1, others only slightly smaller
    const scale = distance === 0 ? 1 : Math.max(0.75, 0.95 - distance * 0.02);

    // Color: center digit is textColor, others are gray
    // During animation: old digit fades to gray, new digit fades from gray to textColor
    // Use eased progress so color matches position movement
    let color = GRAY_COLOR;
    if (index === centerIndex) {
      if (isAnimating) {
        // Current (old) digit: textColor -> gray
        color = interpolateColor(textColor, GRAY_COLOR, animProgress);
      } else {
        // Not animating: center digit is textColor
        color = textColor;
      }
    } else if (index === centerIndex + 1 && isAnimating) {
      // Next (new) digit: gray -> textColor
      color = interpolateColor(GRAY_COLOR, textColor, animProgress);
    }

    return { opacity, scale, color };
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
                color: style.color,
                opacity: style.opacity,
                transform: `scale(${style.scale})`,
              }}
            >
              <DigitDisplay digit={d} textColor={style.color} />
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

