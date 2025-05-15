// ProjectsSection.tsx
'use client'; // Especifica que este é um Componente Cliente, necessário para hooks como useState, useEffect e manipulação de eventos.

// Importações de React e hooks.
import React, { useState, useRef, Suspense, useMemo, useEffect, useCallback, Component, ErrorInfo, ReactNode } from 'react';
// Importação para animações de entrada (scroll-triggered).
import { motion } from 'framer-motion';
// Importações de componentes e hooks do Material-UI para estilização.
import { Typography, Box, useTheme, alpha, IconButton, CircularProgress, type Theme } from '@mui/material';
// Importação para carregamento dinâmico de componentes, otimizando o bundle inicial.
import dynamic from 'next/dynamic';
// Importações de ícones do Material-UI.
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

// Importações da biblioteca Three.js e seus helpers para a cena 3D.
import * as THREE from 'three';
// Importações de componentes e hooks do React Three Fiber para integrar Three.js com React.
import { Canvas, useFrame, type RootState, type ThreeEvent } from '@react-three/fiber';
// Importação da implementação do OrbitControls para Three.js.
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
// Importações de componentes utilitários do Drei, uma coleção de helpers para React Three Fiber.
import { OrbitControls, Image as DreiImage, Text as DreiText, RoundedBox, Stars } from '@react-three/drei';

// Importações de tipos específicos do Three.js para anotação.
import type { Group, Object3DEventMap } from 'three';

// Define o prefixo para caminhos de assets, útil para deployments em subdiretórios.
const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '';


// --- Error Boundary ---
// Interface para as props do ErrorBoundary.
interface ErrorBoundaryProps {
  children: ReactNode; // Conteúdo que o ErrorBoundary vai envolver.
  fallback?: ReactNode; // UI a ser exibida em caso de erro.
}
// Interface para o estado do ErrorBoundary.
interface ErrorBoundaryState {
  hasError: boolean; // Flag que indica se ocorreu um erro.
}
// Componente de Classe ErrorBoundary para capturar erros em seus componentes filhos.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Construtor para inicializar o estado.
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false }; // Estado inicial: sem erro.
  }
  // Método estático para atualizar o estado quando um erro é derivado de um filho.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true }; // Indica que um erro ocorreu.
  }
  // Método chamado após um erro ter sido lançado por um componente descendente.
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Erro capturado pelo ErrorBoundary:", error, errorInfo); // Loga o erro e informações adicionais.
  }
  // Método render para exibir a UI.
  render() {
    // Se um erro ocorreu, renderiza a UI de fallback.
    if (this.state.hasError) {
      return this.props.fallback || <Typography color="error">Ocorreu um erro ao carregar esta parte.</Typography>;
    }
    // Caso contrário, renderiza os componentes filhos normalmente.
    return this.props.children;
  }
}
// --- Fim Error Boundary ---

// Declaração de Módulo para estender a paleta de cores do Material-UI.
declare module '@mui/material/styles' {
  // Estende a interface Palette para incluir uma cor 'accent'.
  interface Palette {
    accent: Palette['primary']; // 'accent' terá a mesma estrutura que 'primary'.
  }
  // Estende a interface PaletteOptions para permitir a configuração de 'accent'.
  interface PaletteOptions {
    accent?: PaletteOptions['primary']; // 'accent' opcional na configuração do tema.
  }
}

// Interface para definir a estrutura de um objeto Project.
interface Project {
  title: string; // Título do projeto.
  description: string; // Descrição do projeto.
  image: string; // URL da imagem do projeto.
  link?: string; // URL externa para o projeto (opcional).
  tags?: string[]; // Lista de tags associadas ao projeto (opcional).
  detailsLink?: string; // URL interna para a página de detalhes do projeto (opcional).
}

