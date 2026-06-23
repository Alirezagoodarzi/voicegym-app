/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export for mobile builds
  ...(process.env.NEXT_PUBLIC_API_BASE_URL ? {
    output: 'export',
    images: { unoptimized: true },
  } : {}),
};

export default nextConfig;