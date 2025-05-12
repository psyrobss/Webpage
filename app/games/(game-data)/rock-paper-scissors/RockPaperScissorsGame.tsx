// app/games/(game-data)/rock-paper-scissors/RockPaperScissorsGame.tsx
'use client';

import React, { useState,  useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './RockPaperScissorsGame.module.css';

// --- Tipos e Constantes ---
type Choice = 'pedra' | 'papel' | 'tesoura';
type Result = 'win' | 'lose' | 'draw' | null;

const choices: { value: Choice; label: string; emoji: string }[] = [
  { value: 'pedra', label: 'Pedra', emoji: '✊' },
  { value: 'papel', label: 'Papel', emoji: '✋' },
  { value: 'tesoura', label: 'Tesoura', emoji: '✌️' },
];

const rules: { [key in Choice]: Choice } = {
  pedra: 'tesoura', // Pedra vence Tesoura
  papel: 'pedra',   // Papel vence Pedra
  tesoura: 'papel', // Tesoura vence Papel
};

// --- Componente Principal ---
export default function RockPaperScissorsGame() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [resultMessage, setResultMessage] = useState<string>('Faça sua escolha!');
  const [scores, setScores] = useState<{ player: number; computer: number }>({ player: 0, computer: 0 });
  const [isChoosing, setIsChoosing] = useState<boolean>(false); // Para delay visual

  // --- Funções do Jogo ---

  // Gera escolha aleatória para o computador
  const getComputerChoice = useCallback((): Choice => {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex].value;
  }, []); // Sem dependências

  // Determina o vencedor
  const determineWinner = useCallback((player: Choice, computer: Choice): Result => {
    if (player === computer) {
      return 'draw';
    }
    if (rules[player] === computer) {
      return 'win'; // Jogador vence
    }
    return 'lose'; // Computador vence
  }, []); // Sem dependências

  // Atualiza o placar
  const updateScore = (winner: Result) => {
    if (winner === 'win') {
      setScores(prev => ({ ...prev, player: prev.player + 1 }));
    } else if (winner === 'lose') {
      setScores(prev => ({ ...prev, computer: prev.computer + 1 }));
    }
  };

  // Lida com a escolha do jogador
  const handlePlayerChoice = (choice: Choice) => {
    if (isChoosing) return; // Evita cliques múltiplos rápidos

    setIsChoosing(true);
    setPlayerChoice(choice);
    setComputerChoice(null); // Limpa escolha anterior do PC
    setResult(null);
    setResultMessage('Computador está escolhendo...');

    // Simula o "pensamento" do computador e revela
    setTimeout(() => {
      const compChoice = getComputerChoice();
      setComputerChoice(compChoice);

      const roundResult = determineWinner(choice, compChoice);
      setResult(roundResult);
      updateScore(roundResult);

      // Define a mensagem final
      if (roundResult === 'win') setResultMessage('Você Ganhou! 🎉');
      else if (roundResult === 'lose') setResultMessage('Computador Ganhou! 🤖');
      else setResultMessage('Empate! 🤝');

      setIsChoosing(false); // Libera para próxima jogada
    }, 700); // Delay de 700ms
  };

  // --- Funções Auxiliares de Renderização ---
  const getEmoji = (choice: Choice | null): string => {
    if (!choice) return '?';
    return choices.find(c => c.value === choice)?.emoji || '?';
  };

  const getResultClass = (res: Result): string => {
      if (res === 'win') return styles.win;
      if (res === 'lose') return styles.lose;
      if (res === 'draw') return styles.draw;
      return '';
  }

  // --- Animações Framer Motion ---
  const choiceVariants = {
    hidden: { scale: 0.5, opacity: 0, rotate: -45 },
    visible: { scale: 1, opacity: 1, rotate: 0, transition: { duration: 0.3, type: "spring", stiffness: 150 } },
  };
  const resultVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  };

  return (
    <motion.div
      className={styles.gameContainer}
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className={styles.title}>Pedra, Papel e Tesoura</h2>

      <div className={styles.scoreBoard}>
        <span className={styles.score}>Você: <span>{scores.player}</span></span>
        <span className={styles.score}>PC: <span>{scores.computer}</span></span>
      </div>

      <div className={styles.choicesContainer}>
        {choices.map((choice) => (
          <motion.button
            key={choice.value}
            className={styles.choiceButton}
            onClick={() => handlePlayerChoice(choice.value)}
            disabled={isChoosing}
            aria-label={`Escolher ${choice.label}`}
            whileHover={{ scale: isChoosing ? 1 : 1.1, rotate: isChoosing ? 0 : 5 }}
            whileTap={{ scale: isChoosing ? 1 : 0.9 }}
            transition={{ duration: 0.15 }}
          >
            {choice.emoji}
          </motion.button>
        ))}
      </div>

      <div className={styles.displayArea}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`player-${playerChoice || 'none'}`} // Chave muda para animar
            className={styles.playerChoiceDisplay}
            variants={choiceVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {getEmoji(playerChoice)}
          </motion.div>
        </AnimatePresence>
        <span className={styles.vsText}>VS</span>
        <AnimatePresence mode="wait">
          <motion.div
            key={`computer-${computerChoice || 'none'}`} // Chave muda para animar
            className={styles.computerChoiceDisplay}
            variants={choiceVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
             {getEmoji(computerChoice)}
          </motion.div>
        </AnimatePresence>
      </div>

        <AnimatePresence mode="wait">
            <motion.div
                key={resultMessage} // Anima quando a mensagem muda
                className={`${styles.resultMessage} ${getResultClass(result)}`}
                variants={resultVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
            >
                {resultMessage}
            </motion.div>
        </AnimatePresence>


      <div className={styles.navigationButtons}>
        <Link href="/games" passHref legacyBehavior>
          <a className={`${styles.navButton} ${styles.navButtonGames}`}>Voltar para Jogos</a>
        </Link>
        <Link href="/" passHref legacyBehavior>
           <a className={`${styles.navButton} ${styles.navButtonHome}`}>Voltar para Home</a>
        </Link>
      </div>
    </motion.div>
  );
}