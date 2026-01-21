"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import RollingClock from "@/components/RollingClock";
import AnalogClock from "@/components/AnalogClock";
import ColorPicker from "@/components/ColorPicker";
import GradientPicker from "@/components/GradientPicker";
import BackgroundSelector from "@/components/BackgroundSelector";

const DARK_COLORS = ["#c41e1e", "#1a5f7a", "#4ade80", "#a855f7", "#ffffff"];
const LIGHT_COLORS = ["#c41e1e", "#1a5f7a", "#16a34a", "#9333ea", "#000000"];

const GRADIENTS = [
  { id: "sunset", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)", colors: ["#667eea", "#764ba2", "#f093fb"] },
  { id: "ocean", gradient: "linear-gradient(135deg, #0c1445 0%, #1a5f7a 50%, #00d4ff 100%)", colors: ["#0c1445", "#1a5f7a", "#00d4ff"] },
  { id: "fire", gradient: "linear-gradient(135deg, #1a0000 0%, #8b0000 50%, #ff6b35 100%)", colors: ["#1a0000", "#8b0000", "#ff6b35"] },
  { id: "forest", gradient: "linear-gradient(135deg, #0a1f0a 0%, #134e13 50%, #4ade80 100%)", colors: ["#0a1f0a", "#134e13", "#4ade80"] },
  { id: "aurora", gradient: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)", colors: ["#0f0c29", "#302b63", "#24243e"] },
];

