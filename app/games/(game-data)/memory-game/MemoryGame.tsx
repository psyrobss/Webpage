// app/games/(game-data)/memory-game/MemoryGame.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MemoryGame.module.css';

const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '';

// --- Tipos ---
interface CardState {
  id: number;
  content: string;
  matchId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

// --- Configuração ---
const allEmojis = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
  '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦄',
  '🐞', '🦀', '🐠', '🐬', '🐳', '🐙', '🦋', '🍁', '🍄', '🌵',
  '🦉', '🐢', '🦂', '🦓', '🦒', '🦕', '🦖', '🦭', '🦈', '🐊',
  '🦌', '🐿️', '🕊️', '🦢', '🦩', '🐚', '🌴', '🌲', '🌺', '🌼'
];
const numberOfPairs = 10; // <<-- DEFINA O NÚMERO DE PARES AQUI (ex: 10 = 20 cartas)
// const totalCards = numberOfPairs * 2; // Removido - Não estava sendo usado
const flipDelay = 750; // Tempo (ms) que cartas não correspondentes ficam viradas
const columns = 5; // <<-- AJUSTE O NÚMERO DE COLUNAS PARA O LAYOUT (ex: 5 para 20 cartas)

// --- Função Auxiliar: Embaralhar Array (Fisher-Yates) ---
function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

// --- Componente Principal ---
export default function MemoryGameComponent() {
  const [cards, setCards] = useState<CardState[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Carregando...');
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Inicialização e Reset do Jogo ---
  const initializeGame = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const selectedEmojis = shuffleArray(allEmojis).slice(0, numberOfPairs);

    const initialCardContents: Omit<CardState, 'id' | 'isFlipped' | 'isMatched'>[] = [];
    selectedEmojis.forEach((content, index) => {
      initialCardContents.push({ content, matchId: index });
      initialCardContents.push({ content, matchId: index });
    });

    const shuffledContents = shuffleArray(initialCardContents);

    setCards(
      shuffledContents.map((item, index) => ({
        ...item,
        id: index,
        isFlipped: false,
        isMatched: false,
      }))
    );
    setFlippedIndexes([]);
    setMoves(0);
    setMatchedPairs(0);
    setGameOver(false);
    setStatusMessage('Encontre os pares!');
    setIsChecking(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (flippedIndexes.length !== 2) return;

    setIsChecking(true);
    setMoves((prevMoves) => prevMoves + 1);
    const [firstIndex, secondIndex] = flippedIndexes;
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];

    if (firstCard.matchId === secondCard.matchId) {
      setStatusMessage('Par encontrado! 🎉');
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.matchId === firstCard.matchId
            ? { ...card, isMatched: true }
            : card
        )
      );
      setMatchedPairs((prev) => prev + 1);
      setFlippedIndexes([]);
      setIsChecking(false);
    } else {
      setStatusMessage('Ops, tente novamente...');
      timeoutRef.current = setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card, index) =>
            flippedIndexes.includes(index) ? { ...card, isFlipped: false } : card
          )
        );
        setFlippedIndexes([]);
        setIsChecking(false);
        timeoutRef.current = null;
      }, flipDelay);
    }
     return () => {
         if (timeoutRef.current) {
             clearTimeout(timeoutRef.current);
         }
     }
  }, [flippedIndexes, cards]);

  useEffect(() => {
    if (cards.length > 0 && matchedPairs === numberOfPairs) {
      setGameOver(true);
      setStatusMessage(`Parabéns! Você venceu em ${moves} jogadas! 🏆`);
    }
  }, [matchedPairs, cards.length, moves]);

  const handleCardClick = (index: number): void => {
    if (gameOver || isChecking || cards[index].isFlipped || cards[index].isMatched || flippedIndexes.length === 2) {
      return;
    }

    setCards((prevCards) =>
      prevCards.map((card, i) =>
        i === index ? { ...card, isFlipped: true } : card
      )
    );

    setFlippedIndexes((prev) => [...prev, index]);
    setStatusMessage('');
  };

  // --- Animações ---
  const statusVariants = { // Definido para ser usado
    initial: { opacity: 0, y: -5 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 5, transition: { duration: 0.15 } },
    transition: { duration: 0.2 }
   };

  const resetButtonVariants = { // Definido e usado
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.3 }
  };

  const cardVariants = { // Definido e usado
      hidden: { opacity: 0, scale: 0.8 },
      visible: (i: number) => ({
          opacity: 1,
          scale: 1,
          transition: {
              delay: i * 0.03,
              duration: 0.3,
              ease: "easeOut"
          }
      })
  };


  return (
    <motion.div
      className={styles.gameContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={styles.title}>Jogo da Memória</h2>

      <div className={styles.statusArea}>
        <span className={styles.statusInfo}>Jogadas: <span>{moves}</span></span>
        <span className={styles.statusInfo}>Pares: <span>{matchedPairs} / {numberOfPairs}</span></span>
        <AnimatePresence mode="wait">
          <motion.span
            key={statusMessage}
            className={styles.statusMessage}
            variants={statusVariants} // Corrigido para usar a variável
            initial="initial"
            animate="animate"
            exit="exit"
            // A transição pode estar dentro de statusVariants ou aqui, se for diferente.
            // Se estiver em statusVariants, esta linha abaixo não é necessária.
            // transition={{ duration: 0.2 }}
          >
            {statusMessage}
          </motion.span>
        </AnimatePresence>
      </div>

      <motion.div
          className={styles.gameBoard}
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          layout
        >
        {cards.map((card, index) => (
          <motion.button
            key={card.id}
            className={`${styles.card} ${card.isFlipped ? styles.isFlipped : ''} ${card.isMatched ? styles.isMatched : ''} ${flippedIndexes.includes(index) && !card.isMatched ? styles.comparing : ''}`}
            onClick={() => handleCardClick(index)}
            disabled={isChecking || card.isFlipped || card.isMatched || gameOver}
            aria-label={`Carta ${index + 1}${card.isFlipped ? `: ${card.content}` : ''}${card.isMatched ? ' (Combinada)' : ''}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            layout
          >
            <div className={styles.cardInner}>
              <div className={`${styles.cardFace} ${styles.cardFaceFront}`}></div>
              <div className={`${styles.cardFace} ${styles.cardFaceBack}`}>
                {card.content}
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <div className={styles.buttonContainer}>
        <AnimatePresence>
            {(gameOver || (!gameOver && moves > 0)) && (
                <motion.button
                    className={styles.resetButton}
                    onClick={initializeGame}
                    variants={resetButtonVariants} // Já estava usando corretamente
                    initial="initial" // Ajustado para corresponder ao nome em resetButtonVariants
                    animate="animate" // Ajustado
                    exit="exit"       // Ajustado
                    // transition={{ duration: 0.3 }} // Pode ser removido se já definido em resetButtonVariants
                >
                    {gameOver ? 'Jogar Novamente' : 'Reiniciar Jogo'}
                </motion.button>
            )}
        </AnimatePresence>

        <div className={styles.navigationButtons}>
             <Link href={`${prefix}/games`} passHref legacyBehavior>
                <a className={`${styles.navButton} ${styles.navButtonGames}`}>Voltar para Jogos</a>
             </Link>
             <Link href={`${prefix}/`} passHref legacyBehavior>
                <a className={`${styles.navButton} ${styles.navButtonHome}`}>Voltar para Home</a>
             </Link>
        </div>
      </div>

    </motion.div>
  );
}