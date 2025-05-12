'use client';

import React, { useRef, useState, Suspense, useEffect, lazy, useCallback, JSX } from 'react';
import * as THREE from 'three';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Canvas, useFrame, type RootState } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  OrbitControls,
  Stars as DreiStars,
  Html,
  useProgress,
  Float,
  Billboard,
} from '@react-three/drei';
import styles from '../../styles/not-found-interactive.module.css';
import {
  useTheme,
  alpha,
  Box as MuiBox,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Slider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider,
  type Theme,
} from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import SettingsIcon from '@mui/icons-material/Settings';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';

// Loader simples para o Canvas
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center style={{ color: 'white', fontSize: '1em', fontFamily: 'monospace' }}>
      {Math.round(progress)}% procurando...
    </Html>
  );
}

// Palette 404
const PALETTE_404 = {
  background: '#0e0b14',
  starsColor: '#a5a5ef',
  textColor: '#c8c2f5',
  textSubtitleColor: '#a5a5ef',
  knotColor: '#63589d',
  fragmentColorAlt: '#5c7ada',
};

// Lista de modelos dinamicamente importados
const modelFiles = [
  'AlienModel', 'AlpakingModel', 'ArmabeeModel', 'BirbModel', 'BunnyModel',
  'CactoroModel', 'ChickenModel', 'DemonModel', 'DinoModel', 'DragonEvolvedModel',
  'DragonModel', 'FishModel', 'FrogModel', 'GhostModel', 'GhostSkullModel',
  'GlubEvolvedModel', 'GlubModel', 'GolelingEvolvedModel', 'GolelingModel',
  'GreenBlobModel', 'GreenSpikyBlobModel', 'HywirlModel', 'MonkrooseModel',
  'MushnubEvolvedModel', 'MushnubModel', 'MushroomKingModel', 'NinjaModel',
  'NinjaxGymeDpfTuModel', 'OrcEnemyModel', 'OrcModel', 'PigeonModel',
  'PinkBlobModel', 'SquidleModel', 'TribalModel', 'WizardModel', 'YetiModel',
];

// Interface para o módulo do modelo importado dinamicamente
interface ModelModule {
  default?: React.ComponentType<React.ComponentPropsWithoutRef<'group'>>;
  Model?: React.ComponentType<React.ComponentPropsWithoutRef<'group'>>;
}

// Carregamento lazy dos componentes
const modelComponents = modelFiles.map(fileName =>
  lazy(() =>
    import(`@/app/components/models/${fileName}`)
      .then((module: ModelModule) => { // Aplicando o tipo ModelModule
        if (module.default) return { default: module.default };
        if (module.Model) return { default: module.Model }; // Corrigido: sem 'as any'
        throw new Error(`Export padrão ou 'Model' ausente em ${fileName} - ${JSON.stringify(Object.keys(module))}`);
      })
      .catch(e => {
        console.error(`Falha ao carregar ${fileName}:`, e);
        // Retorna um componente que renderiza null, mas que satisfaz o tipo esperado por React.lazy
        return { default: () => null as JSX.Element | null };
      })
  )
);


// Props para cada monstro
interface MonsterInstanceProps {
  Model: React.ComponentType<React.ComponentPropsWithoutRef<'group'>>; // Pode ser um LazyExoticComponent
  initialPosition: [number, number, number];
  modelScale?: number;
  randomSeed: number;
  onMonsterClick: (monsterId: number, position: THREE.Vector3) => void;
  monsterId: number;
}

