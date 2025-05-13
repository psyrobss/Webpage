'use client';
import React from 'react';
import { Box, Typography, Button, Container, Paper, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Header from '@/app/components/Header'; 
import Footer from '@/app/components/Footer'; 
import ParticlesComponent from '@/app/components/Particles'; //  partículas no fundo

interface HighlightPageTemplateProps {
  title: string;
  bannerImage: string;
  children: React.ReactNode; // Conteúdo específico da página
}

// Variantes de animação para a página
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
};

export default function HighlightPageTemplate({ title, bannerImage, children }: HighlightPageTemplateProps) {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
    <ParticlesComponent id={`particles-highlight-${title.replace(/\s+/g, '-').toLowerCase()}`} style={{ zIndex: -1 }} />
      <Header />

      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ flexGrow: 1, position: 'relative' /* Para zIndex das partículas funcionar */ }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          {/* Banner da Imagem */}
          <Box
            sx={{
              height: { xs: '250px', sm: '350px', md: '450px' },
              mb: { xs: 4, md: 6 },
              borderRadius: theme.shape.borderRadius * 2,
              overflow: 'hidden',
              position: 'relative',
              boxShadow: theme.shadows[6],
            }}
          >
            <motion.img
              src={bannerImage}
              alt={`Banner para ${title}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
              }}
              initial={{ scale: 1.1, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            {/* Overlay sutil sobre o banner */}
            <Box
              sx={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                background: `linear-gradient(to bottom, ${alpha(theme.palette.common.black, 0.1)} 0%, ${alpha(theme.palette.common.black, 0.5)} 100%)`,
              }}
            />
            {/* Título sobre o Banner */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                p: { xs: 2, md: 4 },
                color: 'common.white',
                zIndex: 1,
              }}
            >
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  textShadow: `1px 1px 8px ${alpha(theme.palette.common.black, 0.7)}`,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                }}
              >
                {title}
              </Typography>
            </Box>
          </Box>

          {/* Conteúdo da Página */}
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2.5, sm: 3, md: 4 },
              bgcolor: 'background.paper',
              borderRadius: theme.shape.borderRadius * 2,
            }}
          >
            {children} {/* Conteúdo específico de cada destaque */}
          </Paper>

          {/* Botão Voltar */}
          <Box sx={{ textAlign: 'center', mt: { xs: 4, md: 6 } }}>
            <Button
              variant="outlined"
              color="secondary"
              component={Link}
              href="/"
              startIcon={<ArrowBackIcon />}
              sx={{
                // Estilos do botão já definidos no tema, mas pode adicionar mais
              }}
            >
              Voltar para Home
            </Button>
          </Box>
        </Container>
      </motion.main>

      <Footer />
    </Box>
  );
}