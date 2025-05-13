// app/games/layout.tsx
import React from 'react';
import styles from './GamesPage.module.css'; // Importa o CSS Module
import BackButtonMUI from '../components/BackButtonMUI';

interface GamesLayoutProps {
  children: React.ReactNode;
}

export default function GamesLayout({ children }: GamesLayoutProps) {
  return (
    // Aplica a classe do container do layout
    <div className={styles.gamesLayoutContainer}>
      <BackButtonMUI/>
      {/* Aplica a classe do título principal */}
      <h1 className={styles.mainTitle}>Minha Coleção de Jogos</h1>
      <main>
        {children}
      </main>
    </div>
  );
}

export const metadata = {
  title: 'Coleção de Jogos | Meu Portfólio',
  description: 'Uma coleção de mini-jogos desenvolvidos como parte do meu aprendizado em programação.',
};