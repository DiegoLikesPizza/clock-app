"use client";

import { useState } from "react";

interface BackgroundImage {
  id: string;
  url: string;
  thumbnail: string;
  author: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  images: BackgroundImage[];
}

const CATEGORIES: Category[] = [
  {
    id: "landscapes",
    name: "Landschaften",
    icon: "🏔️",
    images: [
      { id: "l1", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920", thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200", author: "Samuel Ferrara" },
      { id: "l2", url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920", thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200", author: "Lukasz Szmigiel" },
      { id: "l3", url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920", thumbnail: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=200", author: "Mark Harpur" },
      { id: "l4", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920", thumbnail: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200", author: "Pietro De Grandi" },
      { id: "l5", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920", thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200", author: "Kalen Emsley" },
      { id: "l6", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920", thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", author: "Joseph Barrientos" },
      { id: "l7", url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920", thumbnail: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=200", author: "Robert Lukeman" },
      { id: "l8", url: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=1920", thumbnail: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=200", author: "Adam Kool" },
    ],
  },
  {
    id: "cars",
    name: "Autos",
    icon: "🚗",
    images: [
      { id: "c1", url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920", thumbnail: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=200", author: "Adrian Newell" },
      { id: "c2", url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920", thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200", author: "Campbell" },
      { id: "c3", url: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=1920", thumbnail: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=200", author: "Joey Banks" },
      { id: "c4", url: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1920", thumbnail: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=200", author: "Erik Mclean" },
      { id: "c5", url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1920", thumbnail: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200", author: "Dhiva Krishna" },
      { id: "c6", url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1920", thumbnail: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200", author: "Matt Antonioli" },
      { id: "c7", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920", thumbnail: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200", author: "Erik Mclean" },
      { id: "c8", url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920", thumbnail: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=200", author: "Vlad D" },
    ],
  },
  {
    id: "cities",
    name: "Städte",
    icon: "🌆",
    images: [
      { id: "ci1", url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920", thumbnail: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=200", author: "Pedro Lastra" },
      { id: "ci2", url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920", thumbnail: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=200", author: "Rob Bye" },
      { id: "ci3", url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920", thumbnail: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=200", author: "Jezael Melgoza" },
      { id: "ci4", url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1920", thumbnail: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=200", author: "Roberto Nickson" },
      { id: "ci5", url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920", thumbnail: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=200", author: "Pedro Lastra" },
      { id: "ci6", url: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1920", thumbnail: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=200", author: "Anthony DELANOIX" },
      { id: "ci7", url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920", thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200", author: "Marcin Nowak" },
      { id: "ci8", url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920", thumbnail: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200", author: "Jezael Melgoza" },
    ],
  },
  {
    id: "space",
    name: "Weltraum",
    icon: "🌌",
    images: [
      { id: "s1", url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920", thumbnail: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200", author: "NASA" },
      { id: "s2", url: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920", thumbnail: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=200", author: "Vincentiu Solomon" },
      { id: "s3", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920", thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200", author: "NASA" },
      { id: "s4", url: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920", thumbnail: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=200", author: "NASA" },
      { id: "s5", url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920", thumbnail: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=200", author: "NASA" },
      { id: "s6", url: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=1920", thumbnail: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=200", author: "NASA" },
      { id: "s7", url: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=1920", thumbnail: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=200", author: "NASA" },
      { id: "s8", url: "https://images.unsplash.com/photo-1484589065579-248aad0d628b?w=1920", thumbnail: "https://images.unsplash.com/photo-1484589065579-248aad0d628b?w=200", author: "Jeremy Thomas" },
    ],
  },
  {
    id: "nature",
    name: "Natur",
    icon: "🌿",
    images: [
      { id: "n1", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920", thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200", author: "Luca Bravo" },
      { id: "n2", url: "https://images.unsplash.com/photo-1518173946687-a4c036bc6c9d?w=1920", thumbnail: "https://images.unsplash.com/photo-1518173946687-a4c036bc6c9d?w=200", author: "Faye Cornish" },
      { id: "n3", url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1920", thumbnail: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=200", author: "niko photos" },
      { id: "n4", url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1920", thumbnail: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=200", author: "Sergei Akulich" },
      { id: "n5", url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920", thumbnail: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=200", author: "Todd Quackenbush" },
      { id: "n6", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920", thumbnail: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=200", author: "Sebastian Unrau" },
      { id: "n7", url: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=1920", thumbnail: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=200", author: "Robert Lukeman" },
      { id: "n8", url: "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=1920", thumbnail: "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=200", author: "Sergei Akulich" },
    ],
  },
  {
    id: "ocean",
    name: "Ozean",
    icon: "🌊",
    images: [
      { id: "o1", url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920", thumbnail: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=200", author: "Silas Baisch" },
      { id: "o2", url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920", thumbnail: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200", author: "Matt Hardy" },
      { id: "o3", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920", thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200", author: "Sean O." },
      { id: "o4", url: "https://images.unsplash.com/photo-1476673160081-cf065f30e60f?w=1920", thumbnail: "https://images.unsplash.com/photo-1476673160081-cf065f30e60f?w=200", author: "frank mckenna" },
      { id: "o5", url: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=1920", thumbnail: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=200", author: "Jeremy Bishop" },
      { id: "o6", url: "https://images.unsplash.com/photo-1468581264429-2548ef9eb732?w=1920", thumbnail: "https://images.unsplash.com/photo-1468581264429-2548ef9eb732?w=200", author: "Jeremy Bishop" },
      { id: "o7", url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1920", thumbnail: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=200", author: "Elizeu Dias" },
      { id: "o8", url: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=1920", thumbnail: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=200", author: "Clem Onojeghuo" },
    ],
  },
];

