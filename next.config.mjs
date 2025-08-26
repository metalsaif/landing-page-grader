/** @type {import('next').NextConfig} */
const nextConfig = {
  // This function will add the specified security headers to all routes
  async headers() {
    return [
      {
        source: '/:path*', // Apply these headers to all routes
        headers: [
          // Tells browsers to always connect via HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Prevents the site from being embedded in iframes (clickjacking protection)
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // Prevents browsers from guessing file types, which can be a security risk
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // A basic Content Security Policy (CSP) to prevent cross-site scripting
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src * data:; font-src 'self'; connect-src *;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;