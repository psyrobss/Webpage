'use client'; // Adicionado 'use client' pois HighlightPageTemplate provavelmente usa hooks
import React from 'react';
import HighlightPageTemplate from '@/app/components/HighlightPageTemplate'; // Ajuste o caminho se necessário
import { Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'; // Adicionado List para exemplos
import ScienceIcon from '@mui/icons-material/Science'; // Ícone genérico para pesquisa
import PsychologyIcon from '@mui/icons-material/Psychology'; // Ícone para cognição

// Dados específicos desta página
const pageData = {
  title: 'Pesquisa em Psicologia', 
  bannerImage: '/images/highlights/psych-tech-research.jpg'
};

export default function PesquisaCognitivaPage() {
  return (
    <HighlightPageTemplate title={pageData.title} bannerImage={pageData.bannerImage}>
      {/* Conteúdo Específico da Página Abaixo */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: 'secondary.main' }}>
        Explorando os Processos da Mente Humana
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
        A Psicologia Cognitiva é o campo dedicado ao estudo científico dos processos mentais internos – tudo aquilo que acontece dentro do nosso cérebro, incluindo percepção, atenção, memória, linguagem, resolução de problemas, raciocínio e tomada de decisão. Minha paixão pela pesquisa reside em desvendar esses mecanismos complexos para entender melhor como aprendemos, pensamos e interagimos com o mundo.
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
        Minhas investigações e áreas de interesse em pesquisa cognitiva incluem, mas não se limitam a:
      </Typography>
      <List sx={{ mb: 2 }}>
        <ListItem>
          <ListItemIcon><PsychologyIcon color="primary" /></ListItemIcon>
          <ListItemText 
            primary="Atenção e Funções Executivas" 
            secondary="Investigação dos mecanismos de controle atencional, memória de trabalho, flexibilidade cognitiva e planejamento, e como esses processos são afetados por diferentes variáveis." 
          />
        </ListItem>
        <ListItem>
          <ListItemIcon><PsychologyIcon color="primary" /></ListItemIcon>
          <ListItemText 
            primary="Memória e Aprendizagem" 
            secondary="Estudo dos diferentes sistemas de memória (curto prazo, longo prazo, episódica, semântica) e os processos envolvidos na codificação, armazenamento e recuperação de informações." 
          />
        </ListItem>
        <ListItem>
          <ListItemIcon><PsychologyIcon color="primary" /></ListItemIcon>
          <ListItemText 
            primary="Linguagem e Cognição" 
            secondary="Análise de como processamos e compreendemos a linguagem, a relação entre pensamento e linguagem, e os aspectos cognitivos da leitura e da comunicação." 
          />
        </ListItem>
        <ListItem>
          <ListItemIcon><PsychologyIcon color="primary" /></ListItemIcon>
          <ListItemText 
            primary="Tomada de Decisão e Julgamento" 
            secondary="Exploração dos heurísticos, vieses cognitivos e processos racionais e intuitivos que guiam nossas escolhas em diferentes contextos." 
          />
        </ListItem>
         <ListItem>
          <ListItemIcon><ScienceIcon color="primary" /></ListItemIcon>
          <ListItemText
            primary="Metodologia de Pesquisa em Cognição"
            secondary="Aplicação e desenvolvimento de paradigmas experimentais, técnicas de neuroimagem (EEG, fMRI - quando em colaboração) e modelagem computacional para investigar processos cognitivos."
          />
        </ListItem>
      </List>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
        Acredito que a pesquisa rigorosa em psicologia cognitiva não apenas expande nosso entendimento fundamental da mente, mas também tem implicações práticas significativas para a educação, saúde mental, desenvolvimento de interfaces homem-máquina mais intuitivas e a criação de intervenções que podem otimizar o desempenho cognitivo e o bem-estar.
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
        Estou sempre interessado em discutir ideias, colaborar em projetos de pesquisa e explorar novas fronteiras no estudo da cognição humana.
      </Typography>
      {/* ADICIONAR MAIS DETALHES SOBRE PROJETOS DE PESQUISA ESPECÍFICOS, PUBLICAÇÕES OU INTERESSES PARTICULARES */}
    </HighlightPageTemplate>
  );
}