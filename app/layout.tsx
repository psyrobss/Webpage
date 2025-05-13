

import type { Metadata } from 'next';
import { CssBaseline } from '@mui/material';
import CustomThemeProvider from '@/app/theme/ThemeProvider';
import './styles/globals.css';

export const metadata: Metadata = {
  title: 'Rob Savoldi',
  description: 'Psicologia Cognitiva, Psicometria e Psicologia Geral',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <CustomThemeProvider>
          <CssBaseline />
          {children}
        </CustomThemeProvider>
      </body>
    </html>
  );
}