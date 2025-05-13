import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import HeroSection from "@/app/components/HeroSection";
import AboutSection from "@/app/components/AboutSection";
import HighlightsSection from "@/app/components/HighlightsSection";
import ProjectsSection from "@/app/components/ProjectsSection"; 
import ContactSection from "@/app/components/ContactSection";
import SpotifyPlayer from "@/app/components/SpotifyPlayer";
import ParticlesComponent from "@/app/components/Particles"; 
import Box from '@mui/material/Box';

export default function Home() {
  return (
    // Wrapper Principal que contém tudo e define o contexto de posicionamento
    <Box sx={{ 
      position: 'relative', 
      minHeight: '100vh', 
      overflowX:'hidden' /* Evita scroll horizontal acidental */ }}>

      {/* Partículas posicionadas absolutamente dentro do wrapper, atrás do conteúdo */}
      <ParticlesComponent id="background-particles" />

      {/* Conteúdo Principal (Header, Main, Footer) */}
      <Box sx={{ 
        position: 'relative', 
        zIndex: 1 }}> {/* Garante que o conteúdo fique acima das partículas */}
        <Header />

        <main>
          {/* Seções individuais renderizadas aqui */}
          <HeroSection id="hero" />
          <AboutSection id="sobre" />
          <HighlightsSection id="destaques" />
          <ProjectsSection id="projetos" />
          <ContactSection id="contato" />
        </main>

        <Footer />
      </Box>

      {/* Player Spotify */}
      <SpotifyPlayer />
    </Box>
  );
}