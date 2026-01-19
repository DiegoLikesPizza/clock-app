import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // basePath nur in Production (für GitHub Pages unter /clock-app/)
  basePath: isProd ? '/clock-app' : '',

  // Erzwingt den statischen Export (erzeugt den 'out' Ordner)
  output: 'export',

  // Verhindert Pfad-Probleme bei statischen Dateien
  trailingSlash: true,

  // Bilder nicht optimieren (da statischer Export)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;