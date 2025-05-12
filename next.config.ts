// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Essencial para GitHub Pages
  // Define o basePath para o nome do seu repositório
  basePath: process.env.NODE_ENV === 'production' ? '/Webpage' : '',
  // Define o assetPrefix para o nome do seu repositório
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Webpage' : '',
  // Desabilita a otimização de imagem padrão do Next.js para exportação estática
  images: {
    unoptimized: true,
  },
  reactStrictMode: true, // Ou false se estiver causando muitos re-renders em dev com R3F
};

export default nextConfig;