interface BackgroundSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedImage: string | null;
  onImageSelect: (url: string | null) => void;
  textColor: string;
  isDarkMode: boolean;
}

export default function BackgroundSelector({
  isOpen,
  onClose,
  selectedImage,
  onImageSelect,
  textColor,
  isDarkMode,
}: BackgroundSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>("landscapes");

  const bgColor = isDarkMode ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)";
  const hoverBg = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  const currentCategory = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div
      className="fixed left-0 top-0 h-full transition-all duration-500 ease-in-out z-50"
      style={{
        width: isOpen ? "400px" : "0px",
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
      <div
        className="h-full flex flex-col backdrop-blur-xl"
        style={{
          backgroundColor: bgColor,
          borderRight: `1px solid ${textColor}20`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-center p-6 border-b"
          style={{ borderColor: `${textColor}20` }}
        >
          <h2
            className="text-xl font-medium"
            style={{
              color: textColor,
              fontFamily: "var(--font-jetbrains-mono), monospace",
            }}
          >
            Hintergrund
          </h2>
        </div>

        {/* Clear selection button */}
        {selectedImage && (
          <button
            onClick={() => onImageSelect(null)}
            className="mx-6 mt-4 px-4 py-2 rounded-lg border transition-all hover:scale-[1.02]"
            style={{
              borderColor: textColor,
              color: textColor,
              fontFamily: "var(--font-jetbrains-mono), monospace",
            }}
          >
            ✕ Hintergrund entfernen
          </button>
        )}

        {/* Category tabs - vertical layout */}
        <div
          className="grid grid-cols-2 gap-2 p-4 border-b"
          style={{ borderColor: `${textColor}20` }}
        >
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
              style={{
                backgroundColor: activeCategory === category.id ? hoverBg : "transparent",
                color: textColor,
                border: activeCategory === category.id ? `1px solid ${textColor}40` : "1px solid transparent",
                fontFamily: "var(--font-jetbrains-mono), monospace",
              }}
            >
              <span>{category.icon}</span>
              <span className="text-sm">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Image grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {currentCategory?.images.map((image) => (
              <button
                key={image.id}
                onClick={() => onImageSelect(image.url)}
                className="relative aspect-video rounded-lg overflow-hidden transition-all hover:scale-105 group"
                style={{
                  boxShadow: selectedImage === image.url ? `0 0 0 3px ${textColor}` : "none",
                }}
              >
                <img
                  src={image.thumbnail}
                  alt={`Photo by ${image.author}`}
                  className="w-full h-full object-cover"
                />
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2"
                >
                  <span className="text-white text-xs truncate">
                    📷 {image.author}
                  </span>
                </div>
                {/* Selected indicator */}
                {selectedImage === image.url && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-4 border-t"
          style={{
            borderColor: `${textColor}20`,
            fontFamily: "var(--font-jetbrains-mono), monospace",
          }}
        >
          {/* Custom URL input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Bild-URL einfügen..."
              id="custom-bg-url"
              className="flex-1 px-3 py-2 rounded-lg border text-sm bg-transparent outline-none"
              style={{
                borderColor: `${textColor}40`,
                color: textColor,
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const input = e.target as HTMLInputElement;
                  if (input.value.trim()) {
                    onImageSelect(input.value.trim());
                    input.value = "";
                  }
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.getElementById("custom-bg-url") as HTMLInputElement;
                if (input && input.value.trim()) {
                  onImageSelect(input.value.trim());
                  input.value = "";
                }
              }}
              className="p-2 rounded-lg border transition-all hover:scale-105"
              style={{
                borderColor: `${textColor}40`,
                color: textColor,
              }}
              title="URL bestätigen"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg border-2 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            style={{
              borderColor: textColor,
              color: textColor,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            <span>Schließen</span>
          </button>

          {/* Credit */}
          <div className="mt-3 text-center" style={{ color: `${textColor}60` }}>
            <span className="text-xs">Bilder von Unsplash</span>
          </div>
        </div>
      </div>
    </div>
  );
}

