/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "upload.wikimedia.org",
      "scontent.ftun1-2.fna.fbcdn.net",
    ],
  },
};

module.exports = nextConfig;
