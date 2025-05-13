// next.config.js
const IS_GITHUB_ACTIONS = process.env.GITHUB_ACTIONS === 'true';
const REPO_NAME = 'Webpage'; // O nome do seu repositório

let assetPrefix = '';
let basePath = '';

if (IS_GITHUB_ACTIONS) {
  // Se estiver rodando no GitHub Actions, configure para o subdiretório do repositório
  assetPrefix = `/${REPO_NAME}/`;
  basePath = `/${REPO_NAME}`;
}

const nextConfig = {
  output: 'export',
  assetPrefix: assetPrefix,
  basePath: basePath,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath, // Expor o basePath para o cliente
  },
  // Opcional: Se você tiver problemas com trailing slashes e links
  trailingSlash: true,
};

export default nextConfig;