// app/games/jogo-da-velha/page.tsx
import React from 'react';
import TicTacToeGame from './TicTacToe'; // Importa o componente do Jogo da Velha

// Metadados para SEO e título da aba
export const metadata = {
    title: 'Jogo da Velha | Meu Portfólio de Jogos',
    description: 'Jogue o clássico Jogo da Velha (Tic-Tac-Toe) criado com React e Framer Motion.',
};

// Esta é a página que será renderizada na rota /games/jogo-da-velha
export default function JogoDaVelhaPage() {
  return (
    <div>
      {/* Renderiza o componente do jogo */}
      <TicTacToeGame />
    </div>
    // Obs: O layout de /app/games/layout.tsx (com o título "Minha Coleção de Jogos")
    // será aplicado automaticamente em volta desta página.
  );
}