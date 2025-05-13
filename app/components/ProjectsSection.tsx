'use client';
import React, { useState, useRef, Suspense, useMemo, useEffect, useCallback, Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Typography, Box, useTheme, alpha, IconButton, CircularProgress, type Theme } from '@mui/material';
import dynamic from 'next/dynamic';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

import * as THREE from 'three';
import { Canvas, useFrame, type RootState, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { OrbitControls, Image as DreiImage, Text as DreiText, Plane, Stars } from '@react-three/drei';

import type { Group, MeshStandardMaterial, Object3DEventMap } from 'three';

const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '';


// --- Error Boundary ---
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Erro capturado pelo ErrorBoundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <Typography color="error">Ocorreu um erro ao carregar esta parte.</Typography>;
    }
    return this.props.children;
  }
}
// --- Fim Error Boundary ---

// Declaração de Módulo para Extensão da Palette
declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
  }
  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
  }
}

// Interface Project
interface Project {
  title: string;
  description: string;
  image: string;
  link?: string;
  tags?: string[];
  detailsLink?: string;
}

// Dados dos Projetos
const projectsData: Project[] = [
  { title: 'Análise Preditiva em Psicologia', description: 'Exploração aprofundada de dados psicológicos complexos utilizando Python, R e algoritmos de Machine Learning (como regressão, classificação e clustering) para identificar padrões, prever tendências comportamentais e otimizar intervenções terapêuticas personalizadas.', image: '/images/projects/data-analysis-psych.jpg', tags: ['Análise de Dados', 'Python', 'R', 'Machine Learning'], detailsLink: '/projetos/análise-de-dados-psicológicos' },
  { title: 'Terapia Cognitivo-Comportamental (TCC)', description: 'Aplicação clínica da TCC, uma abordagem baseada em evidências, para tratar diversos transtornos (ansiedade, depressão, etc.). Foco na reestruturação de pensamentos disfuncionais, desenvolvimento de estratégias de enfrentamento adaptativas e promoção da saúde mental resiliente.', image: '/images/projects/cognitive-therapy.jpg', tags: ['TCC', 'Psicodiagnóstico', 'Saúde Mental'], detailsLink: '/projetos/avaliação-e-terapia-cognitiva' },
  { title: 'Apoio Terapêutico Psicodélico', description: 'Acompanhamento ético e especializado para indivíduos em jornadas com psicodélicos (em contextos legais e seguros). Foco na preparação pré-sessão, suporte durante a experiência e integração pós-sessão para maximizar benefícios terapêuticos e minimizar riscos.', image: '/images/projects/psychedelic-support.jpg', tags: ['Psicodélicos', 'Integração', 'Redução de Danos'], detailsLink: '/projetos/terapia-em-psicodelicos' },
  { title: 'Escala de Autoconsciência (Validação)', description: 'Desenvolvimento e validação psicométrica rigorosa de um instrumento inovador para mensurar múltiplas dimensões da autoconsciência. Utilização de análise fatorial e teoria de resposta ao item para garantir confiabilidade e validade, contribuindo para pesquisa e avaliação clínica.', image: '/images/projects/self-awareness-scale.jpg', tags: ['Psicometria', 'Validação', 'Pesquisa'], detailsLink: '/projetos/autoconsciência' },
  { title: 'Chatbot de Suporte com IA', description: 'Protótipo de um assistente virtual baseado em Grandes Modelos de Linguagem (LLMs) para oferecer suporte emocional inicial, psicoeducação interativa e triagem básica. Explora o potencial da Inteligência Artificial como ferramenta complementar na promoção do bem-estar mental.', image: '/images/projects/ai-chatbot-therapy.jpg', tags: ['IA', 'LLM', 'Chatbot', 'Saúde Mental Tech'], detailsLink: '/projetos/chatbot-com-ia' },
];
const numProjects = projectsData.length; // Calculado aqui para uso em ProjectsSection



// Variantes de Animação
const sectionTitleVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Props do ProjectCard3D
interface ProjectCard3DProps {
  project: Project;
  isActive: boolean;
  onClick: (event: ThreeEvent<MouseEvent>) => void;
  position: [number, number, number];
  rotationY: number;
}

