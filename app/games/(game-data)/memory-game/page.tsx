// app/games/(game-data)/memory-game/page.tsx
import React from 'react';
import MemoryGameComponent from './MemoryGame'; // Confirme o nome do componente
import type { Metadata } from 'next';

// Metadados para SEO e título da aba
export const metadata: Metadata = {
    title: 'Jogo da Memória | Meu Portfólio de Jogos',
    description: 'Jogue o clássico Jogo da Memória para encontrar pares de cartas.',
};

// Esta é a página que será renderizada na rota /games/memory-game
export default function MemoryGamePage() {
  return (
    <div>
      {/* O layout de /app/games/layout.tsx será aplicado automaticamente */}
      <MemoryGameComponent />
    </div>
  );
}