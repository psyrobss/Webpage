import React from 'react';
import HighlightPageTemplate from '@/app/components/HighlightPageTemplate';
import { Typography } from '@mui/material';

const pageData = {
  title: 'Ciência de Dados Comportamentais',
  bannerImage: '/images/highlights/behavioral-data-science.jpg',
};

export default function DadosComportamentaisPage() {
  return (
    <HighlightPageTemplate title={pageData.title} bannerImage={pageData.bannerImage}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: 'secondary.main' }}>
        Extraindo Conhecimento de Dados Humanos
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
        A Ciência de Dados Comportamentais aplica métodos de análise de dados, estatística e machine learning para entender e prever o comportamento humano. Trabalho com a coleta, limpeza, análise e visualização de dados provenientes de diversas fontes, como questionários, experimentos, dados de uso de aplicativos e outras interações digitais.
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
        Algumas das técnicas e ferramentas que utilizo incluem:
      </Typography>
      {/* ADICIONE UMA LISTA OU MAIS PARÁGRAFOS DETALHANDO SUAS HABILIDADES */}
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
        - Modelagem estatística (regressão, ANOVA, modelagem multinível).
        <br />- Algoritmos de Machine Learning (classificação, clustering, redução de dimensionalidade).
        <br />- Linguagens de programação como Python (com bibliotecas como Pandas, NumPy, Scikit-learn, Seaborn) e R.
        <br />- Visualização de dados para comunicação eficaz de resultados.
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
        O objetivo é transformar dados brutos em insights acionáveis que podem informar o desenvolvimento de produtos, políticas públicas, intervenções personalizadas e avançar o conhecimento científico sobre o comportamento.
      </Typography>
      {/* ADICIONE MAIS CONTEÚDO DETALHADO AQUI */}
    </HighlightPageTemplate>
  );
}