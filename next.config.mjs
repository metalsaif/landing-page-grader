/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This tells the Vercel bundler to include the entire contents of these packages,
    // preventing files like 'preflight.css' from being removed.
    serverExternalPackages: ["prettier", "prettier-plugin-tailwindcss"],
  },
};

export default nextConfig;