// Dados dos projetos (mock data).
const projectsData: Project[] = [
  { title: 'Análise Preditiva em Psicologia',
    description: 'Exploração aprofundada de dados psicológicos utilizando R, Python, SPSS e algoritmos para identificar padrões, prever tendências comportamentais e otimizar intervenções terapêuticas personalizadas.',
    image: `${prefix}/images/projects/data-analysis-psych.jpg`, // Uso do prefixo para a imagem.
    tags: ['Análise de Dados', 'Python', 'R', 'SPSS'],
    detailsLink: `${prefix}/projetos/análise-de-dados-psicológicos` // Uso do prefixo para o link.
  },
  { title: 'Terapia Cognitivo-Comportamental (TCC)',
    description: 'Aplicação clínica da TCC, uma abordagem baseada em evidências, para tratar diversos transtornos. Foco na reestruturação de pensamentos disfuncionais e desenvolvimento de estratégias adaptativas.',
    image: `${prefix}/images/projects/cognitive-therapy.jpg`, // As imagens devem estar na pasta public/images/...
    tags: ['TCC', 'Psicodiagnóstico', 'Saúde Mental'],
    detailsLink: `${prefix}/projetos/avaliação-e-terapia-cognitiva`
  },
  { title: 'Apoio Terapêutico Psicodélico',
    description: 'Acompanhamento ético e especializado para indivíduos que participaram em jornadas com psicodélicos como ayahuasca (em contextos legais e seguros). Foco na preparação e integração pós-sessão.',
    image: `${prefix}/images/projects/psychedelic-support.jpg`,
    tags: ['Psicodélicos', 'Integração', 'Redução de Danos'],
    detailsLink: `${prefix}/projetos/terapia-em-psicodelicos`
  },
  { title: 'Escalas de Autoconsciência',
    description: 'Avaliação psicométrica de escalas para mensurar múltiplas dimensões da autoconsciência. Utilização de análises multidimensionais, análises fatoriais e teoria de resposta ao item.',
    image: `${prefix}/images/projects/self-awareness-scale.jpg`,
    tags: ['Psicometria', 'Validação', 'Pesquisa'],
    detailsLink: `${prefix}/projetos/autoconsciência`
  },
  { title: 'Chatbot de Suporte com IA',
    description: 'Protótipo de um assistente virtual baseado em LLMs para oferecer suporte em psicoeducação interativa e triagem básica. Explora o potencial da IA na promoção do bem-estar mental.',
    image: `${prefix}/images/projects/ai-chatbot-therapy.jpg`,
    tags: ['IA', 'LLM', 'Chatbot', 'Saúde Mental Tech'],
    detailsLink: `${prefix}/projetos/chatbot-com-ia`
  },
];

// Número total de projetos, usado para navegação e cálculos.
const numProjects = projectsData.length;

// Variantes de animação para o título da seção usando Framer Motion.
const sectionTitleVariants = {
  hidden: { opacity: 0, y: -30 }, // Estado inicial: invisível e um pouco acima.
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } // Estado final: visível e na posição original.
};

// Props para o componente ProjectCard3D.
interface ProjectCard3DProps {
  project: Project; // Dados do projeto a serem exibidos.
  isActive: boolean; // Indica se o card está atualmente ativo (centralizado).
  onClick: (event: ThreeEvent<MouseEvent>) => void; // Função a ser chamada ao clicar no card (muda activeIndex).
  position: [number, number, number]; // Posição do card na cena 3D.
  rotationY: number; // Rotação Y do card para encarar o centro.
}

