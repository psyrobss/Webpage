'use client';
import { motion } from 'framer-motion';
import { Typography, Card, CardMedia, CardContent, useTheme, Box, Button, IconButton, alpha } from '@mui/material';
import { useRef } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { CustomArrowProps } from "react-slick";
import Slider from "react-slick"; // Importa o react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface HighlightsSectionProps {
  id?: string;
}

const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '';


// Dados dos destaques 
const highlightsData = [
  { title: 'Clínica & Psicoterapia cognitiva', description: 'Terapia Cognitiva e suporte especializado para integração de experiências psicodélicas.', image: '/images/highlights/clinical-integrative-therapy.jpg', link: '/destaques/clinica-psicoterapia' },
  { title: 'Psicometria e Avaliação Psicológica', description: 'Desenvolvimento, aplicação e análise de testes psicológicos e avaliações psicométricas.', image: '/images/highlights/psychometrics-assessment.jpg', link: '/destaques/avaliacoes-psicologicas' },
  { title: 'Ciência de Dados Comportamentais', description: 'Análise de dados e métodos estatísticos para extrair insights de dados psicológicos e comportamentais.', image: '/images/highlights/behavioral-data-science.jpg', link: '/destaques/dados-comportamentais' },
  { title: 'IA Generativa & Soluções Digitais', description: 'Exploração e desenvolvimento de aplicações com LLMs e ferramentas de IA para otimizar processos.', image: '/images/highlights/generative-ai-dev.jpg', link: '/destaques/ia-generativa' },
  { title: 'Pesquisa em Psicologia e Tecnologia', description: 'Investigando a interação humano-computador e o impacto da tecnologia no bem-estar.', image: '/images/highlights/psych-tech-research.jpg', link: '/destaques/pesquisa-em-psicologia' },
];

// Componentes de Seta Customizados para o Slider, usando cores do tema
function NextArrow(props: CustomArrowProps) {
    const { className, style, onClick } = props;
    const theme = useTheme();
    return (
        <IconButton
            className={`${className} slick-next-custom`}
            sx={{
                ...style,
                display: "block", position: 'absolute', top: '50%', right: { xs: '-10px', sm: '-20px', md: '-25px'},
                transform: 'translateY(-50%)', zIndex: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.5), // Cor primária com alfa
                color: theme.palette.primary.contrastText,
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.7) }
            }}
            onClick={onClick} 
            aria-label="Próximo Destaque"
        >
            <ArrowForwardIosIcon fontSize='small'/>
        </IconButton>
    );
}

function PrevArrow(props: CustomArrowProps) {
    const { className, style, onClick } = props;
    const theme = useTheme();
    return (
        <IconButton
            className={`${className} slick-prev-custom`}
            sx={{
                ...style,
                display: "block", position: 'absolute', top: '50%', left: { xs: '-10px', sm: '-20px', md: '-25px'},
                transform: 'translateY(-50%)', zIndex: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.5),
                color: theme.palette.primary.contrastText,
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.7) }
            }}
            onClick={onClick} aria-label="Destaque Anterior"
        >
            <ArrowBackIosNewIcon fontSize='small'/>
        </IconButton>
    );
}

