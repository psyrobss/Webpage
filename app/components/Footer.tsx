'use client';
import Link from 'next/link';
import { Typography, Box, Container, Grid, IconButton, alpha, useTheme } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';


const Footer = () => {
  const theme = useTheme();
  const linkedInUrl = "https://www.linkedin.com/in/robsavoldi"; 
  const githubUrl = "https://github.com/psyrobss"; 
  const currentYear = new Date().getFullYear();

  const footerLinkSx = {
    display: 'inline-block',
    position: 'relative',
    textDecoration: 'none',
    color: theme.palette.text.primary, 
    transition: 'color 0.3s ease',
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '0%',
      height: '1px',
      bottom: '-3px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: theme.palette.accent.main, // Sublinhado magenta
      transition: 'width 0.3s ease-in-out',
    },
    '&:hover, &:focus-visible': {
        color: theme.palette.accent.main, // Magenta no hover
        '&::after': {
             width: '100%',
        }
    },
    '&:focus': { outline: 'none' },
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: alpha(theme.palette.primary.main, 0.8), 
        color: theme.palette.text.secondary, // Cor padrão para texto secundário (lavanda)
        borderTop: `1px solid ${theme.palette.divider}`,
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 4 },
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
              Contato
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: theme.palette.text.secondary }}> {/* Texto "Email:" usa cor secundária */}
              Email: <Box component="a" href="mailto:psyrobs@gmail.com" sx={footerLinkSx}>psyrobs@gmail.com</Box> {/* Link usa cor primária */}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton
                 href={linkedInUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                 sx={{
                    mr: 1,
                    color: theme.palette.text.primary, // Ícones mais claros
                    '&:hover': {
                        color: theme.palette.secondary.main, // Azul no hover
                        bgcolor: alpha(theme.palette.secondary.main, 0.15)
                    }
                 }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                 href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                 sx={{
                    color: theme.palette.text.primary, 
                    '&:hover': {
                        color: theme.palette.secondary.main, 
                        bgcolor: alpha(theme.palette.secondary.main, 0.15)
                    }
                 }}
              >
                <GitHubIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
              Navegação
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <li style={{ marginBottom: '8px' }}><Link href="/" passHref><Typography variant="body2" component="span" sx={footerLinkSx}>Home</Typography></Link></li>
              <li style={{ marginBottom: '8px' }}><Link href="#sobre" passHref><Typography variant="body2" component="span" sx={footerLinkSx}>Sobre Mim</Typography></Link></li>
              <li style={{ marginBottom: '8px' }}><Link href="#destaques" passHref><Typography variant="body2" component="span" sx={footerLinkSx}>Destaques</Typography></Link></li>
              <li style={{ marginBottom: '8px' }}><Link href="#projetos" passHref><Typography variant="body2" component="span" sx={footerLinkSx}>Projetos</Typography></Link></li>
              <li style={{ marginBottom: '8px' }}><Link href="#contato" passHref><Typography variant="body2" component="span" sx={footerLinkSx}>Contato</Typography></Link></li>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
              PsyRobsS
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}> 
              Explorando a interseção entre mente, ciência e código.
            </Typography>
          </Grid>

        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6, pt: 3, borderTop: `1px solid ${theme.palette.divider}`, marginBottom: "60px" }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.disabled}}> 
            © {currentYear} Rob Savoldi - Todos os direitos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;