// Componente ProjectCard3D refatorado e simplificado
function ProjectCard3D({ project, isActive, onClick, position, rotationY }: ProjectCard3DProps) {
  const theme = useTheme<Theme>(); // Hook para acessar o tema do Material-UI.
  const groupRef = useRef<Group<Object3DEventMap>>(null); // Ref para o grupo principal do card.
  const [isCardHovered, setIsCardHovered] = useState(false); // Estado para controlar o hover do mouse sobre o card.
  const [isButtonHovered, setIsButtonHovered] = useState(false); // Estado para controlar o hover do mouse sobre o botão de detalhes.

  // Define o cursor do body com base no estado de hover. Prioriza o botão.
  useEffect(() => {
    if (isButtonHovered) {
      document.body.style.cursor = 'pointer'; // Cursor de link/mãozinha para o botão.
    } else if (isCardHovered) {
      document.body.style.cursor = 'pointer'; // Cursor de mãozinha para o card clicável.
    } else {
      document.body.style.cursor = 'default'; // Cursor padrão.
    }
    // Função de limpeza para restaurar o cursor padrão ao desmontar o componente (boa prática).
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [isCardHovered, isButtonHovered]); // Reavalia quando qualquer um dos estados de hover muda.


  // --- Constantes de Dimensão e Estilo do Card ---
  const cardWidth = 3.2; // Largura do card.
  const cardHeight = 5.0; // Altura do card.
  const cardDepth = 0.1; // Profundidade do card para efeito 3D.
  const cornerRadius = 0.1; // Raio das bordas arredondadas do card.
  const generalPadding = 0.2; // Padding interno geral do card.
  const contentWidth = cardWidth - 2 * generalPadding; // Largura útil para o conteúdo.
  const zOffsetForFrontElements = cardDepth / 2 + 0.005; // Pequeno offset Z para elementos na face do card.

  // --- Layout da Imagem ---
  const imageAspectRatio = 16 / 9; // Proporção da imagem.
  const imageHeightPercentage = 0.40; // 40% da altura *útil* do card para a imagem.
  const availableHeightForContent = cardHeight - 2 * generalPadding; // Altura útil total.
  let imageRenderHeight = availableHeightForContent * imageHeightPercentage; // Altura da imagem.
  let imageRenderWidth = imageRenderHeight * imageAspectRatio; // Largura da imagem.

  // Ajustar se a largura da imagem exceder a largura do conteúdo.
  if (imageRenderWidth > contentWidth) {
    imageRenderWidth = contentWidth;
    imageRenderHeight = imageRenderWidth / imageAspectRatio;
  }
  // Posição Y da imagem (no topo do conteúdo).
  const imagePosY = (cardHeight / 2) - generalPadding - (imageRenderHeight / 2);

  // --- Layout da Área de Texto (abaixo da imagem) ---
  const spaceBetweenImageAndText = 0.15; // Espaço vertical entre imagem e textos.
  // Ponto Y onde a área de texto começa.
  const textBlockStartY = imagePosY - (imageRenderHeight / 2) - spaceBetweenImageAndText;
  // Ponto Y onde a área de texto termina (base do card, com padding).
  const textBlockEndY = -cardHeight / 2 + generalPadding;

  // --- Configurações de Fonte (seus valores mantidos) ---
  const TITLE_FONT_SIZE = 0.20; // Tamanho da fonte do título.
  const TITLE_LINE_HEIGHT = 1.2; // Altura da linha do título.
  const DESC_FONT_SIZE = 0.11; // Tamanho da fonte da descrição.
  const DESC_LINE_HEIGHT = 1.4; // Altura da linha da descrição.
  const TAG_FONT_SIZE = 0.075; // Tamanho da fonte das tags.
  const BUTTON_TEXT_FONT_SIZE = 0.10; // Tamanho da fonte do texto do botão.

  // --- Layout do Botão (fixo na base da área de texto) ---
  const buttonAreaHeight = 0.35; // Altura total para a área do botão (inclui padding visual).
  const buttonBgHeight = 0.25; // Altura do fundo do botão.
  const buttonBgWidth = contentWidth * 0.7; // Largura do fundo do botão.
  // Posição Y do botão (ancorado na base da área de texto).
  const buttonPosY = textBlockEndY + buttonAreaHeight / 2; // Centraliza verticalmente dentro da buttonAreaHeight.

  // --- Layout das Tags (acima do botão) ---
  const tagsAreaVisualHeight = TAG_FONT_SIZE * 1.5; // Altura visual que as tags ocupam mais um pequeno espaçamento.
  const spaceBetweenTagsAndButton = 0.05; // Espaço.
  // Posição Y das tags.
  const tagsPosY = buttonPosY + buttonAreaHeight / 2 + spaceBetweenTagsAndButton + (tagsAreaVisualHeight / 2);

  // --- Layout do Título (no topo da área de texto) ---
  const titleMaxLines = 2; // Máximo de linhas para o título
  const titleHeightEstimate = TITLE_FONT_SIZE * TITLE_LINE_HEIGHT * titleMaxLines; // Estimativa para até N linhas.
  // Posição Y do título.
  const titlePosY = textBlockStartY - (titleHeightEstimate / 2); // Centralizado na sua altura estimada.
  const titleMarginBottom = 0.08; // Espaçamento abaixo do título.

  // --- Layout da Descrição (ocupa espaço restante) ---
  // Ponto Y onde a descrição começa (abaixo do título).
  const descriptionStartY = titlePosY - (titleHeightEstimate / 2) - titleMarginBottom;
  // Ponto Y onde a descrição termina (acima das tags ou botão se não houver tags).
  const descriptionEndY = (project.tags && project.tags.length > 0)
    ? tagsPosY + (tagsAreaVisualHeight / 2) + 0.05 // Acima das tags
    : buttonPosY + buttonAreaHeight / 2 + 0.05; // Acima do botão
  const descriptionAvailableHeight = Math.max(0, descriptionStartY - descriptionEndY); // Altura para descrição, não pode ser negativa.
  // Posição Y da descrição.
  const descriptionPosY = descriptionEndY + descriptionAvailableHeight / 2; // Centraliza no espaço disponível

  // Estimativa de caracteres para a descrição.
  const estimatedCharsPerLineDesc = contentWidth / (DESC_FONT_SIZE * 0.55); // Fator de ajuste para largura de caractere
  const estimatedLinesDesc = descriptionAvailableHeight > 0 ? Math.floor(descriptionAvailableHeight / (DESC_FONT_SIZE * DESC_LINE_HEIGHT)) : 0;
  const maxDescChars = Math.max(10, Math.floor(estimatedLinesDesc * estimatedCharsPerLineDesc));

  // --- Cores e Materiais (Memoized) ---
  const memoizedColors = useMemo(() => ({
    paper: theme.palette.background.paper, // Cor de fundo do card.
    textPrimary: theme.palette.text.primary, // Cor primária do texto.
    textSecondary: theme.palette.text.secondary, // Cor secundária do texto (descrição).
    accentMain: theme.palette.accent?.main || theme.palette.primary.main, // Cor de destaque (botão).
    accentContrast: theme.palette.accent?.contrastText || theme.palette.getContrastText(theme.palette.primary.main), // Cor do texto do botão.
    tagColor: theme.palette.secondary.light, // Cor das tags.
  }), [theme]); // Recalcula apenas se o tema mudar.

  // Material para o corpo do card. Tipo inferido como THREE.MeshStandardMaterial.
  const cardBodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: memoizedColors.paper, metalness: 0.2, roughness: 0.7, transparent: true, opacity: 0.95,
  }), [memoizedColors.paper]); // Recalcula se a cor do papel mudar.

  // Material para o fundo do botão. Tipo inferido como THREE.MeshStandardMaterial.
  const buttonBackgroundMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: memoizedColors.accentMain, roughness: 0.6, metalness: 0.1,
  }), [memoizedColors.accentMain]); // Recalcula se a cor de destaque mudar.

  // --- Animação por Frame ---
  useFrame((state: RootState, delta: number) => {
    // Animação sutil de flutuação e escala no card.
    if (groupRef.current) {
      // Flutuação vertical suave.
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4 + position[0] * 0.5) * 0.08;
      // Efeito de escala ao passar o mouse ou quando o card está ativo.
      const targetScale = isActive ? 1.08 : (isCardHovered ? 1.03 : 1); // Escala depende do hover do card
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 6); // Interpolação suave para a escala.
    }
  });

  // Callback para o clique no botão de detalhes
  const handleDetailsClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation(); // Impede que o clique propague para o card (que mudaria o activeIndex).
    if (project.detailsLink) {
      window.open(project.detailsLink, '_self'); // Abre o link de detalhes na mesma aba.
    }
  }, [project.detailsLink]); // Dependência: link do projeto.

  // Função para truncar texto.
  const truncateText = (text: string, maxLength: number): string => {
    if (maxLength <= 0 && text.length > 0) return "..."; // Se não há espaço, mas há texto, mostra reticências.
    if (maxLength <= 0 && text.length === 0) return ""; // Se não há espaço nem texto, string vazia.
    if (text.length <= maxLength) return text; // Texto cabe.
    return text.substring(0, maxLength - 3) + "..."; // Trunca e adiciona reticências.
  }

  // --- Renderização do Card ---
  return (
    <group // Grupo principal do card, aplica posição e rotação.
      ref={groupRef} // Referência para manipulação (animação).
      position={position} // Posição recebida via props.
      rotation={[0, rotationY, 0]} // Rotação Y para encarar o centro.
      onClick={onClick} // Manipulador de clique no card (ACIONA A ROTAÇÃO DA GALERIA).
      onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setIsCardHovered(true); }} // Ao passar o mouse sobre o card: define hover do card.
      onPointerOut={() => { setIsCardHovered(false); }} // Ao retirar o mouse do card: reverte hover do card.
    >
      {/* Corpo do Card */}
      <RoundedBox // Componente para criar uma caixa com cantos arredondados.
        args={[cardWidth, cardHeight, cardDepth]} // Dimensões (largura, altura, profundidade).
        radius={cornerRadius} // Raio dos cantos.
        smoothness={4} // Suavidade das bordas.
        material={cardBodyMaterial} // Material customizado.
        castShadow // Card projeta sombras.
        receiveShadow // Card recebe sombras.
      />

      {/* Imagem do Projeto */}
      <Suspense fallback={null}> {/* Suspense para carregamento assíncrono da imagem */}
        <DreiImage // Componente para exibir imagens na cena 3D.
          url={project.image} // URL da imagem.
          scale={[imageRenderWidth, imageRenderHeight]} // Escala da imagem.
          position={[0, imagePosY, zOffsetForFrontElements]} // Posição da imagem.
          transparent // Habilita transparência para a imagem (se PNG).
          opacity={0.95} // Opacidade da imagem.
        />
      </Suspense>

      {/* Título do Projeto */}
      <DreiText // Componente para renderizar texto na cena 3D.
        color={memoizedColors.textPrimary} // Cor do texto.
        anchorX="center" anchorY="middle" // Ancoragem do texto.
        position={[0, titlePosY, zOffsetForFrontElements]} // Posição do texto.
        fontSize={TITLE_FONT_SIZE} // Tamanho da fonte.
        maxWidth={contentWidth * 0.95} // Largura máxima para quebra de linha.
        lineHeight={TITLE_LINE_HEIGHT} // Altura da linha.
        textAlign="center" // Alinhamento do texto.
        fontWeight={600} // Peso da fonte.
        overflowWrap="break-word" // Quebra de palavra.
      >
        {truncateText(project.title, Math.floor(estimatedCharsPerLineDesc * titleMaxLines * (TITLE_FONT_SIZE/DESC_FONT_SIZE) * 0.9 ))}
      </DreiText>

      {/* Descrição do Projeto */}
      <DreiText // Componente de texto para a descrição.
        color={memoizedColors.textSecondary} // Cor do texto.
        anchorX="center" anchorY="middle" // Ancoragem do texto.
        position={[0, descriptionPosY, zOffsetForFrontElements]} // Posição do texto.
        fontSize={DESC_FONT_SIZE} // Tamanho da fonte.
        maxWidth={contentWidth * 0.9} // Largura máxima para quebra de linha.
        lineHeight={DESC_LINE_HEIGHT} // Altura da linha.
        textAlign="justify" // Alinhamento justificado.
        overflowWrap="break-word" // Quebra de palavra.
      >
         {truncateText(project.description, maxDescChars)}
      </DreiText>

      {/* Tags do Projeto */}
      {project.tags && project.tags.length > 0 && ( // Renderiza somente se houver tags.
        <group position={[0, tagsPosY, zOffsetForFrontElements]}> {/* Grupo para posicionar as tags. */}
          {project.tags.slice(0, 3).map((tag, i, arr) => { // Exibe no máximo 3 tags.
            const numDisplayedTags = Math.min(arr.length, 3); // Número de tags que serão exibidas.
            // Estimativa da largura de cada item de tag para distribuição.
            const tagItemWidthEstimate = (contentWidth * 0.8) / numDisplayedTags;
            // Posição X de cada tag para centralizá-las.
            const xPos = (i - (numDisplayedTags - 1) / 2) * tagItemWidthEstimate;
            return (
              <DreiText // Componente de texto para cada tag.
                key={tag + i} // Chave única para React.
                color={memoizedColors.tagColor} // Cor da tag.
                fontSize={TAG_FONT_SIZE} // Tamanho da fonte.
                anchorX="center" anchorY="middle" // Ancoragem da tag.
                position={[xPos, 0, 0]} // Posição X calculada, Y e Z são 0 relativo ao grupo das tags.
                maxWidth={tagItemWidthEstimate * 0.9} // Largura máxima para a tag.
              >
                #{tag} {/* Texto da tag com #. */}
              </DreiText>
            );
          })}
        </group>
      )}

      {/* Botão "Ver Detalhes" */}
      {project.detailsLink && ( // Renderiza somente se houver link de detalhes.
        <group // Grupo para o botão (fundo + texto).
          position={[0, buttonPosY, zOffsetForFrontElements]} // Posição do botão.
          onClick={handleDetailsClick} // Ação de clique para abrir link.
          onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setIsButtonHovered(true); }} // Ao passar o mouse SOBRE O BOTÃO: define hover do botão.
          onPointerOut={() => { setIsButtonHovered(false); }} // Ao retirar o mouse DO BOTÃO: reverte hover do botão.
        >
          {/* Fundo Arredondado para o Botão */}
          <RoundedBox // Caixa arredondada para o fundo do botão.
            args={[buttonBgWidth, buttonBgHeight, 0.02]} // Dimensões do fundo.
            radius={0.05} // Raio dos cantos.
            smoothness={4} // Suavidade.
            material={buttonBackgroundMaterial} // Material do fundo.
          />
          {/* Texto do Botão */}
          <DreiText // Texto "Ver Detalhes".
            color={memoizedColors.accentContrast} // Cor do texto para contraste com o fundo.
            fontSize={BUTTON_TEXT_FONT_SIZE} // Tamanho da fonte.
            anchorX="center" anchorY="middle" // Ancoragem.
            position={[0, 0, 0.02 / 2 + 0.001]} // Levemente à frente do fundo do botão.
            fontWeight="bold" // Texto em negrito.
          >
            Ver Detalhes [→] {/* Texto do botão. */}
          </DreiText>
        </group>
      )}
    </group>
  );
}


