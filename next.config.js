/** @type {import('next').NextConfig} */
const nextConfig = {
  // Нативный модуль better-sqlite3 нельзя бандлить — выносим как external
  // В Next.js 14.x это поле находится под experimental.
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3'],
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
}

module.exports = nextConfig
