/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Generates static files
  trailingSlash: true, // Adds trailing slashes for S3 compatibility
};

module.exports = nextConfig;