// Props para o componente ProjectGallery.
interface ProjectGalleryProps {
  activeIndex: number; // Índice do projeto atualmente ativo.
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>; // Função para definir o projeto ativo.
  cardTransforms: { position: [number, number, number]; rotationY: number }[]; // Array de posições e rotações para cada card.
  targetRotationRef: React.MutableRefObject<number>; // Referência para a rotação Y alvo da galeria (carrossel).
}

// Componente ProjectGallery para renderizar os cards 3D em um layout de carrossel.
function ProjectGallery({ activeIndex, setActiveIndex, cardTransforms, targetRotationRef }: ProjectGalleryProps) {
  const groupRef = useRef<Group<Object3DEventMap>>(null); // Ref para o grupo que contém todos os cards.

  // Hook useFrame para animação da rotação do carrossel.
  useFrame((_state: RootState, delta: number) => {
    if (groupRef.current) {
      // Interpola suavemente a rotação Y atual do grupo para a rotação alvo.
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationRef.current, delta * 4);
    }
  });

  // Renderiza o grupo de cards.
  return (
    <group ref={groupRef} position={[0, 0.3, 0]}> {/* Elevando ligeiramente a galeria inteira */}
      {projectsData.map((project, index) => ( // Mapeia os dados dos projetos para componentes ProjectCard3D.
        <ProjectCard3D
          key={project.title + index + (project.tags ? project.tags.join('') : '')} // Chave única para cada card.
          project={project} // Dados do projeto.
          isActive={index === activeIndex} // Define se o card está ativo.
          onClick={(e: ThreeEvent<MouseEvent>) => { 
            e.stopPropagation(); // Previne que o clique afete o OrbitControls diretamente de forma indesejada.
            setActiveIndex(index); // Apenas muda o card ativo, a galeria vai rodar.
          }}
          position={cardTransforms[index].position} // Posição do card na cena.
          rotationY={cardTransforms[index].rotationY} // Rotação Y do card.
        />
      ))}
    </group>
  );
}

