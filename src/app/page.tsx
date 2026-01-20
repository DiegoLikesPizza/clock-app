"use client";

import { useState, useEffect, useRef } from "react";
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

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAnalog, setIsAnalog] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [isBgSelectorOpen, setIsBgSelectorOpen] = useState(false);
  const [areControlsHidden, setAreControlsHidden] = useState(false);
  const [textColor, setTextColor] = useState("#ffffff");
  const [selectedGradient, setSelectedGradient] = useState<string | null>(null);
  const [selectedBgImage, setSelectedBgImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Prevent hydration mismatch by only rendering time after mount
  useEffect(() => {
    setMounted(true);
    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      {/* Overlay for background image - darkens/lightens the right side - hidden on mobile */}
      {selectedBgImage && !isMobile && (
        <div
          className="hidden md:block absolute inset-0 transition-all duration-500"
          style={{
            background: isDarkMode
              ? `linear-gradient(to right, transparent 0%, transparent ${(isBgSelectorOpen || isAnalog) ? "25%" : "0%"}, rgba(0,0,0,0.7) ${(isBgSelectorOpen || isAnalog) ? "50%" : "30%"}, rgba(0,0,0,0.85) 100%)`
              : `linear-gradient(to right, transparent 0%, transparent ${(isBgSelectorOpen || isAnalog) ? "25%" : "0%"}, rgba(255,255,255,0.7) ${(isBgSelectorOpen || isAnalog) ? "50%" : "30%"}, rgba(255,255,255,0.85) 100%)`,
          }}
        />
      )}

      {/* Clock container - shifts right when sidebar is open or analog clock with bg image (desktop only) */}
      <div
        className="pip-capture absolute inset-0 flex items-center justify-center transition-all duration-500"
        style={{
          transform: isMobile ? "translateX(0)" : ((isBgSelectorOpen || (isAnalog && selectedBgImage)) ? "translateX(350px)" : "translateX(0)"),
        }}
        suppressHydrationWarning
      >
        {mounted && (
          (isAnalog || isMobile) ? (
            <AnalogClock color={textColor} />
          ) : (
            <RollingClock textColor={textColor} />
          )
        )}
      </div>

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
          transform: areControlsHidden ? "translateX(-200px)" : "translateX(0)",
          opacity: areControlsHidden ? 0 : 1,
          pointerEvents: areControlsHidden ? "none" : "auto",
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
          opacity: (isBgSelectorOpen || areControlsHidden) ? 0 : 1,
          pointerEvents: (isBgSelectorOpen || areControlsHidden) ? "none" : "auto",
          transform: `translateY(-50%) ${areControlsHidden ? "translateX(-100px)" : ""}`,
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
        onClick={() => setIsBgSelectorOpen(!isBgSelectorOpen)}
        className="hidden md:flex fixed bottom-8 left-8 items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-500 hover:scale-105 z-50"
        style={{
          borderColor: textColor,
          color: textColor,
          backgroundColor: isBgSelectorOpen ? (isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)") : "transparent",
          transform: areControlsHidden ? "translateX(-200px)" : "translateX(0)",
          opacity: areControlsHidden ? 0 : 1,
          pointerEvents: areControlsHidden ? "none" : "auto",
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
          {isBgSelectorOpen ? "CLOSE" : "BACKGROUND"}
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
          className="p-3 rounded-xl border-2 transition-all duration-300 hover:scale-110"
          style={{
            borderColor: textColor,
            color: textColor,
          }}
          title={isPiP ? "Exit Picture-in-Picture" : "Enter Picture-in-Picture"}
        >
          {isPiP ? (
            // Exit PiP icon
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <rect x="10" y="9" width="8" height="6" rx="1" fill="currentColor" />
              <line x1="15" y1="11" x2="17" y2="13" />
              <line x1="17" y1="11" x2="15" y2="13" />
            </svg>
          ) : (
            // Enter PiP icon
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <rect x="10" y="9" width="8" height="6" rx="1" />
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
