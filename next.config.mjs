/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MAPBOX_API_KEY: process.env.MAPBOX_API_KEY, // pulls from .env file
    X_API_KEY: process.env.X_API_KEY,
  },
  output: "export", // <=== enables static exports
  reactStrictMode: true,
};

export default nextConfig;