// Props para o componente ThreeSceneContainer.
interface ThreeSceneContainerProps {
    activeIndex: number; // Índice do projeto ativo, vindo do componente pai.
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>; // Função para definir o projeto ativo, vinda do pai.
}

// Componente ThreeSceneContainer que configura e renderiza a cena 3D principal.
function ThreeSceneContainer({ activeIndex, setActiveIndex }: ThreeSceneContainerProps) {
  const theme = useTheme<Theme>(); // Hook para acessar o tema.
  const cardDistance = 5.5; // Distância dos cards ao centro do carrossel.
  const angleStep = useMemo(() => (Math.PI * 2) / numProjects, []); // Ângulo entre cada card no carrossel.
  const targetLogicalRotation = useRef(0); // Ref para a rotação lógica do carrossel.
  const orbitRef = useRef<OrbitControlsImpl>(null); // Ref para os OrbitControls.

  // Calcula as transformações (posição e rotação Y) para cada card.
  const cardTransforms = useMemo(() => {
    return projectsData.map((_, index) => {
      const angle = index * angleStep; // Ângulo do card atual.
      const x = Math.sin(angle) * cardDistance; // Posição X.
      const z = Math.cos(angle) * cardDistance; // Posição Z.
      const rotationY = Math.atan2(x, z); // Rotação Y para encarar o centro.
      return { position: [x, 0, z] as [number, number, number], rotationY };
    });
  }, [angleStep, cardDistance]); // Recalcula se o ângulo ou distância mudarem.

  // Efeito para atualizar a rotação alvo do carrossel quando o activeIndex muda.
  useEffect(() => {
    const currentAngle = targetLogicalRotation.current; // Rotação atual.
    const targetAngleForActiveIndex = -activeIndex * angleStep; // Rotação alvo para o novo índice ativo.
    // Calcula a diferença de ângulo mais curta (considerando a natureza circular).
    let diff = (targetAngleForActiveIndex - currentAngle) % (Math.PI * 2);
    if (diff > Math.PI) diff -= (Math.PI * 2); // Garante que a rotação seja pelo caminho mais curto.
    else if (diff < -Math.PI) diff += (Math.PI * 2); // Idem.
    targetLogicalRotation.current = currentAngle + diff; // Define a nova rotação alvo.

    // Se você quiser que o OrbitControls também olhe para o centro quando um novo card é ativo:
    // if (orbitRef.current) {
    //   orbitRef.current.target.lerp(new THREE.Vector3(0, 0.5, 0), 0.1); // Suavemente volta o target para o centro
    //   orbitRef.current.update();
    // }

  }, [activeIndex, angleStep]); // Dependências: activeIndex e angleStep.

  // Renderiza o Canvas do React Three Fiber.
  return (
       <Canvas // Componente principal para a cena 3D.
         camera={{ position: [0, 0.8, 11], fov: 50 }} // Configuração da câmera.
         style={{ display: 'block', width: '100%', height: '100%' }} // Estilo para preencher o container.
         shadows // Habilita sombras na cena.
       >
          {/* Cor de fundo da cena, baseada no tema. */}
          <color attach="background" args={[theme.palette.background.default as string]} />
          {/* Neblina para dar profundidade à cena. */}
          <fog attach="fog" args={[theme.palette.background.default as string, 10, 25]} />
          {/* Luz ambiente para iluminar a cena de forma geral. */}
          <ambientLight intensity={theme.palette.mode === 'dark' ? 0.9 : 1.4} />
          {/* Luz pontual para criar destaques e sombras. */}
          <pointLight position={[10, 10, 10]} intensity={theme.palette.mode === 'dark' ? 0.7 : 0.5} castShadow shadow-bias={-0.0001}/>
          {/* Luz pontual secundária para preenchimento. */}
          <pointLight position={[-10, -5, -15]} intensity={0.4} color={theme.palette.secondary.main} />
          {/* Luz direcional para simular luz solar e projetar sombras mais nítidas. */}
          <directionalLight position={[0, 8, 5]} intensity={theme.palette.mode === 'dark' ? 0.6 : 0.4} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.0001}/>
          {/* Componente Stars do Drei para um fundo estrelado (com Suspense). */}
          <Suspense fallback={null}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          </Suspense>
          {/* Renderiza a galeria de projetos. */}
          <ProjectGallery
            activeIndex={activeIndex} // Passa o índice ativo.
            setActiveIndex={setActiveIndex} // Passa a função para definir o índice ativo.
            cardTransforms={cardTransforms} // Passa as transformações dos cards.
            targetRotationRef={targetLogicalRotation} // Passa a referência da rotação alvo.
          />
          {/* Controles de órbita para permitir interação do usuário com a câmera. */}
           <OrbitControls
              ref={orbitRef} // Referência para os controles.
              enableZoom={true} // Permite zoom.
              enablePan={false} // Desabilita pan (arrastar a cena).
              enableRotate={true} // Permite rotação. (Esta é a rotação principal da câmera, não do card individual)
              minDistance={7} // Distância mínima de zoom.
              maxDistance={18} // Distância máxima de zoom.
              minPolarAngle={Math.PI / 3.8} // Ângulo polar mínimo.
              maxPolarAngle={Math.PI / 1.8} // Ângulo polar máximo.
              target={new THREE.Vector3(0, 0.5, 0)} // Ponto para onde a câmera olha (fixo no centro da galeria).
              dampingFactor={0.05} // Fator de amortecimento.
              rotateSpeed={0.4} // Velocidade de rotação.
              // Para evitar que o clique no card mude o target do orbit controls:
              // Se o comportamento persistir, pode ser necessário um event listener no canvas
              // e verificar se o clique foi em um card vs. no background para controlar o orbit.
              // Mas normalmente, parar a propagação do evento de clique do card (já feito)
              // e manter o target fixo é suficiente.
           />
       </Canvas>
  );
}

