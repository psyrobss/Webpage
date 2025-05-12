import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repositoryName = 'Webpage'; // Defina o nome do seu repositório aqui

const nextConfig: NextConfig = {
  // Definindo basePath e assetPrefix com base no nome do repositório
  // Isso garante que eles sempre usem o mesmo valor e facilita a mudança
  basePath: isProd ? `/${repositoryName}` : '',
  assetPrefix: isProd ? `/${repositoryName}/` : '',

  output: 'export',

  images: {
    unoptimized: true,
  },

  // Adicionar trailingSlash pode ajudar na consistência de caminhos
  trailingSlash: true,
};

export default nextConfig;