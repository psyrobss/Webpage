// next.config.ts
const prefix = process.env.NODE_ENV === 'production' ? '/Webpage' : '';

const nextConfig = {
  output: 'export',
  assetPrefix: prefix,
  basePath: prefix,
  images: { unoptimized: true },
  trailingSlash: true,
  
  env: {
    NEXT_PUBLIC_BASE_PATH: prefix,
  },
};

export default nextConfig;