// Carregamento dinâmico do componente ThreeSceneContainer (melhora performance inicial).
const DynamicThreeScene = dynamic(() => Promise.resolve(ThreeSceneContainer), { // Envolve o componente para carregamento dinâmico.
  ssr: false, // Desabilita renderização no lado do servidor.
  // Componente de loading a ser exibido enquanto a cena 3D carrega.
  loading: () => <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '500px', width: '100%' }}><CircularProgress size={50} /></Box>,
});

// Componente principal da Seção de Projetos.
export default function ProjectsSection({ id }: { id?: string }) { // Recebe um ID opcional.
  const theme = useTheme<Theme>(); // Hook para acessar o tema.
  const [activeIndex, setActiveIndex] = useState(0); // Estado para o índice do projeto ativo.

  // Função para navegar entre projetos.
  const handleNavigate = useCallback((direction: 'next' | 'prev') => {
    setActiveIndex((prev) => { // Atualiza o activeIndex.
        const newIndex = direction === 'next'
            ? (prev + 1) % numProjects // Próximo.
            : (prev - 1 + numProjects) % numProjects; // Anterior.
        return newIndex;
    });
  }, []); // numProjects é constante global.

  // Renderização da seção de projetos.
  return (
    <Box component="section" id={id} // Elemento <section> com ID.
      sx={{
        minHeight: '750px', // Altura mínima.
        height: 'calc(100vh - 80px)', // Altura da viewport menos um header.
        maxHeight: '1100px', // Altura máxima.
        bgcolor: theme.palette.background.default, // Cor de fundo do tema.
        overflow: 'hidden', // Esconde overflow.
        position: 'relative', // Posição relativa.
        display: 'flex', // Flexbox.
        flexDirection: 'column', // Layout vertical.
        py: { xs: 5, md: 8 }, // Padding vertical responsivo.
        marginTop: '40px', // Margem no topo da seção.
      }}
    >
      {/* Título da Seção */}
      <Box sx={{ px:{ xs: 2, sm: 3, md: 4 }, mb: { xs: 3, md: 4 } }}> {/* Padding e margem. */}
        {/* Animação de entrada para o título */}
        <motion.div variants={sectionTitleVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <Typography variant="h2" component="h2" sx={{ textAlign: 'center', color: 'primary.main', fontWeight: 700 }}>
            Meus Projetos e Atuações
          </Typography>
        </motion.div>
      </Box>

      {/* Container Flex para o Canvas 3D e Botões de Navegação */}
      <Box
        sx={{
          width: '100%', // Largura total.
          maxWidth: { xs: '100vw', sm: '95vw', md: '90vw', lg: '85vw' }, // Largura máxima responsiva.
          flexGrow: 1, // Ocupa espaço vertical.
          mx: 'auto', // Centraliza horizontalmente.
          display: 'flex', // Flexbox.
          flexDirection: 'column', // Layout vertical.
          alignItems: 'center', // Centraliza filhos horizontalmente.
          minHeight: 0, // Necessário para flexGrow.
        }}
      >
        {/* Container para a Cena 3D (Canvas) */}
        <Box
            sx={{
                width: '100%', // Largura total.
                height: 'auto', // Altura automática.
                minHeight: '500px', // Altura mínima.
                flexGrow: 1, // Faz a área do canvas crescer.
                position: 'relative', // Posição relativa.
                // O cursor aqui é controlado pelo ProjectCard3D e OrbitControls
            }}
        >
            {/* ErrorBoundary para a cena 3D. */}
            <ErrorBoundary fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}><Typography color="error">Não foi possível carregar a visualização 3D.</Typography></Box>}>
              {/* Suspense para o carregamento da cena. */}
              <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}><CircularProgress size={50}/></Box>}>
                {/* Cena 3D dinâmica. */}
                <DynamicThreeScene activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
              </Suspense>
            </ErrorBoundary>
        </Box>

        {/* Container para os Botões de Navegação */}
        <Box sx={{ display: 'flex', gap: {xs: 2, sm: 3} }}> {/* Botões com espaçamento. */}
              {/* Botão Anterior */}
              <IconButton
                onClick={() => handleNavigate('prev')} // Ação de clique.
                aria-label="Projeto anterior" // Acessibilidade.
                sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.75), color: 'primary.contrastText',
                    p: {xs: 1, sm: 1.2}, transform: 'scale(0.9)',
                    transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 1), transform: 'scale(1)' }
                }}
              >
                <NavigateBeforeIcon fontSize='medium' /> {/* Ícone. */}
              </IconButton>
              {/* Botão Próximo */}
              <IconButton
                onClick={() => handleNavigate('next')} // Ação de clique.
                aria-label="Próximo projeto" // Acessibilidade.
                sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.75), color: 'primary.contrastText',
                    p: {xs: 1, sm: 1.2}, transform: 'scale(0.9)',
                    transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 1), transform: 'scale(1)' }
                 }}
              >
                <NavigateNextIcon fontSize='medium'/> {/* Ícone. */}
              </IconButton>
          </Box>
      </Box> {/* Fim do Container Flex Canvas/Setas */}
    </Box> // Fim do Container da Seção
  );
}
