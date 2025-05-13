// next.config.ts
const prefix = process.env.NODE_ENV === 'production' ? '/Webpage' : '';

const nextConfig = {
  output: 'export',
  assetPrefix: prefix,
  basePath: prefix,
  images: { unoptimized: true },
  
  // 👇 Esta linha expõe o prefixo no navegador
  env: {
    NEXT_PUBLIC_BASE_PATH: prefix,
  },
};

export default nextConfig;