// Componente ProjectCard3D (Sem alterações nesta versão)
function ProjectCard3D({ project, isActive, onClick, position, rotationY }: ProjectCard3DProps) {
  const theme = useTheme<Theme>();
  const groupRef = useRef<Group<Object3DEventMap>>(null);
  const [isHovered, setIsHovered] = useState(false);

  // --- Card Dimensions ---
  const cardWidth = 3.5;
  const cardHeight = 4.5;
  const imageAspectRatio = 16 / 9;
  const imageWidth = cardWidth * 0.9;
  const imageHeight = imageWidth / imageAspectRatio;
  const imagePaddingTop = 0.15;
  const imagePosY = (cardHeight / 2) - imagePaddingTop - (imageHeight / 2);

  // --- Text Area Dimensions & Position ---
  const textAreaPadding = 0.2;
  const textAreaHeight = cardHeight - imageHeight - imagePaddingTop - textAreaPadding * 2;
  const textAreaWidth = cardWidth * 0.95;
  const textAreaPosY = imagePosY - (imageHeight / 2) - textAreaPadding - (textAreaHeight / 2);
  const textZOffset = 0.015;

  // --- Font Sizes & Line Heights ---
  const TITLE_FONT_SIZE = 0.18;
  const TITLE_LINE_HEIGHT = 1.2;
  const DESC_FONT_SIZE = 0.11;
  const DESC_LINE_HEIGHT = 1.4;
  const TAG_FONT_SIZE = 0.08;
  const LINK_FONT_SIZE = 0.10;

  // --- Margins ---
  const MARGIN_TITLE_DESC = 0.25;
  const MARGIN_TAGS_LINK = 0.12;

  // --- Colors & Material (Memoized) ---
  const memoizedColors = useMemo(() => ({
    paper: theme.palette.background.paper,
    textPrimary: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
    secondaryMain: theme.palette.secondary.main,
    secondaryLight: theme.palette.secondary.light,
    accentMain: theme.palette.accent?.main || theme.palette.primary.main,
  }), [theme]);

  const memoizedMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: memoizedColors.paper,
    metalness: 0.1,
    roughness: 0.8,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide
  }) as MeshStandardMaterial, [memoizedColors.paper]);

  // --- Animation Frame Logic ---
  useFrame((state: RootState, delta: number) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4 + position[0] * 0.5) * 0.08;
      const targetScale = isActive ? 1.08 : (isHovered ? 1.03 : 1);
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 6);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, rotationY, 0]}
      onClick={onClick}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setIsHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setIsHovered(false); document.body.style.cursor = 'default'; }}
    >
      <Plane args={[cardWidth, cardHeight]} material={memoizedMaterial} castShadow receiveShadow/>
      <Suspense fallback={null}>
        <DreiImage
            url={project.image}
            scale={[imageWidth, imageHeight]}
            position={[0, imagePosY, 0.01]}
            transparent
            opacity={0.95}
        />
      </Suspense>
      <group position={[0, textAreaPosY, textZOffset]}>
            <DreiText
                color={memoizedColors.textPrimary}
                anchorX="center" anchorY="top"
                position={[0, textAreaHeight / 2, 0]}
                fontSize={TITLE_FONT_SIZE} maxWidth={textAreaWidth * 0.9} lineHeight={TITLE_LINE_HEIGHT}
                textAlign="center" outlineColor={theme.palette.background.default} outlineWidth={0.002} fontWeight={600}
            > {project.title} </DreiText>
            <DreiText
                color={memoizedColors.textSecondary}
                anchorX="center" anchorY="top"
                position={[0, textAreaHeight / 2 - (TITLE_FONT_SIZE * TITLE_LINE_HEIGHT) - MARGIN_TITLE_DESC, 0]}
                fontSize={DESC_FONT_SIZE} maxWidth={textAreaWidth * 0.9} lineHeight={DESC_LINE_HEIGHT}
                textAlign="justify"
            > {project.description.substring(0, 150) + (project.description.length > 150 ? "..." : "")} </DreiText>
            {project.detailsLink && (
                <DreiText
                    color={memoizedColors.accentMain}
                    anchorX="center" anchorY="bottom"
                    position={[0, -textAreaHeight / 2, 0]}
                    fontSize={LINK_FONT_SIZE}
                    onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); if (project.detailsLink) window.open(project.detailsLink, '_self'); }}
                    onPointerOver={(e: ThreeEvent<PointerEvent>) => e.stopPropagation()}
                    onPointerEnter={() => document.body.style.cursor = 'pointer'}
                    onPointerLeave={() => document.body.style.cursor = 'default'}
                > Ver Detalhes [→] </DreiText>
            )}
            {project.tags && project.tags.length > 0 && (
                 <group position={[0, -textAreaHeight / 2 + LINK_FONT_SIZE + MARGIN_TAGS_LINK, 0]} >
                    {project.tags.slice(0, 3).map((tag, i) => {
                        const displayedTagsCount = project.tags!.slice(0, 3).length;
                        const xPos = (i - (displayedTagsCount - 1) / 2) * (textAreaWidth / (displayedTagsCount + 1) * 0.8);
                        return ( <DreiText key={tag} color={memoizedColors.secondaryLight} fontSize={TAG_FONT_SIZE} anchorX="center" anchorY="bottom" position={[xPos, 0, 0]} > #{tag} </DreiText> );
                    })}
                </group>
            )}
       </group>
    </group>
  );
}

