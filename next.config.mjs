/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is a global instruction to the Next.js bundler to include
  // all files within the prettier-plugin-tailwindcss directory,
  // regardless of whether they are explicitly imported.
  unstable_includeFiles: [
    './node_modules/prettier-plugin-tailwindcss/**/*',
  ],
};

export default nextConfig;