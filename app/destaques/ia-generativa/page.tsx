import React from 'react';
import HighlightPageTemplate from '@/app/components/HighlightPageTemplate';
import { Typography } from '@mui/material';

const pageData = {
  title: 'IA Generativa & Soluções Digitais',
  bannerImage: '/images/highlights/generative-ai-dev.jpg',
};

export default function IaGenerativaPage() {
  return (
    <HighlightPageTemplate title={pageData.title} bannerImage={pageData.bannerImage}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: 'secondary.main' }}>
        Inovando com Inteligência Artificial
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
        A Inteligência Artificial Generativa, especialmente os Modelos de Linguagem de Grande Escala (LLMs), abriu novas fronteiras para a criação de soluções digitais inovadoras. Tenho explorado ativamente o potencial dessas tecnologias para otimizar processos, gerar conteúdo, criar ferramentas de suporte e desenvolver novas formas de interação.
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
        Minha experiência e áreas de interesse incluem:
      </Typography>
      {/* ADICIONE UMA LISTA OU MAIS PARÁGRAFOS DETALHANDO SEUS PROJETOS/EXPERIÊNCIAS */}
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
        - Desenvolvimento de protótipos e aplicações utilizando LLMs como Claude, ChatGPT (OpenAI), Gemini (Google), e outros.
        <br />- Fine-tuning de modelos para tarefas específicas e domínios de conhecimento.
        <br />- Integração de LLMs com outras tecnologias e APIs para criar soluções mais robustas.
        <br />- Exploração de ferramentas como AI Studio, NotebookLM para pesquisa e desenvolvimento ágil.
        <br />- Considerações éticas e de segurança na aplicação de IA generativa.
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
        Busco aplicar a IA de forma criativa e responsável, sempre com o objetivo de agregar valor e resolver problemas reais em contextos clínicos, de pesquisa ou de desenvolvimento de produtos.
      </Typography>
      {/* ADICIONE MAIS CONTEÚDO DETALHADO AQUI */}
    </HighlightPageTemplate>
  );
}