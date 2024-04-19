/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@mui/x-charts"],
};

// const transpiledModules = require('next-transpile-modules')(["@mui/x-charts"]);

module.exports = nextConfig;