// Props da ProjectGallery (Adicionado setActiveIndex)
interface ProjectGalleryProps {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>; // Necessário para o onClick do card
  cardTransforms: { position: [number, number, number]; rotationY: number }[];
  targetRotationRef: React.MutableRefObject<number>;
}

// Componente ProjectGallery (Recebe setActiveIndex)
function ProjectGallery({ activeIndex, setActiveIndex, cardTransforms, targetRotationRef }: ProjectGalleryProps) {
  const groupRef = useRef<Group<Object3DEventMap>>(null);

  useFrame((_state: RootState, delta: number) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationRef.current, delta * 4);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {projectsData.map((project, index) => (
        <ProjectCard3D
          key={project.title + index + (project.tags ? project.tags.join('') : '')}
          project={project}
          isActive={index === activeIndex}
          // O clique no card ainda precisa atualizar o índice ativo
          onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); setActiveIndex(index);}}
          position={cardTransforms[index].position}
          rotationY={cardTransforms[index].rotationY}
        />
      ))}
    </group>
  );
}

// Props do ThreeSceneContainer (Adicionado activeIndex e setActiveIndex)
interface ThreeSceneContainerProps {
    activeIndex: number;
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

// Componente ThreeSceneContainer (Recebe props, remove botões e lógica de navegação)
function ThreeSceneContainer({ activeIndex, setActiveIndex }: ThreeSceneContainerProps) {
  const theme = useTheme<Theme>();
  // Estado e lógica de navegação removidos daqui
  const cardDistance = 6.0;
  // numProjects não é mais necessário aqui
  const angleStep = useMemo(() => (Math.PI * 2) / numProjects, []); // numProjects é global agora
  const targetLogicalRotation = useRef(0);
  const orbitRef = useRef<OrbitControlsImpl>(null);

  const cardTransforms = useMemo(() => {
    return projectsData.map((_, index) => {
      const angle = index * angleStep;
      const x = Math.sin(angle) * cardDistance;
      const z = Math.cos(angle) * cardDistance;
      const rotationY = Math.atan2(x, z);
      return { position: [x, 0, z] as [number, number, number], rotationY };
    });
  }, [angleStep, cardDistance]);

  // useEffect para atualizar targetLogicalRotation baseado no activeIndex (prop)
  useEffect(() => {
    const currentAngle = targetLogicalRotation.current;
    const targetAngleForActiveIndex = -activeIndex * angleStep;
    let diff = (targetAngleForActiveIndex - currentAngle) % (Math.PI * 2);
    if (diff > Math.PI) diff -= (Math.PI * 2);
    else if (diff < -Math.PI) diff += (Math.PI * 2);
    targetLogicalRotation.current = currentAngle + diff;
  }, [activeIndex, angleStep]);

  // handleNavigate removido daqui

  return (
       // Box container principal removido, o Canvas será o elemento principal aqui
       // A altura/largura será definida pelo container pai em ProjectsSection
       <Canvas
         camera={{ position: [0, 1, 12], fov: 50 }}
         style={{ display: 'block', width: '100%', height: '100%' }} // Garante que o canvas preencha o container
         shadows
       >
          <color attach="background" args={[theme.palette.background.default as string]} />
          <fog attach="fog" args={[theme.palette.background.default as string, 12, 28]} />
          <ambientLight intensity={theme.palette.mode === 'dark' ? 0.8 : 1.3} />
          <pointLight position={[10, 10, 10]} intensity={theme.palette.mode === 'dark' ? 0.7 : 0.5} castShadow shadow-bias={-0.0001}/>
          <pointLight position={[-10, -5, -15]} intensity={0.4} color={theme.palette.secondary.main} />
          <directionalLight position={[0, 8, 5]} intensity={theme.palette.mode === 'dark' ? 0.6 : 0.4} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.0001}/>
          <Suspense fallback={null}>
            <Stars radius={120} depth={60} count={5000} factor={5} saturation={0} fade speed={0.8} />
          </Suspense>
          <ProjectGallery
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex} // Passa o setActiveIndex para a galeria
            cardTransforms={cardTransforms}
            targetRotationRef={targetLogicalRotation}
          />
           <OrbitControls
              ref={orbitRef}
              enableZoom={true} enablePan={false} enableRotate={true}
              minDistance={8} maxDistance={20}
              minPolarAngle={Math.PI / 3.5} maxPolarAngle={Math.PI / 1.7}
              target={[0, 0.5, 0]}
              dampingFactor={0.05} rotateSpeed={0.4}
           />
       </Canvas>
       // Box com os botões foi removido daqui
  );
}

