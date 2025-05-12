import React from 'react';
import HighlightPageTemplate from '@/app/components/HighlightPageTemplate';
import { Typography } from '@mui/material';

const pageData = {
  title: 'Psicometria e Avaliação Psicológica',
  bannerImage: '/images/highlights/psychometrics-assessment.jpg',
};

export default function AvaliacoesPsicologicasPage() {
  return (
    <HighlightPageTemplate title={pageData.title} bannerImage={pageData.bannerImage}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: 'secondary.main' }}>
        Precisão na Medida do Comportamento
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
        A psicometria é a ciência da medição psicológica. Utilizo princípios psicométricos rigorosos para o desenvolvimento, adaptação, aplicação e interpretação de testes e questionários psicológicos. O objetivo é obter medidas válidas e confiáveis de construtos como inteligência, personalidade, aptidões, interesses, e sintomas psicopatológicos.
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
        Minha experiência inclui:
      </Typography>
      {/* ADICIONE UMA LISTA OU MAIS PARÁGRAFOS DETALHANDO SUA EXPERIÊNCIA */}
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
        - Construção e validação de escalas e inventários.
        <br />- Análise de itens utilizando Teoria Clássica dos Testes (TCT) e Teoria de Resposta ao Item (TRI).
        <br />- Aplicação de testes para fins clínicos, organizacionais ou de pesquisa.
        <br />- Elaboração de laudos e relatórios psicológicos detalhados.
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
        Uma avaliação psicológica bem conduzida pode fornecer insights valiosos para o autoconhecimento, diagnóstico diferencial, planejamento de intervenções e tomada de decisões em diversos contextos.
      </Typography>
      {/* ADICIONE MAIS CONTEÚDO DETALHADO AQUI */}
    </HighlightPageTemplate>
  );
}