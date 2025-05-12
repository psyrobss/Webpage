'use client';
import React, { useCallback, memo, useMemo } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';
import type { ISourceOptions } from 'tsparticles-engine';
import { useTheme } from '@mui/material/styles'; 
import dynamic from 'next/dynamic';

interface ParticlesComponentProps {
    options?: Partial<ISourceOptions>;
    id: string;
    style?: React.CSSProperties;
}

const ParticlesComponent = memo(({ options, id, style }: ParticlesComponentProps) => {
  const theme = useTheme(); // Hook para acessar o tema MUI atual

  const particlesInit = useCallback(async (engine: Engine) => {
    try {
        await loadFull(engine);
    } catch (error) {
        console.error("Failed to load tsparticles engine:", error);
    }
  }, []);

  // Opções padrão do componente, adaptando-se ao tema
  const defaultOptions: ISourceOptions = useMemo(() => ({
    fullScreen: { enable: false },
    background: {
      color: { value: 'transparent' }, // Fundo transparente por padrão
      opacity: 1,
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: { enable: true, mode: 'push' },
        onHover: { enable: true, mode: 'repulse' }, // Repulse no hover
      },
      modes: {
        push: { quantity: 3 },
        repulse: { distance: 80, duration: 0.4 },
      },
    },
    particles: {
      color: {
        // Partículas usam uma cor clara do tema, como o texto primário do modo escuro ou uma cor de destaque
        value: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.secondary.main,
      },
      links: {
        // Links usam uma cor sutil do tema, como a cor do divisor ou um tom de texto secundário
        color: theme.palette.divider,
        distance: 160,
        enable: true,
        opacity: theme.palette.mode === 'dark' ? 0.15 : 0.25,
        width: 1,
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: { default: 'bounce' }, // Partículas quicam nas bordas
        random: true,
        speed: 1.2, // Velocidade moderada
        straight: false,
      },
      number: {
        density: { enable: true, area: 1200 }, // Área maior para menos densidade aparente
        value: 50, // Menos partículas para um visual mais limpo
      },
      opacity: {
        value: { min: 0.2, max: 0.7 },
        animation: { enable: true, speed: 0.8, minimumValue: 0.1, sync: false },
      },
      shape: { type: 'circle' },
      size: {
        value: { min: 1, max: 3 },
        animation: { enable: true, speed: 3, minimumValue: 0.5, sync: false },
      },
    },
    detectRetina: true,
  }), [theme.palette.mode, theme.palette.text.primary, theme.palette.secondary.main, theme.palette.divider]); // Dependências do tema


  const finalOptions = useMemo(() => {
    const deepMerge = (target: Record<string, unknown>, source: Record<string, unknown>) => {
      for (const key of Object.keys(source)) {
          if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
            deepMerge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
          } else {
            target[key] = source[key];
          }
      }
      return target;
    };
    const merged = JSON.parse(JSON.stringify(defaultOptions)); 
    if (options) {
      return deepMerge(merged, options as Record<string, unknown>);
    }
    return merged;
  }, [defaultOptions, options]);

  const defaultContainerStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0, // Pode ser 0 ou 1 dependendo de como a seção pai está estruturada
        pointerEvents: 'none',
   };

  return (
    <Particles
      id={id}
      init={particlesInit}
      options={finalOptions}
      style={{ ...defaultContainerStyle, ...style }}
    />
  );
});

ParticlesComponent.displayName = 'ParticlesComponent';
export default dynamic(() => Promise.resolve(ParticlesComponent), { ssr: false });