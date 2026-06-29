/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage public buckets
      { protocol: 'https', hostname: '*.supabase.co' },
      // Allow Unsplash for placeholder/listing imagery during development
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
