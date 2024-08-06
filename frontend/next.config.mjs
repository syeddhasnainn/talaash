/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    AZURE_SUBSCRIPTION_KEY: process.env.AZURE_SUBSCRIPTION_KEY,
    TOGETHER_API_KEY: process.env.TOGETHER_API_KEY,
    NEON_DATABASE_URL: process.env.NEON_DATABASE_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    R2_ACCOUNT_ID:process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID:process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY:process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME:process.env.R2_BUCKET_NAME
  },
};

export default nextConfig;
