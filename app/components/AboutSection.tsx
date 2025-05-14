'use client';
import { motion } from 'framer-motion';
import { Typography, Grid, Card, CardContent, Box, useTheme } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SmartToyIcon from '@mui/icons-material/SmartToy';

interface AboutSectionProps {
  id?: string;
}

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const cardContentVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const elementVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AboutSection({ id }: AboutSectionProps) {
  const theme = useTheme();

  const services = [
    {
        icon: LocalHospitalIcon,
        title: 'Atuação Clínica',
        desc: 'Ofereço Terapia Cognitiva (TC) em atendimentos presenciais e online.',
        color: theme.palette.secondary.main // Azul Vibrante
    },
    {
        icon: AnalyticsIcon,
        title: 'Análise e Avaliação',
        desc: 'Realizo análises de dados, aplicação de testes psicológicos e avaliações psicométricas detalhadas.',
        color: theme.palette.primary.light // Roxo Médio (light da primária)
    },
    {
        icon: SmartToyIcon,
        title: 'Tecnologia e IA',
        desc: 'Desenvolvo e aplico soluções tecnológicas, com foco em IA. Tenho experiência em Psicometria e LLMs como Claude, ChatGPT, Gemini, Grok, Qwen, Deepseek, e ferramentas como AI Studio, NotebookLM e Minimax Audio LLM.',
        color: theme.palette.accent.main // Magenta
    },
  ];

  return (
    <Box
        component="section"
        id={id}
        className="about-section"
        sx={{
            position: 'relative',
            overflow: 'hidden',
            py: { xs: 6, md: 10 },
            px: { xs: 2, md: 4 },
            bgcolor: "transparent",
                  }}
    >
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={itemVariants}>
        <Typography variant="h2" component="h2" gutterBottom sx={{ textAlign: 'center', color: 'primary.main', mb: { xs: 6, md: 8 }, fontWeight: 700 }}>
            Sobre Mim
        </Typography>
      </motion.div>

      <Grid
        container
        spacing={{ xs: 4, md: 6 }}
        justifyContent="center"
        alignItems="center"
        component={motion.div}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Grid item xs={12} md={6} component={motion.div} variants={itemVariants}>
            <Typography variant="body1" sx={{ color: 'text.primary', fontSize: { xs: '1rem', md: '1.15rem' }, lineHeight: 1.7, mb: { xs: 2, md: 0}, paddingLeft: { xs: 0, md: 4 }, maxWidth: '600px', mx: { xs: 'auto', md: 0 } }}>
                Sou um profissional apaixonado pela interseção entre psicologia, ciência e tecnologia, como foco em psicometria e estatística. Minha motivação é aplicar o entendimento profundo do comportamento humano e métodos científicos rigorosos para criar soluções tecnológicas que realmente impactem e melhorem a vida das pessoas.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.7, mt: 2, mb: { xs: 2, md: 0}, paddingLeft: { xs: 0, md: 4 }, maxWidth: '600px', mx: { xs: 'auto', md: 0 } }}>
                Atualmente, atuo no <strong style={{ color: theme.palette.accent.main }}>Núcleo de Epistemologia Experimental e Cultural (NEC)</strong> da UFPE e na <strong style={{ color: theme.palette.accent.main }}>clínica BioReligare</strong>, oferecendo Terapia Cognitiva e suporte terapêutico a pessoas que utilizam psicodélicos. Além disso, realizo análises de dados, testagens psicológicas e avaliações psicométricas.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.7, mt: 2, mb: 4, paddingLeft: { xs: 0, md: 4 }, maxWidth: '600px', mx: { xs: 'auto', md: 0 } }}>
                Estou desenvolvendo scripts com <strong style={{ color: theme.palette.accent.main }}>inteligência artificial</strong>, testando e ajustando, aprendendo até alcançar produtos mínimos viáveis (MVPs). Esta página ainda está em contrução e será aprimorada a medida que vou aprendendo a utilizar novas ferramentas. Sou entusiasta de tecnologia e busco integrá-la de forma às práticas clínicas e científicas.
            </Typography>
        </Grid>

        <Grid item xs={12} md={6} component={motion.div} variants={itemVariants}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginRight: { xs: 0, md: 4 } }}>
            {services.map((service, index) => (
              <Card
                key={index}
                component={motion.div}
                sx={{
                  boxShadow: theme.shadows[4],
                  transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
                  display: 'flex',
                  alignItems: 'center',
                  p: 2.5,
                  bgcolor: 'background.paper', // Cards usam 'paper' para contraste com 'default' da seção
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[8],
                    '.service-icon': {
                        transform: 'scale(1.15)',
                        color: service.color,
                        transition: 'transform 0.3s ease-out, color 0.3s ease-out',}
                  },
                }}
              >
                 <motion.div variants={elementVariants} style={{ marginRight: theme.spacing(2.5), flexShrink: 0 }}>
                    <service.icon className="service-icon" sx={{ fontSize: 48, color: service.color, transition: 'transform 0.3s ease-out, color 0.3s ease-out' }} />
                 </motion.div>
                 <CardContent component={motion.div} variants={cardContentVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} sx={{ p: '0 !important', flexGrow: 1 }}>
                    <motion.div variants={elementVariants}>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary' }}> {service.title} </Typography>
                    </motion.div>
                    <motion.div variants={elementVariants}>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}> {service.desc} </Typography>
                    </motion.div>
                 </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
