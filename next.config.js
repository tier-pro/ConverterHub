/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { optimizePackageImports: ['lucide-react', 'date-fns'] },
  transpilePackages: [],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false, crypto: false, os: false };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' esm.sh cdn.jsdelivr.net static.img.ly *.img.ly; style-src 'self' 'unsafe-inline' fonts.googleapis.com; img-src 'self' data: blob:; font-src 'self' data: fonts.gstatic.com; connect-src 'self' api.frankfurter.dev esm.sh cdn.jsdelivr.net static.img.ly *.img.ly blob:; worker-src 'self' blob: esm.sh; media-src 'self'; frame-src 'none'; object-src 'none'" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
