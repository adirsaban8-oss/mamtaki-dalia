import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Standalone output → leanest production image. The Dockerfile copies
  // .next/standalone and runs `node server.js` directly.
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'http', hostname: 'mamtaki-dalia.local' },
      { protocol: 'https', hostname: 'mamtaki-dalia.local' },
    ],
    qualities: [75, 85, 90],
    formats: ['image/avif', 'image/webp'],
    // Allow Next/Image to fetch from the local WordPress dev instance
    // (Local by Flywheel maps mamtaki-dalia.local → 127.0.0.1).
    dangerouslyAllowLocalIP: true,
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
};

export default withNextIntl(nextConfig);
