/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        AZURE_SUBSCRIPTION_KEY: process.env.AZURE_SUBSCRIPTION_KEY,
        TOGETHER_API_KEY: process.env.TOGETHER_API_KEY
    }
};

export default nextConfig;
