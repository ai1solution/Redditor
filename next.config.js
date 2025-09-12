/** @type {import('next').NextConfig} */
const isProjectPages = !!process.env.BASE_PATH; // e.g., '/your-repo-name'

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // If deploying to GitHub Project Pages, set BASE_PATH to '/repo-name'
  ...(isProjectPages
    ? {
        basePath: process.env.BASE_PATH,
        assetPrefix: process.env.BASE_PATH,
      }
    : {}),
};

module.exports = nextConfig;
