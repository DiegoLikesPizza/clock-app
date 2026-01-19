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

  const bgColor = isDarkMode ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.95)";
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
        className="h-full flex flex-col"
        style={{
          backgroundColor: bgColor,
          borderRight: `1px solid ${textColor}20`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
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
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:scale-110"
            style={{ color: textColor }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
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
          className="p-4 border-t text-center"
          style={{
            borderColor: `${textColor}20`,
            color: `${textColor}60`,
            fontFamily: "var(--font-jetbrains-mono), monospace",
          }}
        >
          <span className="text-xs">Bilder von Unsplash</span>
        </div>
      </div>
    </div>
  );
}

