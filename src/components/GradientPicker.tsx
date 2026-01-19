"use client";

interface GradientOption {
  id: string;
  gradient: string;
  colors: string[]; // For the preview cubes
}

interface GradientPickerProps {
  gradients: GradientOption[];
  selectedGradient: string | null;
  onGradientChange: (gradient: string | null) => void;
  isDarkMode?: boolean;
}

export default function GradientPicker({ 
  gradients, 
  selectedGradient, 
  onGradientChange, 
  isDarkMode = true 
}: GradientPickerProps) {
  const borderColor = isDarkMode ? "#ffffff" : "#000000";
  
  return (
    <div className="flex flex-col gap-6">
      {/* No gradient option */}
      <GradientCube
        colors={[isDarkMode ? "#000000" : "#ffffff"]}
        isSelected={selectedGradient === null}
        onClick={() => onGradientChange(null)}
        borderColor={borderColor}
      />
      
      {gradients.map((g) => (
        <GradientCube
          key={g.id}
          colors={g.colors}
          isSelected={g.gradient === selectedGradient}
          onClick={() => onGradientChange(g.gradient)}
          borderColor={borderColor}
        />
      ))}
    </div>
  );
}

interface GradientCubeProps {
  colors: string[];
  isSelected: boolean;
  onClick: () => void;
  borderColor: string;
}

function GradientCube({ colors, isSelected, onClick, borderColor }: GradientCubeProps) {
  const bgStyle = colors.length === 1 
    ? { backgroundColor: colors[0] }
    : { background: `linear-gradient(135deg, ${colors.join(", ")})` };

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

        {/* Front face (gradient) */}
        <div
          className="absolute border-2"
          style={{
            width: "50px",
            height: "50px",
            left: "0",
            top: "0",
            ...bgStyle,
            borderColor: borderColor,
            boxShadow: isSelected ? `0 0 20px rgba(255,255,255,0.3)` : "none",
          }}
        />
      </div>
    </button>
  );
}