// Variantes de Animação (podem ser movidas para um arquivo utils/animations.ts se usadas em mais lugares)
const sectionTitleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function HighlightsSection({ id }: HighlightsSectionProps) {
  const theme = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);

  const sliderSettings = {
    dots: true,
    infinite: highlightsData.length > 3, // Só é infinito se houver mais slides que o visível
    arrows: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1, infinite: highlightsData.length > 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: true, infinite: highlightsData.length > 1 } }, // Setas visíveis em tablet
        { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false } } // Sem setas em mobile
    ],
    appendDots: (dots: React.ReactNode) => (
        <Box component="ul" sx={{
            bottom: '-40px',
            m: 0, p: 0,
            '& li button::before': {
                fontSize: '10px',
                color: alpha(theme.palette.text.primary, 0.3), // Cor dos dots inativos (usa texto primário com alfa)
                opacity: 1
            },
            '& li.slick-active button::before': {
                color: theme.palette.accent.main, // Cor do dot ativo (magenta)
                opacity: 1
            }
        }}>
            {dots}
        </Box>
    ),
  };

  return (
    <Box
        component={motion.section} // Anima a entrada da seção inteira
        id={id}
        ref={sectionRef}
        initial="hidden" // Para animação da seção (se definida em variants)
        whileInView="visible" // Para animação da seção
        viewport={{ once: true, amount: 0.1 }} // Gatilho suave
        // variants={sectionContainerVariants} // Adicionar variantes se quiser animar a seção como um todo
        sx={{
            py: { xs: 6, md: 10 },
            // Fundo da seção: Usa 'default' para contrastar com 'paper' de AboutSection
            bgcolor: "transparent",
            position: 'relative',
            overflow: 'hidden', // Importante para conter as setas se elas "vazarem" um pouco
        }}
    >
        <motion.div variants={sectionTitleVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
            <Typography
                variant="h2"
                component="h2"
                gutterBottom
                sx={{
                    textAlign: 'center',
                    color: 'primary.main', // Título usa cor primária do tema
                    mb: { xs: 8, md: 10 }, // Margem aumentada para os dots do slider
                    fontWeight: 700,
                }}
            >
                Áreas de Destaque
            </Typography>
        </motion.div>

      {/* Container do Slider */}
      <Box sx={{
          maxWidth: '1200px',
          mx: 'auto',
          // Ajuste de padding para acomodar as setas que ficam "fora"
          px: { xs: '30px', sm: '40px', md: '50px' },
          zIndex: 3
        }}
      >
        <Slider {...sliderSettings}>
            {highlightsData.map((highlight, index) => (
            <Box key={index} sx={{ px: { xs: 1, sm: 1.5 }, pb: 6, height: '100%' }}>
                {/* pb: 6 para dar espaço aos dots */}
                <Card
                    component={motion.div} // Permite animação individual se desejado no futuro
                    // variants={cardItemVariants} // Se for animar cards individualmente
                    sx={{
                        height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden',
                        bgcolor: alpha(theme.palette.background.default, 0.1),
                        boxShadow: theme.shadows[3],
                        transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
                        borderRadius: theme.shape.borderRadius * 2, // Raio de borda um pouco menor para cards
                        '&:hover': {
                            transform: 'translateY(-6px)', // Leve elevação
                            boxShadow: theme.shadows[10],
                            '.card-media-image': { transform: 'scale(1.08)', filter: 'grayscale(0%) brightness(1)' }
                        },
                    }}
                >
                    <Box sx={{ overflow: 'hidden', height: '200px', position: 'relative', flexShrink: 0 }}>
                        <CardMedia
                            component="img"
                            image={highlight.image} 
                            alt={highlight.title}
                            className="card-media-image"
                            sx={{
                                width: '100%', height: '100%', objectFit: 'cover',
                                transform: 'scale(1.0)',
                                filter: 'grayscale(15%) brightness(0.9)', // Efeito sutil na imagem
                                transition: 'filter 0.4s ease-out, transform 0.4s ease-out',
                            }}
                        />
                        <Box sx={{ // Overlay gradiente sobre a imagem
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            background: `linear-gradient(to top, ${alpha(theme.palette.common.black, 0.7)} 0%, transparent 80%)`,
                            opacity: 0.85
                        }} />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: {xs: 2, sm: 2.5}, display: 'flex', flexDirection: 'column', bgcolor: alpha(theme.palette.background.paper, 0.8) }}>
                        <Typography
                            variant="h5" component="h3" gutterBottom
                            sx={{
                                fontWeight: 600, // Um pouco menos que o título da seção
                                color: theme.palette.secondary.main, // Título do card usa azul vibrante
                                mb: 1.5,
                                fontSize: { xs: '1.1rem', sm: '1.25rem'}, // Ajuste responsivo do título do card
                            
                            }}
                        >
                             {highlight.title}
                         </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, flexGrow: 1, mb: 2 }}>
                             {highlight.description}
                         </Typography>
                        <Box sx={{ mt: 'auto' }}> {/* Empurra o botão para baixo */}
                            <Button
                                size="small"
                                href={highlight.link || '#'}
                                variant="outlined"
                                color="secondary" // Botão usa cor secundária (azul)
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    alignSelf: 'flex-start',
                                    // Estilos de hover do botão outlined já são tratados pelo tema
                                }}
                             > Saiba Mais </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
            ))}
        </Slider>
      </Box>
    </Box>
  );
}