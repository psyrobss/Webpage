// Em um arquivo utils/assetPath.ts (ou similar)
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const BASE_PATH = IS_PRODUCTION ? '/Webpage' : ''; // Seu basePath de produção

export const asset = (path: string) => {
  // Remove a barra inicial do path se ela existir, pois BASE_PATH já pode ter
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${BASE_PATH}/${cleanPath}`;
};