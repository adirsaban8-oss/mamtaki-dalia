import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Standalone output → leanest production image. The Dockerfile copies
  // .next/standalone and runs `node server.js` directly.
  output: 'standalone',
  // Loaded at run time, not bundled: the Postgres client, and the embedded Postgres used for local work only.
  serverExternalPackages: ['pg', '@electric-sql/pglite'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'http', hostname: 'mamtaki-dalia.local' },
      { protocol: 'https', hostname: 'mamtaki-dalia.local' },
      // Production WordPress admin (Railway WordPress template)
      { protocol: 'https', hostname: 'primary-production-022cf.up.railway.app' },
    ],
    qualities: [75, 85, 90],
    // WebP only. AVIF encoding is heavy for the small server: on 2026-11-26 two AVIF
    // requests hung in the optimizer and those images stopped loading until a restart.
    formats: ['image/webp'],
    // Allow Next/Image to fetch from the local WordPress dev instance
    // (Local by Flywheel maps mamtaki-dalia.local → 127.0.0.1).
    dangerouslyAllowLocalIP: true,
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
};

export default withNextIntl(nextConfig);
