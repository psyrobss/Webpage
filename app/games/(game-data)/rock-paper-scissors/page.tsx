// app/games/(game-data)/rock-paper-scissors/page.tsx
import React from 'react';
import RockPaperScissorsGame from './RockPaperScissorsGame'; // Importa o componente do jogo
import type { Metadata } from 'next';

// Metadados para SEO e título da aba
export const metadata: Metadata = {
    title: 'Pedra, Papel e Tesoura | Meu Portfólio de Jogos',
    description: 'Jogue Pedra, Papel e Tesoura contra o computador.',
};

// Esta é a página que será renderizada na rota /games/rock-paper-scissors
export default function RockPaperScissorsPage() {
  return (
    <div>
      {/* O layout de /app/games/layout.tsx será aplicado automaticamente */}
      <RockPaperScissorsGame />
    </div>
  );
}