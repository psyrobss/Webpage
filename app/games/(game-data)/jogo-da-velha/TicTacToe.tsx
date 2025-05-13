'use client';                       // habilita hooks no App Router

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from './TicTacToe.module.css';

const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '';

/* ---------- Tipos ---------- */
type Player = 'X' | 'O';
type BoardState = (Player | null)[];
type WinnerInfo = { winner: Player | 'Draw' | null; line: number[] | null };

/* ---------- Constantes ---------- */
const initialBoard: BoardState = Array(9).fill(null);
const winningLines = [
  [0,1,2],[3,4,5],[6,7,8],  // linhas
  [0,3,6],[1,4,7],[2,5,8],  // colunas
  [0,4,8],[2,4,6]           // diagonais
];

/* ---------- Square ---------- */
interface SquareProps {
  value: Player | null;
  onClick: () => void;
  isWinning: boolean;
  disabled: boolean;
}

function Square({ value, onClick, isWinning, disabled }: SquareProps) {
  const symbolClass = value === 'X' ? styles.x : value === 'O' ? styles.o : '';
  return (
    <motion.button
      className={`${styles.square} ${isWinning ? styles.winning : ''}`}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      <AnimatePresence>
        {value && (
          <motion.span
            key={value}
            className={`${symbolClass} ${styles.symbolSpan}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 0.2, ease: 'backOut' } }}
            exit={{ scale: 0.5, opacity: 0 }}
          >
            {value}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ---------- Jogo principal ---------- */
export default function TicTacToeGame() {
  const [board, setBoard]           = useState<BoardState>(initialBoard);
  const [current, setCurrent]       = useState<Player>('X');
  const [winnerInfo, setWinnerInfo] = useState<WinnerInfo>({ winner: null, line: null });
  const [status, setStatus]         = useState('É a vez do Jogador X');

  /* calcula vencedor */
  const getWinner = useCallback((b: BoardState): WinnerInfo => {
    for (const line of winningLines) {
      const [a, b1, c] = line;
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return { winner: b[a], line };
    }
    return b.includes(null) ? { winner: null, line: null } : { winner: 'Draw', line: null };
  }, []);

  /* controla rodadas */
  useEffect(() => {
    const res = getWinner(board);
    if (res.winner) {
      setWinnerInfo(res);
      setStatus(res.winner === 'Draw' ? 'Empate!' : `Jogador ${res.winner} venceu!`);
    } else {
      setCurrent(p => (p === 'X' ? 'O' : 'X'));
    }
  }, [board, getWinner]);

  /* atualiza status quando muda jogador */
  useEffect(() => { if (!winnerInfo.winner) setStatus(`É a vez do Jogador ${current}`); },
    [current, winnerInfo.winner]);

  /* cliques */
  const handleClick = (i: number) => {
    if (board[i] || winnerInfo.winner) return;
    const nb = [...board]; nb[i] = current; setBoard(nb);
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setCurrent('X');
    setWinnerInfo({ winner: null, line: null });
    setStatus('É a vez do Jogador X');
  };

  /* animações */
  const statusVar = { initial:{y:-15,opacity:0}, animate:{y:0,opacity:1}, exit:{y:15,opacity:0} };
  const btnVar    = { hidden:{opacity:0,y:20,scale:0.9}, visible:{opacity:1,y:0,scale:1,transition:{delay:.2}} };

  /* render */
  return (
    <motion.div
      className={styles.gameContainer}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={styles.title}>Jogo da Velha</h2>

      <AnimatePresence mode="wait">
        <motion.div key={status} className={styles.status}
          variants={statusVar} initial="initial" animate="animate" exit="exit" transition={{ duration: .25 }}>
          {status}
        </motion.div>
      </AnimatePresence>

      <div className={styles.board}>
        {board.map((v,i)=>(
          <Square key={i} value={v} onClick={()=>handleClick(i)}
            isWinning={winnerInfo.line?.includes(i)??false}
            disabled={!!winnerInfo.winner || v!==null}/>
        ))}
      </div>

      <AnimatePresence>
        {winnerInfo.winner && (
          <motion.button key="reset" className={styles.resetButton}
            onClick={resetGame} variants={btnVar}
            initial="hidden" animate="visible" exit="hidden">
            Jogar Novamente
          </motion.button>
        )}
      </AnimatePresence>

      {/* botões de navegação DEPOIS do jogo */}
      <div className={styles.navigationButtons}>
        <Link href={`${prefix}/games`} className={`${styles.navButton} ${styles.navButtonGames}`}>Voltar para Jogos</Link>
        <Link href={`${prefix}/`}       className={`${styles.navButton} ${styles.navButtonHome}`}>Voltar para Home</Link>
      </div>
    </motion.div>
  );
}
