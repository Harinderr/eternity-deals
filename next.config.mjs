/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
