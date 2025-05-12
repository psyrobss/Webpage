// theme/ThemeProvider.tsx
'use client';

import React, { useState, useMemo, createContext, useContext, ReactNode, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme, PaletteMode, alpha } from '@mui/material/styles';

// Constantes de cores com nomes descritivos
const PALETTE = {
  deepPurplePrimary: '#382f51',
  vibrantBlueSecondary: '#5c7ada',
  strongMagentaAccent: '#b4446c',
  coralAccentAlt: '#c0706c',
  lightPinkDetail: '#df9dc0',
  mediumPurpleSupport: '#63589d',
  mauveSupport: '#86547a',
  lightLavenderText: '#a5a5ef',      // Usado para texto secundário no modo escuro
  brighterLavenderText: '#c8c2f5', // Usado para texto primário no modo escuro
  darkPurplePaper: '#2a2444',      // Fundo 'paper' no modo escuro (ex: Cards)
  nearBlackBgDark: '#0e0b14',       // Fundo 'default' no modo escuro (ex: Body)
  greyishPurpleMuted: '#7f7899',   // Usado para texto 'disabled' ou divisores sutis

  // Cores para Modo Claro
  lightBg: '#f4f2f7',             // Fundo 'default' no modo claro
  lightPaper: '#ffffff',            // Fundo 'paper' no modo claro
  darkText: '#1c1827',              // Texto primário no modo claro
  mediumDarkText: '#4a4458',        // Texto secundário no modo claro
};

// Definição do Contexto de Tema
interface ThemeContextProps {
  toggleTheme: () => void;
  mode: PaletteMode;
}

const ThemeContext = createContext<ThemeContextProps>({
  toggleTheme: () => {},
  mode: 'dark', // Padrão para modo escuro
});

// Hook para usar o contexto
export const useThemeMode = () => useContext(ThemeContext);

// Provedor do Tema
interface CustomThemeProviderProps {
  children: ReactNode;
}