// Bell schedule timestamps (hours, minutes)
const BELL_SCHEDULE = [
  { h: 8, m: 40 },
  { h: 9, m: 25 },
  { h: 9, m: 40 },
  { h: 10, m: 25 },
  { h: 11, m: 10 },
  { h: 11, m: 25 },
  { h: 12, m: 10 },
  { h: 12, m: 55 },
  { h: 13, m: 40 },
  { h: 14, m: 25 },
  { h: 15, m: 10 },
  { h: 15, m: 55 },
  { h: 16, m: 40 },
];

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAnalog, setIsAnalog] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [isBgSelectorOpen, setIsBgSelectorOpen] = useState(false);
  const [areLeftControlsHiding, setAreLeftControlsHiding] = useState(false);
  const [areControlsHidden, setAreControlsHidden] = useState(false);
  const [clockPosition, setClockPosition] = useState<'center' | 'left' | 'right'>('center');
  const [textColor, setTextColor] = useState("#ffffff");
  const [selectedGradient, setSelectedGradient] = useState<string | null>(null);
  const [selectedBgImage, setSelectedBgImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Secret menu state
  const [isSecretMenuOpen, setIsSecretMenuOpen] = useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [countdownEnabled, setCountdownEnabled] = useState(false);
  const [countdown, setCountdown] = useState<string>("");
  const [snowEnabled, setSnowEnabled] = useState(false);
  const [starsEnabled, setStarsEnabled] = useState(false);
  const [worldEnabled, setWorldEnabled] = useState(false);
  const [dateEnabled, setDateEnabled] = useState(false);
  const [quoteEnabled, setQuoteEnabled] = useState(false);
  const [spinEnabled, setSpinEnabled] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const lastKeyPressRef = useRef<{ key: string; time: number } | null>(null);
  const secretInputRef = useRef<HTMLInputElement>(null);

  // Secret codes list for help menu
  const SECRET_CODES = [
    { code: "BELL", description: "Countdown bis zur nächsten Pause" },
    { code: "SNOW", description: "Schneefall-Animation" },
    { code: "STARS", description: "Funkelnde Sterne" },
    { code: "WORLD", description: "Weltuhren (NY, London, Tokyo)" },
    { code: "DATE", description: "Datum anzeigen" },
    { code: "QUOTE", description: "Motivationszitat" },
    { code: "SPIN", description: "Uhr dreht sich" },
    { code: "RESET", description: "Alles zurücksetzen" },
  ];

  // Motivational quotes
  const QUOTES = [
    "The only way to do great work is to love what you do.",
    "Stay hungry, stay foolish.",
    "Time is what we want most, but what we use worst.",
    "The future depends on what you do today.",
    "Every moment is a fresh beginning.",
    "Don't watch the clock; do what it does. Keep going.",
    "Lost time is never found again.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Time flies over us, but leaves its shadow behind.",
    "Better three hours too soon than a minute too late.",
  ];

  // World clock timezones
  const TIMEZONES = [
    { city: "New York", zone: "America/New_York" },
    { city: "London", zone: "Europe/London" },
    { city: "Tokyo", zone: "Asia/Tokyo" },
  ];

  // Prevent hydration mismatch by only rendering time after mount
  useEffect(() => {
    setMounted(true);
    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Secret key listener (Shift+K twice quickly for input, Shift+H twice for help, Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes help menu
      if (e.key === 'Escape' && isHelpMenuOpen) {
        setIsHelpMenuOpen(false);
        return;
      }

      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const now = Date.now();

      if (e.shiftKey && e.key === 'K') {
        if (lastKeyPressRef.current?.key === 'K' && now - lastKeyPressRef.current.time < 500) {
          e.preventDefault();
          setIsSecretMenuOpen(prev => !prev);
          setIsHelpMenuOpen(false);
          setSecretInput("");
          lastKeyPressRef.current = null;
        } else {
          lastKeyPressRef.current = { key: 'K', time: now };
        }
      } else if (e.shiftKey && e.key === 'H') {
        if (lastKeyPressRef.current?.key === 'H' && now - lastKeyPressRef.current.time < 500) {
          e.preventDefault();
          setIsHelpMenuOpen(prev => !prev);
          setIsSecretMenuOpen(false);
          lastKeyPressRef.current = null;
        } else {
          lastKeyPressRef.current = { key: 'H', time: now };
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHelpMenuOpen]);

  // Focus secret input when menu opens
  useEffect(() => {
    if (isSecretMenuOpen && secretInputRef.current) {
      setTimeout(() => {
        secretInputRef.current?.focus();
      }, 10);
    }
  }, [isSecretMenuOpen]);

  // Countdown timer
  useEffect(() => {
    if (!countdownEnabled) return;

    const updateCountdown = () => {
      const now = new Date();
      const currentTotalSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

      // Find next bell time
      let nextBell: { h: number; m: number } | null = null;
      for (const bell of BELL_SCHEDULE) {
        const bellTotalSeconds = bell.h * 3600 + bell.m * 60;
        if (bellTotalSeconds > currentTotalSeconds) {
          nextBell = bell;
          break;
        }
      }

      let diff: number;
      if (!nextBell) {
        // No more bells today, show first bell of tomorrow
        nextBell = BELL_SCHEDULE[0];
        const targetTime = new Date(now);
        targetTime.setDate(targetTime.getDate() + 1);
        targetTime.setHours(nextBell.h, nextBell.m, 0, 0);
        diff = targetTime.getTime() - now.getTime();
      } else {
        const targetTime = new Date(now);
        targetTime.setHours(nextBell.h, nextBell.m, 0, 0);
        diff = targetTime.getTime() - now.getTime();
      }

      // Ensure diff is never negative
      if (diff < 0) diff = 0;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setCountdown(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [countdownEnabled]);

  // Handle secret input submission
  const handleSecretSubmit = useCallback(() => {
    const input = secretInput.trim().toUpperCase();
    const codes = input.split("&");

    codes.forEach(code => {
      switch (code) {
        case "RESET":
          setCountdownEnabled(false);
          setCountdown("");
          setSnowEnabled(false);
          setStarsEnabled(false);
          setWorldEnabled(false);
          setDateEnabled(false);
          setQuoteEnabled(false);
          setCurrentQuote("");
          setSpinEnabled(false);
          break;
        case "BELL":
          setCountdownEnabled(true);
          break;
        case "SNOW":
          setSnowEnabled(prev => !prev);
          break;
        case "STARS":
          setStarsEnabled(prev => !prev);
          break;
        case "WORLD":
          setWorldEnabled(prev => !prev);
          break;
        case "DATE":
          setDateEnabled(prev => !prev);
          break;
        case "QUOTE":
          setQuoteEnabled(prev => !prev);
          setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
          break;
        case "SPIN":
          setSpinEnabled(prev => !prev);
          break;
      }
    });

    setSecretInput("");
    setIsSecretMenuOpen(false);
  }, [secretInput, QUOTES]);

  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;
  const bgColor = isDarkMode ? "#000000" : "#ffffff";

  // Build background style with priority: image > gradient > solid color
  const getBackgroundStyle = () => {
    if (selectedBgImage) {
      return {
        backgroundImage: `url(${selectedBgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    if (selectedGradient) {
      return { background: selectedGradient };
    }
    return { backgroundColor: bgColor };
  };

  // Listen for fullscreen changes (e.g., user presses Escape)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);



  const handleModeToggle = () => {
    setIsDarkMode(!isDarkMode);
    // Reset text color to default for the new mode
    setTextColor(isDarkMode ? "#000000" : "#ffffff");
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const pipWindowRef = useRef<Window | null>(null);
  const pipIntervalRef = useRef<number | null>(null);

  const togglePiP = async () => {
    try {
      // Check if Document PiP is supported
      if (!('documentPictureInPicture' in window)) {
        console.error('Document Picture-in-Picture not supported');
        return;
      }

      // Close existing PiP window
      if (pipWindowRef.current && !pipWindowRef.current.closed) {
        pipWindowRef.current.close();
        pipWindowRef.current = null;
        setIsPiP(false);
        if (pipIntervalRef.current) {
          clearInterval(pipIntervalRef.current);
          pipIntervalRef.current = null;
        }
        return;
      }

      // Request Document PiP window
      const pipWindow = await (window as unknown as { documentPictureInPicture: { requestWindow: (options: { width: number; height: number }) => Promise<Window> } }).documentPictureInPicture.requestWindow({
        width: 300,
        height: 350,
      });

      pipWindowRef.current = pipWindow;
      setIsPiP(true);

      // Style the PiP document
      const pipDocument = pipWindow.document;
      pipDocument.body.style.margin = '0';
      pipDocument.body.style.padding = '0';
      pipDocument.body.style.overflow = 'hidden';
      pipDocument.body.style.backgroundColor = isDarkMode ? '#000000' : '#ffffff';
      pipDocument.body.style.display = 'flex';
      pipDocument.body.style.alignItems = 'center';
      pipDocument.body.style.justifyContent = 'center';
      pipDocument.body.style.width = '100vw';
      pipDocument.body.style.height = '100vh';

      // Create canvas in PiP window
      const canvas = pipDocument.createElement('canvas');
      pipDocument.body.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Resize canvas to fit window
      const resizeCanvas = () => {
        const winWidth = pipWindow.innerWidth;
        const winHeight = pipWindow.innerHeight;
        canvas.width = winWidth;
        canvas.height = winHeight;
        canvas.style.width = winWidth + 'px';
        canvas.style.height = winHeight + 'px';
      };

      resizeCanvas();
      pipWindow.addEventListener('resize', resizeCanvas);

      // Draw analog clock with digital time above
      const drawClock = () => {
        const width = canvas.width;
        const height = canvas.height;

        // Calculate scale based on window size
        const baseSize = 350;
        const scale = Math.min(width, height) / baseSize;

        // Clear canvas
        ctx.fillStyle = isDarkMode ? '#000000' : '#ffffff';
        ctx.fillRect(0, 0, width, height);

        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();
        const hours12 = hours % 12;

        // Center point
        const centerX = width / 2;
        const centerY = height / 2;

        // Digital time at top
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        ctx.font = `bold ${Math.round(32 * scale)}px monospace`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(timeStr, centerX, centerY - 130 * scale);

        // Analog clock settings
        const clockCenterX = centerX;
        const clockCenterY = centerY + 25 * scale;
        const clockRadius = 120 * scale;

        // Draw clock face circle
        ctx.beginPath();
        ctx.arc(clockCenterX, clockCenterY, clockRadius, 0, Math.PI * 2);
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 3 * scale;
        ctx.stroke();

        // Draw tick marks
        for (let i = 0; i < 60; i++) {
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const isMajor = i % 5 === 0;
          const outerRadius = clockRadius - 5 * scale;
          const innerRadius = isMajor ? clockRadius - 20 * scale : clockRadius - 12 * scale;

          const x1 = clockCenterX + outerRadius * Math.cos(angle);
          const y1 = clockCenterY + outerRadius * Math.sin(angle);
          const x2 = clockCenterX + innerRadius * Math.cos(angle);
          const y2 = clockCenterY + innerRadius * Math.sin(angle);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = textColor;
          ctx.lineWidth = (isMajor ? 3 : 1) * scale;
          ctx.globalAlpha = isMajor ? 1 : 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // Calculate hand angles
        const secondAngle = (seconds * 6 - 90) * (Math.PI / 180);
        const minuteAngle = ((minutes * 6 + seconds * 0.1) - 90) * (Math.PI / 180);
        const hourAngle = ((hours12 * 30 + minutes * 0.5) - 90) * (Math.PI / 180);

        // Draw hour hand
        ctx.beginPath();
        ctx.moveTo(clockCenterX, clockCenterY);
        ctx.lineTo(
          clockCenterX + 55 * scale * Math.cos(hourAngle),
          clockCenterY + 55 * scale * Math.sin(hourAngle)
        );
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 6 * scale;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw minute hand
        ctx.beginPath();
        ctx.moveTo(clockCenterX, clockCenterY);
        ctx.lineTo(
          clockCenterX + 80 * scale * Math.cos(minuteAngle),
          clockCenterY + 80 * scale * Math.sin(minuteAngle)
        );
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 4 * scale;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw second hand
        ctx.beginPath();
        ctx.moveTo(
          clockCenterX - 15 * scale * Math.cos(secondAngle),
          clockCenterY - 15 * scale * Math.sin(secondAngle)
        );
        ctx.lineTo(
          clockCenterX + 90 * scale * Math.cos(secondAngle),
          clockCenterY + 90 * scale * Math.sin(secondAngle)
        );
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 2 * scale;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw center dot
        ctx.beginPath();
        ctx.arc(clockCenterX, clockCenterY, 6 * scale, 0, Math.PI * 2);
        ctx.fillStyle = textColor;
        ctx.fill();
      };

      // Draw first frame
      drawClock();

      // Start update interval
      if (pipIntervalRef.current) {
        clearInterval(pipIntervalRef.current);
      }
      pipIntervalRef.current = window.setInterval(() => {
        if (pipWindowRef.current && !pipWindowRef.current.closed) {
          drawClock();
        } else {
          if (pipIntervalRef.current) {
            clearInterval(pipIntervalRef.current);
            pipIntervalRef.current = null;
          }
          setIsPiP(false);
        }
      }, 100);

      // Handle window close
      pipWindow.addEventListener('pagehide', () => {
        setIsPiP(false);
        if (pipIntervalRef.current) {
          clearInterval(pipIntervalRef.current);
          pipIntervalRef.current = null;
        }
        pipWindowRef.current = null;
      });

    } catch (error) {
      console.error('PiP error:', error);
    }
  };

  // Handle selecting an image (clears gradient)
  const handleImageSelect = (url: string | null) => {
    setSelectedBgImage(url);
    if (url) {
      setSelectedGradient(null); // Clear gradient when image is selected
    }
  };

  // Handle selecting a gradient (always clears image)
  const handleGradientSelect = (gradient: string | null) => {
    setSelectedGradient(gradient);
    setSelectedBgImage(null); // Always clear image when using gradient picker
  };

  return (
    <div
      className="fixed inset-0 transition-all duration-500"
      style={getBackgroundStyle()}
    >
      {/* Snow Animation */}
      {snowEnabled && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 8 + 4 + 'px',
                height: Math.random() * 8 + 4 + 'px',
                left: Math.random() * 100 + '%',
                top: -20,
                opacity: Math.random() * 0.7 + 0.3,
                animation: `snowfall ${Math.random() * 5 + 5}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Stars Animation */}
      {starsEnabled && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                backgroundColor: isDarkMode ? '#fff' : '#000',
                opacity: Math.random() * 0.8 + 0.2,
                animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-20px) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      {/* Overlays for background image - sliding transitions */}
      {!isMobile && (
        <>
          {/* Center overlay - full dim (for digital clock or analog clock in center) */}
          <div
            className="hidden md:block absolute inset-0 transition-all duration-500"
            style={{
              background: isDarkMode ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.75)",
              opacity: selectedBgImage && (!isAnalog || (clockPosition === 'center' && !isBgSelectorOpen)) ? 1 : 0,
              pointerEvents: "none",
            }}
          />
          {/* Right overlay - dim right side, slides in from right (only for analog) */}
          <div
            className="hidden md:block absolute inset-0 transition-all duration-500"
            style={{
              background: isDarkMode
                ? `linear-gradient(to right, transparent 0%, transparent 25%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.85) 100%)`
                : `linear-gradient(to right, transparent 0%, transparent 25%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.85) 100%)`,
              transform: (() => {
                if (selectedBgImage && isAnalog && (clockPosition === 'right' || isBgSelectorOpen)) {
                  const hiddenOffset = areControlsHidden && !isBgSelectorOpen ? 250 : 0;
                  return `translateX(${hiddenOffset}px)`;
                }
                return 'translateX(100%)';
              })(),
              pointerEvents: "none",
            }}
          />
          {/* Left overlay - dim left side, slides in from left (only for analog) */}
          <div
            className="hidden md:block absolute inset-0 transition-all duration-500"
            style={{
              background: isDarkMode
                ? `linear-gradient(to left, transparent 0%, transparent 25%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.85) 100%)`
                : `linear-gradient(to left, transparent 0%, transparent 25%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.85) 100%)`,
              transform: (() => {
                if (selectedBgImage && isAnalog && clockPosition === 'left' && !isBgSelectorOpen) {
                  const hiddenOffset = areControlsHidden ? -250 : 0;
                  return `translateX(${hiddenOffset}px)`;
                }
                return 'translateX(-100%)';
              })(),
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* Clock container - position based on clockPosition and sidebar state (desktop only) */}
      <div
        className="pip-capture absolute inset-0 flex items-center justify-center transition-all duration-500"
        style={{
          transform: (() => {
            if (isMobile) return "translateX(0)";
            if (isBgSelectorOpen) return "translateX(350px)";
            // Digital clock is always centered
            if (!isAnalog) return "translateX(0)";
            // Analog clock respects clockPosition
            if (selectedBgImage || isAnalog) {
              const baseOffset = clockPosition === 'right' ? 350 : clockPosition === 'left' ? -350 : 0;
              const hiddenOffset = areControlsHidden ? (clockPosition === 'right' ? 200 : clockPosition === 'left' ? -200 : 0) : 0;
              return `translateX(${baseOffset + hiddenOffset}px)`;
            }
            return "translateX(0)";
          })(),
        }}
        suppressHydrationWarning
      >
        {mounted && (
          <div className="flex flex-col items-center" style={{
            animation: spinEnabled ? "spin 60s linear infinite" : "none",
          }}>
            {/* Countdown display above the clock */}
            {countdownEnabled && (isAnalog || isMobile) && (
              <div
                className="mb-4 text-2xl font-mono tracking-wider"
                style={{
                  color: textColor,
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  opacity: 0.8,
                }}
              >
                {countdown}
              </div>
            )}
            {(isAnalog || isMobile) ? (
              <AnalogClock color={textColor} />
            ) : (
              <RollingClock textColor={textColor} />
            )}
            {/* Date display */}
            {dateEnabled && (
              <div
                className="mt-4 text-xl font-mono tracking-wider"
                style={{
                  color: textColor,
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  opacity: 0.7,
                }}
              >
                {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            )}
            {/* Quote display */}
            {quoteEnabled && currentQuote && (
              <div
                className="mt-6 text-center max-w-md px-4"
                style={{
                  color: textColor,
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  opacity: 0.6,
                  fontSize: "0.9rem",
                  fontStyle: "italic",
                }}
              >
                "{currentQuote}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* World Clock */}
      {worldEnabled && mounted && (
        <div
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-8 z-40"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
          }}
        >
          {TIMEZONES.map((tz) => (
            <div key={tz.zone} className="text-center" style={{ color: textColor, opacity: 0.7 }}>
              <div className="text-xs uppercase tracking-wider mb-1">{tz.city}</div>
              <div className="text-lg">
                {new Date().toLocaleTimeString('de-DE', { timeZone: tz.zone, hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Secret Menu Overlay */}
      {isSecretMenuOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          onClick={() => setIsSecretMenuOpen(false)}
        >
          <div
            className="p-6 rounded-xl border-2"
            style={{
              backgroundColor: isDarkMode ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.9)",
              borderColor: textColor,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={secretInputRef}
              type="text"
              value={secretInput}
              onChange={(e) => setSecretInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSecretSubmit();
                if (e.key === "Escape") setIsSecretMenuOpen(false);
              }}
              className="w-48 px-4 py-2 rounded-lg border-2 bg-transparent outline-none text-center text-lg tracking-widest"
              style={{
                borderColor: textColor,
                color: textColor,
                fontFamily: "var(--font-jetbrains-mono), monospace",
              }}
              placeholder="•••••"
              maxLength={50}
            />
          </div>
        </div>
      )}

      {/* Help Menu Overlay */}
      {isHelpMenuOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          onClick={() => setIsHelpMenuOpen(false)}
        >
          <div
            className="p-6 rounded-xl border-2 max-w-md"
            style={{
              backgroundColor: isDarkMode ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.9)",
              borderColor: textColor,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-lg font-bold mb-4 text-center"
              style={{
                color: textColor,
                fontFamily: "var(--font-jetbrains-mono), monospace",
              }}
            >
              Secret Codes
            </h3>
            <div className="space-y-2">
              {SECRET_CODES.map((item) => (
                <div
                  key={item.code}
                  className="flex justify-between gap-4 py-1 border-b"
                  style={{
                    borderColor: `${textColor}20`,
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                  }}
                >
                  <span style={{ color: textColor, fontWeight: "bold" }}>{item.code}</span>
                  <span style={{ color: textColor, opacity: 0.7, fontSize: "0.85rem" }}>{item.description}</span>
                </div>
              ))}
            </div>
            <div
              className="mt-4 pt-3 border-t text-center text-xs"
              style={{
                borderColor: `${textColor}20`,
                color: textColor,
                opacity: 0.5,
                fontFamily: "var(--font-jetbrains-mono), monospace",
              }}
            >
              Kombiniere mit & (z.B. SNOW&DATE)
              <br />
              <span className="mt-1 block">Shift+K → Code eingeben | Shift+H → Hilfe</span>
            </div>
          </div>
        </div>
      )}

      {/* Background Selector Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <BackgroundSelector
          isOpen={isBgSelectorOpen}
          onClose={() => setIsBgSelectorOpen(false)}
          selectedImage={selectedBgImage}
          onImageSelect={handleImageSelect}
          textColor={textColor}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Dark/Light mode toggle - top right - hidden on mobile */}
      <button
        onClick={handleModeToggle}
        className="hidden md:flex fixed top-8 right-8 items-center gap-3 px-4 py-2 rounded-full border-2 transition-all duration-500 hover:scale-105"
        style={{
          borderColor: textColor,
          color: textColor,
          transform: areControlsHidden ? "translateX(200px)" : "translateX(0)",
          opacity: areControlsHidden ? 0 : 1,
          pointerEvents: areControlsHidden ? "none" : "auto",
        }}
      >
        <span className="text-sm font-medium" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
          {isDarkMode ? "DARK" : "LIGHT"}
        </span>
        <div
          className="relative w-12 h-6 rounded-full transition-colors duration-300"
          style={{ backgroundColor: isDarkMode ? "#333" : "#ddd" }}
        >
          <div
            className="absolute top-1 w-4 h-4 rounded-full transition-all duration-300"
            style={{
              backgroundColor: textColor,
              left: isDarkMode ? "4px" : "28px",
            }}
          />
        </div>
      </button>

      {/* Analog/Digital toggle - top left - hidden on mobile */}
      <button
        onClick={() => setIsAnalog(!isAnalog)}
        className="hidden md:flex fixed top-8 left-8 items-center gap-3 px-4 py-2 rounded-full border-2 transition-all duration-500 hover:scale-105"
        style={{
          borderColor: textColor,
          color: textColor,
          transform: (areControlsHidden || areLeftControlsHiding || isBgSelectorOpen) ? "translateX(-200px)" : "translateX(0)",
          opacity: (areControlsHidden || areLeftControlsHiding || isBgSelectorOpen) ? 0 : 1,
          pointerEvents: (areControlsHidden || areLeftControlsHiding || isBgSelectorOpen) ? "none" : "auto",
        }}
      >
        {/* Mini clock icon */}
        <div className="relative w-8 h-8">
          {isAnalog ? (
            // Analog clock icon
            <svg width="32" height="32" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke={textColor}
                strokeWidth="2"
              />
              <line x1="24" y1="24" x2="24" y2="12" stroke={textColor} strokeWidth="2" strokeLinecap="round" />
              <line x1="24" y1="24" x2="34" y2="24" stroke={textColor} strokeWidth="2" strokeLinecap="round" />
              <circle cx="24" cy="24" r="2" fill={textColor} />
            </svg>
          ) : (
            // Digital clock icon
            <div
              className="w-full h-full flex items-center justify-center border-2 rounded"
              style={{ borderColor: textColor }}
            >
              <span
                className="text-xs font-bold"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                12
              </span>
            </div>
          )}
        </div>
        <span
          className="text-sm font-medium"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          {isAnalog ? "ANALOG" : "DIGITAL"}
        </span>
      </button>

      {/* Gradient picker on the left - hidden when sidebar is open - hidden on mobile */}
      <div
        className="hidden md:block fixed left-8 top-1/2 transition-all duration-500"
        style={{
          opacity: (isBgSelectorOpen || areControlsHidden || areLeftControlsHiding) ? 0 : 1,
          pointerEvents: (isBgSelectorOpen || areControlsHidden || areLeftControlsHiding) ? "none" : "auto",
          transform: `translateY(-50%) ${(areControlsHidden || areLeftControlsHiding || isBgSelectorOpen) ? "translateX(-100px)" : ""}`,
        }}
      >
        <GradientPicker
          gradients={GRADIENTS}
          selectedGradient={selectedGradient}
          onGradientChange={handleGradientSelect}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Background image expand button - bottom left - hidden on mobile */}
      <button
        onClick={() => {
          if (!isBgSelectorOpen) {
            // Opening: first hide left controls, then open selector after delay
            setAreLeftControlsHiding(true);
            // When opening with analog clock not on right, move to right
            if (isAnalog && clockPosition !== 'right') {
              setClockPosition('right');
            }
            setTimeout(() => {
              setIsBgSelectorOpen(true);
              setAreLeftControlsHiding(false);
            }, 500);
          }
        }}
        className="hidden md:flex fixed bottom-8 left-8 items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-500 hover:scale-105 z-50"
        style={{
          borderColor: textColor,
          color: textColor,
          transform: (areControlsHidden || areLeftControlsHiding || isBgSelectorOpen) ? "translateX(-200px)" : "translateX(0)",
          opacity: (areControlsHidden || areLeftControlsHiding || isBgSelectorOpen) ? 0 : 1,
          pointerEvents: (areControlsHidden || areLeftControlsHiding || isBgSelectorOpen) ? "none" : "auto",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span
          className="text-sm font-medium"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          BACKGROUND
        </span>
      </button>

      {/* Color picker on the right - hidden on mobile */}
      <div
        className="hidden md:block fixed right-8 top-1/2 transition-all duration-500"
        style={{
          opacity: areControlsHidden ? 0 : 1,
          pointerEvents: areControlsHidden ? "none" : "auto",
          transform: `translateY(-50%) ${areControlsHidden ? "translateX(100px)" : ""}`,
        }}
      >
        <ColorPicker
          colors={colors}
          selectedColor={textColor}
          onColorChange={setTextColor}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Bottom right controls - PiP and Fullscreen - hidden on mobile */}
      <div className="hidden md:flex fixed bottom-8 right-8 gap-3">
        {/* Clock position toggle - only shown for analog clock */}
        {isAnalog && (
          <button
            onClick={() => {
              const positions: ('left' | 'center' | 'right')[] = ['left', 'center', 'right'];
              const currentIndex = positions.indexOf(clockPosition);
              const nextIndex = (currentIndex + 1) % positions.length;
              setClockPosition(positions[nextIndex]);
              // Close background selector when changing position
              if (isBgSelectorOpen) {
                setIsBgSelectorOpen(false);
              }
            }}
            className="p-3 rounded-xl border-2 transition-all duration-300 hover:scale-110"
            style={{
              borderColor: textColor,
              color: textColor,
            }}
            title={`Clock Position: ${clockPosition.toUpperCase()}`}
          >
            {clockPosition === 'left' ? (
              // Clock left icon
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8" cy="12" r="3" />
              </svg>
            ) : clockPosition === 'center' ? (
              // Clock center icon
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              // Clock right icon
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="16" cy="12" r="3" />
            </svg>
            )}
          </button>
        )}

        {/* Hide controls toggle */}
        <button
          onClick={() => setAreControlsHidden(!areControlsHidden)}
          className="p-3 rounded-xl border-2 transition-all duration-300 hover:scale-110"
          style={{
            borderColor: textColor,
            color: textColor,
            backgroundColor: areControlsHidden ? (isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)") : "transparent",
          }}
          title={areControlsHidden ? "Show Controls" : "Hide Controls"}
        >
          {areControlsHidden ? (
            // Show controls icon (eye open)
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            // Hide controls icon (eye with slash)
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          )}
        </button>

        {/* Picture-in-Picture toggle */}
        <button
          onClick={togglePiP}
          className="p-3 rounded-xl border-2 transition-all duration-300 hover:scale-110 flex items-center justify-center"
          style={{
            borderColor: textColor,
            color: textColor,
          }}
          title={isPiP ? "Exit Picture-in-Picture" : "Enter Picture-in-Picture"}
        >
          {isPiP ? (
            // Exit PiP icon
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
              <rect x="10" y="10" width="8" height="6" rx="1" fill="currentColor" />
              <line x1="15" y1="12" x2="17" y2="14" />
              <line x1="17" y1="12" x2="15" y2="14" />
            </svg>
          ) : (
            // Enter PiP icon
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
              <rect x="10" y="10" width="8" height="6" rx="1" />
            </svg>
          )}
        </button>

        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-3 rounded-xl border-2 transition-all duration-300 hover:scale-110"
          style={{
            borderColor: textColor,
            color: textColor,
          }}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            // Exit fullscreen icon
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3v3a2 2 0 0 1-2 2H3" />
              <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
              <path d="M3 16h3a2 2 0 0 1 2 2v3" />
              <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
            </svg>
          ) : (
            // Enter fullscreen icon
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3" />
              <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
              <path d="M3 16v3a2 2 0 0 0 2 2h3" />
              <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
