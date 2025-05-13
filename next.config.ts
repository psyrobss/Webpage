// my-portfolio/next.config.ts
import type { NextConfig } from 'next';

const REPO_NAME = 'Webpage'; 

let assetPrefix = process.env.NEXT_PUBLIC_BASE_PATH || ''; // Use a env var como fallback
let basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  output: 'export', // ESSENCIAL para GitHub Pages

  assetPrefix: assetPrefix,
  basePath: basePath,

  images: {
    unoptimized: true, 
    
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath, // O action deve definir isto via env vars.
  },
  trailingSlash: true, // Geralmente útil para static export em subdiretórios
};

export default nextConfig;