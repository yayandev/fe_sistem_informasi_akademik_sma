/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.pexels.com" },
      { hostname: "api.yayanfaturrohman.upg.ac.id" },
    ],
  },
};

export default nextConfig;
