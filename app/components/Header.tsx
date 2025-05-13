'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  AppBar, Toolbar, IconButton, Drawer, List, ListItemButton, ListItemText,
  Box, useMediaQuery, useTheme, Typography, Tooltip, alpha
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeMode } from '@/app/theme/ThemeProvider';


export default function Header() {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: 'Projetos', path: '#projetos' },
    { name: 'Destaques', path: '#destaques' },
    { name: 'Sobre Mim', path: '#sobre' },
    { name: 'Contato', path: '#contato'},
    { name: 'Loja', path: './conceitos'},
    { name: 'TestBank', path: './testbank'},
    { name: 'Games', path: './games'},
    { name: 'DicionarioPsi', path: '/dicionario'},
    { name: 'NEC', path: '/nec' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinkSx = {
    cursor: 'pointer',
    position: 'relative',
    textDecoration: 'none',
    color: 'inherit', 
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '0%',
      height: '2px',
      bottom: '-4px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: theme.palette.accent.main, // Sublinhado magenta
      transition: 'width 0.3s ease-in-out',
    },
    '&:hover::after, &:focus-visible::after': {
      width: '100%',
    },
    '&:focus': { outline: 'none' },
    transition: 'color 0.2s ease',
    '&:hover': {
        color: theme.palette.secondary.main, // Hover para azul vibrante
    }
  };

  const drawer = (
    <Box
        sx={{ width: 250, height: '100%', bgcolor: 'background.paper' }}
        role="presentation"
        onClick={handleDrawerToggle}
        onKeyDown={handleDrawerToggle}
    >
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.name}
            component={Link}
            href={item.path}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.secondary.main,
              },
               color: 'text.primary', // Texto do drawer
               my: 0.5,
            }}
          >
            <ListItemText primary={item.name} primaryTypographyProps={{ fontWeight: 500 }}/>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      // color="inherit" é o padrão se não especificado e permite que MuiAppBar use os overrides.
      sx={{
        backdropFilter: 'blur(8px)',
        // Cor de fundo e texto vêm do override MuiAppBar no ThemeProvider
        boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.3 : 0.1)}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Link href="/" passHref style={{ textDecoration: 'none' }}>
          <Typography variant="h6" sx={{
            fontWeight: 700,
            color: theme.palette.mode === 'light' ? 'primary.main' : 'text.primary',
            cursor: 'pointer',
            '&:hover': { opacity: 0.85 },
            transition: 'opacity 0.2s ease'
          }}>
            Meu Portfólio
          </Typography>
        </Link>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1 } }}>
            <Tooltip title={mode === 'dark' ? "Modo Claro" : "Modo Escuro"}>
                <IconButton sx={{ color: 'inherit' }} onClick={toggleTheme}>
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Tooltip>

            {isMobile ? (
            <IconButton sx={{ color: 'inherit' }} edge="end" onClick={handleDrawerToggle} aria-label="Menu">
                <MenuIcon />
            </IconButton>
            ) : (
            <Box sx={{ display: 'flex', gap: '1.8rem' }}>
                {menuItems.map((item) => (
                <Link key={item.name} href={item.path} passHref style={{ textDecoration: 'none' }}>
                    <Typography variant="body1" sx={navLinkSx}>
                    {item.name}
                    </Typography>
                </Link>
                ))}
            </Box>
            )}
        </Box>
      </Toolbar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
          }
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}