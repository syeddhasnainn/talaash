/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    AZURE_SUBSCRIPTION_KEY: process.env.AZURE_SUBSCRIPTION_KEY,
    TOGETHER_API_KEY: process.env.TOGETHER_API_KEY,
    NEON_DATABASE_URL: process.env.NEON_DATABASE_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
};

export default nextConfig;
