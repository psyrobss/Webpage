// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', 
  basePath: process.env.NODE_ENV === 'production' ? '/Webpage' : '',
  // Opcional: Se você usa imagens do Next/Image e quer desabilitar otimização para export estático
  images: {
    unoptimized: true,
  },
  // Garante que assets sejam referenciados corretamente com basePath
  assetPrefix: process.env.NODE_ENV === 'production' ? '/WebpageI' : '',
};

export default nextConfig;