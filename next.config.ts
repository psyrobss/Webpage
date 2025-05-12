import type { NextConfig } from "next";

// Verifica se o ambiente é de produção (usado pelo GitHub Pages build)
const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  basePath: isProd ? '/Webpage' : '',

  assetPrefix: isProd ? '/Webpage/' : '',

  output: 'export',

  images: {
    unoptimized: true,
  },

};

export default nextConfig;