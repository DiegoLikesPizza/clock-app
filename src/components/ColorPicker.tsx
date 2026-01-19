"use client";

interface ColorPickerProps {
  colors: string[];
  selectedColor: string;
  onColorChange: (color: string) => void;
  isDarkMode?: boolean;
}

export default function ColorPicker({ colors, selectedColor, onColorChange, isDarkMode = true }: ColorPickerProps) {
  const borderColor = isDarkMode ? "#ffffff" : "#000000";

  return (
    <div className="flex flex-col gap-6">
      {colors.map((color) => (
        <ColorCube
          key={color}
          color={color}
          isSelected={color === selectedColor}
          onClick={() => onColorChange(color)}
          borderColor={borderColor}
        />
      ))}
    </div>
  );
}

interface ColorCubeProps {
  color: string;
  isSelected: boolean;
  onClick: () => void;
  borderColor: string;
}

function ColorCube({ color, isSelected, onClick, borderColor }: ColorCubeProps) {
  return (
    <button
      onClick={onClick}
      className="relative group cursor-pointer transition-transform hover:scale-110"
      style={{ width: "70px", height: "80px" }}
    >
      {/* 3D Cube container */}
      <div className="relative w-full h-full">
        {/* Back face (bottom-right offset) */}
        <div
          className="absolute border-2"
          style={{
            width: "50px",
            height: "50px",
            right: "0",
            bottom: "0",
            backgroundColor: "transparent",
            borderColor: borderColor,
          }}
        />

        {/* Connecting lines (edges) */}
        {/* Top-right edge */}
        <div
          className="absolute"
          style={{
            width: "2px",
            height: "20px",
            right: "0",
            top: "8px",
            transform: "rotate(-35deg)",
            transformOrigin: "bottom",
            backgroundColor: borderColor,
          }}
        />
        {/* Top-left to back */}
        <div
          className="absolute"
          style={{
            width: "18px",
            height: "2px",
            right: "48px",
            bottom: "50px",
            transform: "rotate(-35deg)",
            transformOrigin: "right",
            backgroundColor: borderColor,
          }}
        />
        {/* Bottom-left edge */}
        <div
          className="absolute"
          style={{
            width: "2px",
            height: "20px",
            left: "0",
            bottom: "28px",
            transform: "rotate(-35deg)",
            transformOrigin: "top",
            backgroundColor: borderColor,
          }}
        />

        {/* Front face (main color) */}
        <div
          className="absolute border-2"
          style={{
            width: "50px",
            height: "50px",
            left: "0",
            top: "0",
            backgroundColor: color,
            borderColor: borderColor,
            boxShadow: isSelected ? `0 0 20px ${color}` : "none",
          }}
        />
      </div>
    </button>
  );
}

