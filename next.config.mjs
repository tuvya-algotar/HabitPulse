/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export' removed — app runs as a standard Next.js dev server
  // so Electron can load it via http://localhost:3000
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
