/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is the correct configuration for this problem.
  // It tells Next.js to explicitly include the file that its automatic
  // file tracer is missing.
  outputFileTracingIncludes: {
    '/api/refactor': ['./node_modules/prettier-plugin-tailwindcss/dist/css/preflight.css'],
  },
};

export default nextConfig;