export default function CustomThemeProvider({ children }: CustomThemeProviderProps) {
  const [mode, setMode] = useState<PaletteMode>('dark');

  useEffect(() => {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(mode === 'dark' ? 'dark-mode' : 'light-mode');
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const themeContextValue = useMemo(
    () => ({
      toggleTheme: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(() => {
    const borderRadiusBase = 4;
    return createTheme({
      palette: {
        mode,
        primary: {
          main: PALETTE.deepPurplePrimary,
          light: PALETTE.mediumPurpleSupport,
          dark: alpha(PALETTE.deepPurplePrimary, 0.85),
          contrastText: PALETTE.brighterLavenderText,
        },
        secondary: {
          main: PALETTE.vibrantBlueSecondary,
          light: alpha(PALETTE.vibrantBlueSecondary, 0.8),
          dark: alpha(PALETTE.vibrantBlueSecondary, 0.7),
          contrastText: '#ffffff',
        },
        accent: {
          main: PALETTE.strongMagentaAccent,
          light: alpha(PALETTE.strongMagentaAccent, 0.8),
          dark: alpha(PALETTE.strongMagentaAccent, 0.7),
          contrastText: '#ffffff',
        },
        coral: {
          main: PALETTE.coralAccentAlt,
          light: alpha(PALETTE.coralAccentAlt, 0.8),
          dark: alpha(PALETTE.coralAccentAlt, 0.7),
          contrastText: '#ffffff',
        },
        background: {
          default: mode === 'light' ? PALETTE.lightBg : PALETTE.nearBlackBgDark,
          paper: mode === 'light' ? PALETTE.lightPaper : PALETTE.darkPurplePaper,
        },
        text: {
          primary: mode === 'light' ? PALETTE.darkText : PALETTE.brighterLavenderText,
          secondary: mode === 'light' ? PALETTE.mediumDarkText : PALETTE.lightLavenderText,
          disabled: mode === 'light' ? alpha(PALETTE.darkText, 0.38) : PALETTE.greyishPurpleMuted,
        },
        divider: mode === 'light' ? alpha(PALETTE.greyishPurpleMuted, 0.25) : alpha(PALETTE.greyishPurpleMuted, 0.15),
        action: {
            active: mode === 'light' ? PALETTE.deepPurplePrimary : PALETTE.brighterLavenderText,
            hover: mode === 'light' ? alpha(PALETTE.deepPurplePrimary, 0.06) : alpha(PALETTE.brighterLavenderText, 0.08),
            selected: mode === 'light' ? alpha(PALETTE.deepPurplePrimary, 0.12) : alpha(PALETTE.brighterLavenderText, 0.16),
            disabled: mode === 'light' ? alpha(PALETTE.darkText, 0.26) : alpha(PALETTE.greyishPurpleMuted, 0.7),
            disabledBackground: mode === 'light' ? alpha(PALETTE.darkText, 0.12) : alpha(PALETTE.greyishPurpleMuted, 0.3),
        }
      },
      typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700, fontSize: '2.5rem' },
        h2: { fontWeight: 700, fontSize: '2rem' },
        h3: { fontWeight: 600, fontSize: '1.5rem' },
        h4: { fontWeight: 600, fontSize: '1.25rem' },
        h5: { fontWeight: 600, fontSize: '1.1rem' },
        h6: { fontWeight: 600, fontSize: '1rem' },
      },
      shape: {
        borderRadius: borderRadiusBase,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: { borderRadius: borderRadiusBase * 5, textTransform: 'none', fontWeight: 600 },
            contained: { padding: '8px 22px' },
            outlined: { padding: '8px 22px' },
          },
          variants: [
            { props: { variant: 'pill' }, style: { borderRadius: '50px', padding: '10px 26px' } },
            {
              props: { variant: 'pill', color: 'accent' },
              style: ({ theme: t }) => ({ backgroundColor: t.palette.accent.main, color: t.palette.accent.contrastText, '&:hover': { backgroundColor: t.palette.accent.dark } }),
            },
            {
              props: { variant: 'pill', color: 'coral' },
              style: ({ theme: t }) => ({ backgroundColor: t.palette.coral.main, color: t.palette.coral.contrastText, '&:hover': { backgroundColor: t.palette.coral.dark } }),
            },
            {
                props: { variant: 'pill', color: 'primary' },
                style: ({ theme: t }) => ({ backgroundColor: t.palette.primary.main, color: t.palette.primary.contrastText, '&:hover': { backgroundColor: t.palette.primary.dark } }),
            },
            {
                props: { variant: 'pill', color: 'secondary' },
                style: ({ theme: t }) => ({ backgroundColor: t.palette.secondary.main, color: t.palette.secondary.contrastText, '&:hover': { backgroundColor: t.palette.secondary.dark } }),
            },
          ],
        },
        MuiCard: {
          styleOverrides: {
            root: ({ theme: t }) =>({
                 borderRadius: t.shape.borderRadius * 4,
                 boxShadow: t.palette.mode === 'light'
                    ? `0 4px 12px ${alpha(PALETTE.nearBlackBgDark, 0.08)}`
                    : `0 6px 18px ${alpha(PALETTE.nearBlackBgDark, 0.6)}`,
            }),
          },
        },
        MuiPaper: {
            styleOverrides: { root: { borderRadius: borderRadiusBase * 2 } }
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: borderRadiusBase * 2,
                '& fieldset': { borderColor: mode === 'dark' ? alpha(PALETTE.greyishPurpleMuted, 0.3) : undefined },
                '&:hover fieldset': { borderColor: mode === 'dark' ? PALETTE.lightLavenderText : undefined },
                '&.Mui-focused fieldset': { borderColor: mode === 'dark' ? PALETTE.vibrantBlueSecondary : undefined },
              },
              '& .MuiInputLabel-root': { color: mode === 'dark' ? PALETTE.lightLavenderText : undefined },
              '& .MuiInputLabel-root.Mui-focused': { color: mode === 'dark' ? PALETTE.vibrantBlueSecondary : undefined },
            },
          },
        },
        MuiAppBar: {
             styleOverrides: {
                colorInherit: {
                     backgroundColor: mode === 'light' ? alpha(PALETTE.lightPaper, 0.9) : alpha(PALETTE.darkPurplePaper, 0.75),
                     color: mode === 'light' ? PALETTE.darkText : PALETTE.brighterLavenderText,
                }
            }
        },
      },
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <MUIThemeProvider theme={theme}>
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}

// Module augmentation
declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
    coral: Palette['primary'];
  }
  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
    coral?: PaletteOptions['primary'];
  }
}
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    accent: true;
    coral: true;
  }
   interface ButtonPropsVariantOverrides {
    pill: true;
  }
}