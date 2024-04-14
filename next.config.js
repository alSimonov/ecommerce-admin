/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // transpilePackages: ['BatChart.ts'],
}

const transpiledModules = require('next-transpile-modules')(["@mui/x-charts"]);

module.exports = transpiledModules;
// module.exports = nextConfig