// Carregamento dinâmico da cena 3D (Passa props adiante)
const DynamicThreeScene = dynamic(() => Promise.resolve(ThreeSceneContainer), {
  ssr: false,
  loading: () => <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '500px', width: '100%' }}><CircularProgress size={50} /></Box>,
});

// Componente Principal da Seção de Projetos (Gerencia estado e layout flex)
export default function ProjectsSection({ id }: { id?: string }) {
  const theme = useTheme<Theme>();
  // Estado de activeIndex elevado para este componente
  const [activeIndex, setActiveIndex] = useState(0);

  // handleNavigate definido aqui
  const handleNavigate = useCallback((direction: 'next' | 'prev') => {
    setActiveIndex((prev) => {
        const newIndex = direction === 'next'
            ? (prev + 1) % numProjects
            : (prev - 1 + numProjects) % numProjects;
        return newIndex;
    });
  }, []); // numProjects é constante global, não precisa de dependência aqui

  return (
    <Box component="section" id={id}
      sx={{
        minHeight: '750px',
        height: 'calc(100vh - 80px)', // Tenta ocupar a altura da viewport
        maxHeight: '1100px',
        bgcolor: theme.palette.background.default,
        overflow: 'hidden', // Garante que nada vaze
        position: 'relative', // Mantido por segurança, pode não ser estritamente necessário
        display: 'flex', // Habilita flexbox para o container principal da seção
        flexDirection: 'column', // Organiza título e área de conteúdo verticalmente
        py: { xs: 5, md: 8 },
      }}
    >
      {/* Título da Seção */}
      <Box sx={{ px:{ xs: 2, sm: 3, md: 4 }, mb: { xs: 2, md: 3 } }}> {/* Reduzir margem inferior do título */}
        <motion.div variants={sectionTitleVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <Typography variant="h2" component="h2" sx={{ textAlign: 'center', color: 'primary.main', fontWeight: 700 }}>
            Meus Projetos e Atuações
          </Typography>
        </motion.div>
      </Box>

      {/* Container Flex para Canvas e Setas */}
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100vw', sm: '95vw', md: '90vw', lg: '85vw' },
          flexGrow: 1, // Ocupa o espaço vertical restante
          mx: 'auto', // Centraliza horizontalmente
          display: 'flex', // **NOVO: Habilita Flexbox**
          flexDirection: 'column', // **NOVO: Organiza Canvas acima das Setas**
          alignItems: 'center', // **NOVO: Centraliza as setas horizontalmente**
          minHeight: 0, // Necessário para flexGrow funcionar corretamente em alguns cenários
        }}
      >
        {/* Container para a Cena 3D (para controlar tamanho e crescimento) */}
        <Box
            sx={{
                width: '100%',
                height: 'auto', // Altura automática baseada no conteúdo ou flex-grow
                minHeight: '500px', // Altura mínima para a cena
                flexGrow: 1, // **NOVO: Faz a área do canvas crescer**
                position: 'relative', // Necessário para o Suspense/ErrorBoundary talvez
                cursor: 'grab',
                '&:active': { cursor: 'grabbing' },
                mb: 2, // **NOVO: Margem abaixo do canvas, antes das setas**
            }}
        >
            <ErrorBoundary fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}><Typography color="error">Não foi possível carregar a visualização 3D.</Typography></Box>}>
              <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}><CircularProgress size={50}/></Box>}>
                {/* Passa activeIndex e setActiveIndex para a cena */}
                <DynamicThreeScene activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
              </Suspense>
            </ErrorBoundary>
        </Box>

        {/* Container das Setas (Agora irmão do container do canvas) */}
        <Box sx={{ display: 'flex', gap: {xs: 2, sm: 3} }}> {/* Não precisa mais de position absolute, zIndex, etc. */}
              <IconButton
                onClick={() => handleNavigate('prev')}
                aria-label="Projeto anterior"
                sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.75), color: 'primary.contrastText',
                    p: {xs: 1, sm: 1.2}, transform: 'scale(0.9)',
                    transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 1), transform: 'scale(1)' }
                }}
              >
                <NavigateBeforeIcon fontSize='medium' />
              </IconButton>
              <IconButton
                onClick={() => handleNavigate('next')}
                aria-label="Próximo projeto"
                sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.75), color: 'primary.contrastText',
                    p: {xs: 1, sm: 1.2}, transform: 'scale(0.9)',
                    transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 1), transform: 'scale(1)' }
                 }}
              >
                <NavigateNextIcon fontSize='medium'/>
              </IconButton>
          </Box>

      </Box> {/* Fim do Container Flex Canvas/Setas */}
    </Box> // Fim do Container da Seção
  );
}