// Instância animada de cada monstro
function LostMonster({
  Model,
  initialPosition,
  modelScale = 0.5,
  randomSeed,
  onMonsterClick,
  monsterId
}: MonsterInstanceProps) {
  const ref = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const targetPosition = useRef(new THREE.Vector3(...initialPosition));
  const timeToChangeDirection = useRef(Math.random() * 5 + 3);

  useFrame((state: RootState, delta: number) => {
    if (!ref.current) return;
    // Movimento suave e rotação
    ref.current.position.lerp(targetPosition.current, delta * 0.3);
    ref.current.rotation.y += delta * (0.1 + Math.sin(randomSeed * 10 + state.clock.elapsedTime * 0.1) * 0.05);
    ref.current.rotation.x += delta * (0.05 + Math.cos(randomSeed * 7 + state.clock.elapsedTime * 0.07) * 0.03);
    ref.current.rotation.z += delta * (0.03 + Math.sin(randomSeed * 13 + state.clock.elapsedTime * 0.09) * 0.02);

    // Troca de direção periódica
    timeToChangeDirection.current -= delta;
    if (timeToChangeDirection.current <= 0) {
      const bounds = 2.8;
      targetPosition.current.set(
        (Math.random() - 0.5) * bounds * 2,
        initialPosition[1] + (Math.random() - 0.5) * bounds * 0.4,
        (Math.random() - 0.5) * bounds * 2
      );
      timeToChangeDirection.current = Math.random() * 4 + 4;
    }

    // Animação de hover
    const targetHoverScale = isHovered ? modelScale * 1.15 : modelScale;
    ref.current.scale.lerp(new THREE.Vector3(targetHoverScale, targetHoverScale, targetHoverScale), delta * 8);
  });

  const handleClick = () => {
    if (ref.current) {
      onMonsterClick(monsterId, ref.current.position.clone());
    }
  };

  return (
    <Float speed={0.6 + randomSeed * 0.4} rotationIntensity={0.2} floatIntensity={0.2}>
      <group
        ref={ref}
        position={initialPosition}
        scale={modelScale}
        onPointerOver={() => { setIsHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setIsHovered(false); document.body.style.cursor = 'default'; }}
        onClick={handleClick}
      >
        <Suspense fallback={<Html center><CircularProgress size={12} sx={{ color: 'white' }} /></Html>}>
          <Model castShadow receiveShadow />
        </Suspense>
      </group>
    </Float>
  );
}

// Tipo para as informações dos monstros selecionados
interface SelectedMonsterInfo {
  Component: React.LazyExoticComponent<React.ComponentType<React.ComponentPropsWithoutRef<'group'>>>;
  seed: number;
  id: number;
}

// Adicionando tipo para accent se for customizado (coloque em um arquivo .d.ts global se preferir)
// Se `accent` não for uma cor customizada na sua paleta, você pode remover esta parte.
// Esta é uma suposição baseada no uso de `muiTheme.palette.accent`.
declare module '@mui/material/styles' {
    interface Palette {
      accent: Palette['primary'];
    }
    interface PaletteOptions {
      accent?: PaletteOptions['primary'];
    }
  }
  
  declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
      accent: true;
    }
  }

