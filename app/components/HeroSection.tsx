'use client';
import { motion } from 'framer-motion';
import { Typography, Box, Button } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { alpha, useTheme } from '@mui/material/styles';

// Cores específicas para o texto da Hero, para garantir contraste sobre vídeo/fundo dinâmico
const PALETTE_HERO_TEXT = {
  deepPurplePrimary: '#382f51', // Usado para texto no modo claro
  lightLavenderText: '#c8c2f5', // Usado para texto no modo escuro (mais brilhante que o text.primary padrão do tema escuro)
};

// Lê a variável de ambiente para o prefixo do caminho base
// Isso é configurado em next.config.js
const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface HeroSectionProps {
  id?: string;
}

export default function HeroSection({ id }: HeroSectionProps) {
  const theme = useTheme();

  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById('sobre');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      component="section"
      id={id}
      className="hero-section"
      sx={{
        position: 'relative',
        zIndex: 1, // Para sobrepor partículas globais se existirem
        height: '100vh',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'transparent', // Fundo transparente para ver partículas globais ou fundo do body
        color: theme.palette.text.primary, // Cor de texto base da seção (pode ser sobrescrita)
      }}
    >
      {/* Conteúdo Principal da Hero */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2, // Conteúdo acima do zIndex da própria seção (e das partículas globais)
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { md: '4rem', xs: '3rem' },
          width: '100%',
          maxWidth: '1200px',
          padding: { xs: '2rem', md: '4rem' },
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        {/* Bloco de Vídeo */}
        <Box
          sx={{
            width: { xs: '80%', sm: '60%', md: '50%' },
            maxWidth: '550px',
            aspectRatio: '16/9',
            overflow: 'hidden',
            borderRadius: theme.shape.borderRadius * 4, // 16px
            position: 'relative', // Para zIndex funcionar se necessário
            // zIndex: 1, // Não estritamente necessário aqui se o texto já tem zIndex maior
            boxShadow: theme.shadows[10],
            bgcolor: alpha(theme.palette.common.black, 0.5), // Fallback se vídeo não carregar
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 'inherit',
              opacity: 0.7, // Opacidade do vídeo
              display: 'block',
            }}
          >
            {/* Caminho do vídeo prefixado corretamente */}
            <source src={`${prefix}/videos/hero-video.mp4`} type="video/mp4" />
            Seu navegador não suporta vídeos.
          </video>
        </Box>

        {/* Bloco de Texto e CTA */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            display: 'flex',
            flexDirection: 'column',
            height: '100%', // Tenta ocupar a altura do container pai
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              sx={{
                color: theme.palette.mode === 'dark' ? PALETTE_HERO_TEXT.lightLavenderText : PALETTE_HERO_TEXT.deepPurplePrimary,
                textShadow: `0px 2px 15px ${alpha(theme.palette.common.black, 0.5)}`,
                fontWeight: 700,
                mb: 2,
              }}
            >
              Sonhar e fazer acontecer.
            </Typography>
            <Typography
              variant="h5"
              component="p"
              gutterBottom
              sx={{
                color: theme.palette.mode === 'dark' ? alpha(PALETTE_HERO_TEXT.lightLavenderText, 0.85) : alpha(PALETTE_HERO_TEXT.deepPurplePrimary, 0.85),
                textShadow: `0px 2px 10px ${alpha(theme.palette.common.black, 0.3)}`,
                maxWidth: '500px',
                lineHeight: 1.6,
                mb: 4,
                mx: { xs: 'auto', md: 0 }, // Centraliza texto no mobile
              }}
            >
              Conhecimento psicológico transforma<br/>objetivo em ação.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-start' },
                mt: 2, // Adiciona margem superior ao botão
              }}
            >
              <Button
                variant="pill"
                color="secondary" // Botão azul vibrante
                size="large"
                endIcon={<ArrowDownwardIcon />}
                onClick={handleScrollToAbout}
                sx={{
                  '&:hover': { transform: 'scale(1.05)' },
                  transition: 'transform 0.2s ease-out',
                  minWidth: '200px',
                }}
              >
                Explorar
              </Button>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}