// app/games/layout.tsx
import React from 'react';
import styles from './GamesPage.module.css'; // Importa o CSS Module

interface GamesLayoutProps {
  children: React.ReactNode;
}

export default function GamesLayout({ children }: GamesLayoutProps) {
  return (
    // Aplica a classe do container do layout
    <div className={styles.gamesLayoutContainer}>
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