const NotFoundPageInteractive = () => {
  const muiTheme = useTheme<Theme>(); // Especificar Theme para melhor type-safety
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isClient, setIsClient] = useState(false);
  
  const [selectedMonstersInfo, setSelectedMonstersInfo] = useState<SelectedMonsterInfo[]>([]);
  const [activePhrase, setActivePhrase] = useState<{ id: number; text: string; position: THREE.Vector3 } | null>(null);
  const [numMonsters, setNumMonsters] = useState(3);
  const [controlsDrawerOpen, setControlsDrawerOpen] = useState(false);
  const [autoRotateCanvas, setAutoRotateCanvas] = useState(true);
  const orbitControlsRef = useRef<OrbitControlsImpl>(null);

  const generateMonsters = useCallback(() => {
    // Filtra componentes que podem ter falhado ao carregar (embora o catch já retorne um componente nulo)
    const validModelComponents = modelComponents.filter(
        (Comp): Comp is React.LazyExoticComponent<React.ComponentType<React.ComponentPropsWithoutRef<'group'>>> => 
        typeof Comp !== 'undefined' && Comp !== null
    );

    const shuffled = [...validModelComponents].sort(() => 0.5 - Math.random());
    const selection = shuffled
      .slice(0, Math.min(numMonsters, shuffled.length))
      .map((Component, index) => ({ Component, seed: Math.random(), id: index }));
    setSelectedMonstersInfo(selection);
    setActivePhrase(null);
  }, [numMonsters]); // modelComponents é estável após a definição inicial

  useEffect(() => {
    setIsClient(true);
    generateMonsters();
  }, [generateMonsters]);

  const handleMonsterClick = (monsterId: number, position: THREE.Vector3) => {
    setActivePhrase({
      id: monsterId,
      text: `Você encontrou o monstrinho #${monsterId}!`,
      position
    });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const xNorm = (event.clientX / window.innerWidth - 0.5) * 20;
    const yNorm = (event.clientY / window.innerHeight - 0.5) * 20;
    mouseX.set(xNorm);
    mouseY.set(yNorm);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const springConfig = { stiffness: 80, damping: 15 };
  const rotateX = useSpring(useTransform(mouseY, [-10, 10], [-2, 2]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-10, 10], [2, -2]), springConfig);
  const resetCamera = () => {
    if (orbitControlsRef.current) orbitControlsRef.current.reset();
  };

  if (!isClient) {
    return (
      <MuiBox
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: PALETTE_404.background
        }}
      >
        <CircularProgress color="secondary" />
      </MuiBox>
    );
  }

  const drawerContent = (
    <MuiBox sx={{ width: 280, p: 2 }} role="presentation">
      <Typography variant="h6" gutterBottom>
        Configurações da Cena
      </Typography>
      <Divider sx={{ my: 1 }} />
      <List>
        <ListItem>
          <ListItemIcon>
            <CasinoIcon />
          </ListItemIcon>
          <ListItemText primary="Número de Monstros" />
        </ListItem>
        <ListItem>
          <Slider
            value={numMonsters}
            onChange={(_, newValue) => typeof newValue === 'number' && setNumMonsters(newValue)}
            aria-labelledby="monster-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={Math.min(8, modelComponents.filter(Boolean).length)}
            sx={{ ml: 1, mr: 1, flexGrow: 1 }}
            color="secondary"
          />
        </ListItem>
        <ListItem>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            color="secondary"
            onClick={() => {
              generateMonsters();
              setControlsDrawerOpen(false);
            }}
            startIcon={<CasinoIcon />}
          >
            Gerar Novos Monstros
          </Button>
        </ListItem>
        <Divider sx={{ my: 2 }} />
        <ListItem>
          <ListItemIcon>
            <AutoAwesomeMotionIcon />
          </ListItemIcon>
          <ListItemText primary="Auto-Rotação da Cena" />
          <Switch
            edge="end"
            onChange={() => setAutoRotateCanvas(!autoRotateCanvas)}
            checked={autoRotateCanvas}
            color="secondary"
          />
        </ListItem>
        <ListItem>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            color="primary" // Supondo que 'primary' existe, 'accent' também poderia ser usado se definido
            onClick={() => {
              resetCamera();
              setControlsDrawerOpen(false);
            }}
            startIcon={<RestartAltIcon />}
          >
            Resetar Câmera
          </Button>
        </ListItem>
      </List>
    </MuiBox>
  );

  return (
    <motion.div
      className={styles.container}
      style={{ backgroundColor: PALETTE_404.background }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      suppressHydrationWarning={true} // Adicionado para evitar avisos de hidratação, se necessário
    >
      <IconButton
        onClick={() => setControlsDrawerOpen(true)}
        sx={{
          position: 'absolute',
          top: { xs: 15, sm: 20 },
          right: { xs: 15, sm: 20 },
          zIndex: 20,
          bgcolor: alpha(muiTheme.palette.background.paper, 0.7),
          backdropFilter: 'blur(4px)',
          color: 'text.primary',
          '&:hover': { bgcolor: alpha(muiTheme.palette.background.paper, 0.9) }
        }}
        aria-label="configurações da cena"
      >
        <SettingsIcon />
      </IconButton>
      <Drawer
        anchor="right"
        open={controlsDrawerOpen}
        onClose={() => setControlsDrawerOpen(false)}
        PaperProps={{ sx: { bgcolor: 'background.default' } }}
      >
        {drawerContent}
      </Drawer>

      <MuiBox
        sx={{
          width: '100%',
          height: { xs: '45vh', sm: '50vh', md: '55vh' },
          maxHeight: '600px',
          zIndex: 2,
          mb: 2,
          mt: { xs: 4, sm: 2 }
        }}
      >
        <Canvas camera={{ position: [0, 1.5, 8], fov: 50 }} dpr={[1, 1.5]} shadows>
          <color attach="background" args={[PALETTE_404.background]} />
          <fog attach="fog" args={[PALETTE_404.background, 8, 20]} />
          <ambientLight intensity={0.4} color={PALETTE_404.starsColor} />
          <hemisphereLight
            intensity={0.3}
            groundColor={muiTheme.palette.primary.dark}
            color={muiTheme.palette.secondary.light}
          />
          <directionalLight
            castShadow
            position={[10, 15, 10]}
            intensity={1.2}
            color="#fffada"
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <directionalLight position={[-5, 5, -10]} intensity={0.2} color={muiTheme.palette.secondary.main} />
          {/* Verifique se muiTheme.palette.accent existe e está tipado, ou use outra cor */}
          <pointLight
            position={[0, 5, 0]}
            intensity={0.5}
            color={muiTheme.palette.accent?.light || muiTheme.palette.secondary.light} // Fallback se accent não existir
            distance={15}
            decay={1.5}
          />
          <Suspense fallback={<Loader />}>
            <DreiStars radius={80} depth={35} count={4000} factor={3.8} saturation={1} fade speed={0.2} />
            {selectedMonstersInfo.map(({ Component, seed, id: monsterId }, index) => {
              const angle = (index / selectedMonstersInfo.length) * Math.PI * 2 + seed * 0.6;
              const radius = 2.0 + seed * 1.0;
              const x = Math.cos(angle) * radius;
              const z = Math.sin(angle) * radius;
              const y = (seed - 0.5) * 0.9;
              const randomScale = 0.28 + seed * 0.3;
              return (
                <LostMonster
                  key={`${monsterId}-${seed}-${index}`}
                  Model={Component} // Component é um React.LazyExoticComponent
                  initialPosition={[x, y, z]}
                  modelScale={randomScale}
                  randomSeed={seed}
                  onMonsterClick={handleMonsterClick}
                  monsterId={monsterId}
                />
              );
            })}
            {activePhrase && (
              <Billboard position={activePhrase.position} follow lockX={false} lockY={false} lockZ={false}>
                <Html center>
                  <MuiBox
                    sx={{
                      background: alpha(muiTheme.palette.background.paper, 0.85),
                      color: muiTheme.palette.text.primary,
                      p: '8px 15px',
                      borderRadius: '8px',
                      fontSize: '0.9em',
                      backdropFilter: 'blur(3px)',
                      boxShadow: muiTheme.shadows[3],
                      maxWidth: '200px',
                      textAlign: 'center'
                    }}
                  >
                    {activePhrase.text}
                  </MuiBox>
                </Html>
              </Billboard>
            )}
            <OrbitControls
              ref={orbitControlsRef}
              enableZoom
              enablePan
              autoRotate={autoRotateCanvas}
              autoRotateSpeed={0.1}
              maxPolarAngle={Math.PI / 1.6}
              minPolarAngle={Math.PI / 3}
              minDistance={2.5}
              maxDistance={13}
              target={[0, 0.3, 0]}
              dampingFactor={0.05}
            />
          </Suspense>
        </Canvas>
      </MuiBox>

      <motion.div
        className={styles.content}
        style={{
          rotateX,
          rotateY,
          zIndex: 3,
          backgroundColor: alpha(PALETTE_404.background, 0.2),
          backdropFilter: 'blur(3px)'
        }}
      >
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
        >
          <Typography
            variant="h1"
            className={styles.title}
            sx={{ color: PALETTE_404.textColor, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
          >
            Oops! Espaço Desconhecido! 🚀
          </Typography>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
          <Typography
            variant="body1"
            className={styles.subtitle}
            sx={{ color: PALETTE_404.textSubtitleColor, mb: 3 }}
          >
            Parece que navegamos para um lugar desconhecido... ou essa página não existe (ainda).
            <br />
            Observe os seres perdidos acima ou use o link abaixo para se transportar para a Home.
          </Typography>
        </motion.div>
        <motion.a
          href="/"
          className={styles.button}
          style={{ textDecoration: 'none' }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button
            variant="contained" // "pill" não é um variant padrão. Usando "contained" ou defina "pill" no tema.
            color={(muiTheme.palette.accent ? 'accent' : (muiTheme.palette.mode === 'dark' ? 'secondary' : 'primary')) as 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' } // Cast para tipo esperado se 'accent' for custom
            size="large"
            sx={{
              borderRadius: '50px', // Para simular "pill"
              minWidth: '220px',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: `0px 0px 20px ${alpha(
                  (muiTheme.palette.accent ? muiTheme.palette.accent.main : 
                    (muiTheme.palette.mode === 'dark'
                    ? muiTheme.palette.secondary.main
                    : muiTheme.palette.primary.main)), // Fallback para primary/secondary se accent não existir
                  0.6
                )}`
              },
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
          >
            Me leve para a Home! ✨
          </Button>
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

export default NotFoundPageInteractive;