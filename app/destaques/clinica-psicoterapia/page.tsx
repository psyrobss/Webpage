import React from 'react';
import HighlightPageTemplate from '@/app/components/HighlightPageTemplate'; // Ajuste o caminho
import { Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Dados específicos desta página
const pageData = {
  title: 'Clínica & Psicoterapia Cognitiva',
  bannerImage: '/images/highlights/clinical-integrative-therapy.jpg',
};

export default function ClinicaPsicoterapiaPage() {
  return (
    <HighlightPageTemplate title={pageData.title} bannerImage={pageData.bannerImage}>
      {/* Conteúdo Específico da Página Abaixo */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: 'secondary.main' }}>
        Abordagem Terapêutica
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
        Minha prática clínica é fundamentada na Terapia Cognitivo-Comportamental (TCC), uma abordagem psicoterapêutica estruturada, orientada para objetivos e focada no presente. A TCC baseia-se na ideia de que nossos pensamentos, emoções e comportamentos estão interconectados e que, ao modificar padrões de pensamento disfuncionais, podemos promover mudanças positivas no bem-estar emocional e comportamental.
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
        Além da TCC tradicional, ofereço suporte terapêutico especializado para indivíduos que utilizam ou consideram o uso de psicodélicos para fins terapêuticos ou de autoconhecimento. Este suporte inclui:
      </Typography>
      <List sx={{ mb: 2 }}>
        <ListItem>
          <ListItemIcon><CheckCircleOutlineIcon color="secondary" /></ListItemIcon>
          <ListItemText primary="Preparação: Discussão sobre intenções, expectativas, riscos e benefícios." />
        </ListItem>
        <ListItem>
          <ListItemIcon><CheckCircleOutlineIcon color="secondary" /></ListItemIcon>
          <ListItemText primary="Redução de Danos: Informações baseadas em evidências para um uso mais seguro." />
        </ListItem>
        <ListItem>
          <ListItemIcon><CheckCircleOutlineIcon color="secondary" /></ListItemIcon>
          <ListItemText primary="Integração: Auxílio na compreensão e incorporação dos insights e experiências vivenciadas, transformando-os em mudanças significativas na vida cotidiana." />
        </ListItem>
      </List>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
        Os atendimentos podem ser realizados presencialmente ou online, buscando sempre criar um ambiente seguro, acolhedor e confidencial para a exploração das suas questões.
      </Typography>
      {/* ADICIONE MAIS CONTEÚDO DETALHADO AQUI */}
    </HighlightPageTemplate>
  );
}