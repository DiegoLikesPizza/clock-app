"use client";

import { useState, useEffect } from "react";
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
  const [isBgSelectorOpen, setIsBgSelectorOpen] = useState(false);
  const [textColor, setTextColor] = useState("#ffffff");
  const [selectedGradient, setSelectedGradient] = useState<string | null>(null);
  const [selectedBgImage, setSelectedBgImage] = useState<string | null>(null);

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
      {/* Overlay for background image - darkens/lightens the right side */}
      {selectedBgImage && (
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: isDarkMode
              ? `linear-gradient(to right, transparent 0%, transparent ${isBgSelectorOpen ? "30%" : "0%"}, rgba(0,0,0,0.7) ${isBgSelectorOpen ? "60%" : "30%"}, rgba(0,0,0,0.85) 100%)`
              : `linear-gradient(to right, transparent 0%, transparent ${isBgSelectorOpen ? "30%" : "0%"}, rgba(255,255,255,0.7) ${isBgSelectorOpen ? "60%" : "30%"}, rgba(255,255,255,0.85) 100%)`,
          }}
        />
      )}

      {/* Clock container - shifts right when sidebar is open */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-500"
        style={{
          transform: isBgSelectorOpen ? "translateX(200px)" : "translateX(0)",
        }}
      >
        {isAnalog ? (
          <AnalogClock color={textColor} />
        ) : (
          <RollingClock textColor={textColor} />
        )}
      </div>

      {/* Background Selector Sidebar */}
      <BackgroundSelector
        isOpen={isBgSelectorOpen}
        onClose={() => setIsBgSelectorOpen(false)}
        selectedImage={selectedBgImage}
        onImageSelect={handleImageSelect}
        textColor={textColor}
        isDarkMode={isDarkMode}
      />

      {/* Dark/Light mode toggle - top right */}
      <button
        onClick={handleModeToggle}
        className="fixed top-8 right-8 flex items-center gap-3 px-4 py-2 rounded-full border-2 transition-all duration-300 hover:scale-105"
        style={{
          borderColor: textColor,
          color: textColor,
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

      {/* Analog/Digital toggle - top left */}
      <button
        onClick={() => setIsAnalog(!isAnalog)}
        className="fixed top-8 left-8 flex items-center gap-3 px-4 py-2 rounded-full border-2 transition-all duration-300 hover:scale-105"
        style={{
          borderColor: textColor,
          color: textColor,
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

      {/* Gradient picker on the left - hidden when sidebar is open */}
      <div
        className="fixed left-8 top-1/2 -translate-y-1/2 transition-all duration-500"
        style={{
          opacity: isBgSelectorOpen ? 0 : 1,
          pointerEvents: isBgSelectorOpen ? "none" : "auto",
        }}
      >
        <GradientPicker
          gradients={GRADIENTS}
          selectedGradient={selectedGradient}
          onGradientChange={handleGradientSelect}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Background image expand button - bottom left */}
      <button
        onClick={() => setIsBgSelectorOpen(!isBgSelectorOpen)}
        className="fixed bottom-8 left-8 flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 z-50"
        style={{
          borderColor: textColor,
          color: textColor,
          backgroundColor: isBgSelectorOpen ? (isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)") : "transparent",
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

      {/* Color picker on the right */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2">
        <ColorPicker
          colors={colors}
          selectedColor={textColor}
          onColorChange={setTextColor}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Fullscreen toggle - bottom right */}
      <button
        onClick={toggleFullscreen}
        className="fixed bottom-8 right-8 p-3 rounded-xl border-2 transition-all duration-300 hover:scale-110"
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
  );
}
