// Descrição: Este arquivo contém o componente da página de jogos, que lista os jogos disponíveis.

import React from 'react';
import Link from 'next/link';
import fs from 'fs'; // Node.js File System module
import path from 'path'; // Node.js Path module
import styles from './GamesPage.module.css'; // Importa o CSS Module



// Interface para definir a estrutura dos metadados do jogo
interface GameMeta {
  name: string;
  description: string;
}

// Interface para o objeto do jogo que vamos usar no componente
interface GameInfo extends GameMeta {
  id: string; // O nome da pasta será o ID
  href: string; // O link para a página do jogo
}

// Função para buscar os jogos (executada no servidor durante o build)
async function getGames(): Promise<GameInfo[]> {
  const gameDataPath = path.join(process.cwd(), 'app', 'games', '(game-data)');
  let gameFolders: string[] = [];

  try {
    const allEntries = fs.readdirSync(gameDataPath, { withFileTypes: true });
    gameFolders = allEntries
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  } catch (error) { // O 'error' aqui é usado no console.error
    console.error("Erro ao ler o diretório de jogos em (game-data):", error);
    return [];
  }

  const games: GameInfo[] = [];

  for (const folderName of gameFolders) {
    const metaPath = path.join(gameDataPath, folderName, 'meta.json');
    try {
      const metaContent = fs.readFileSync(metaPath, 'utf-8');
      const metaData: GameMeta = JSON.parse(metaContent);

      games.push({
        id: folderName,
        name: metaData.name,
        description: metaData.description,
        href: '/' + folderName,
      });
    } catch (error) { 
      console.warn(
        `Aviso: Não foi possível carregar metadados para o jogo "${folderName}". ` +
        `Verifique se 'app/games/(game-data)/${folderName}/meta.json' existe e é um JSON válido. ` +
        `Erro específico: ${(error as Error).message}` // Adiciona a mensagem do erro
      );
    }
  }

  games.sort((a, b) => a.name.localeCompare(b.name));
  return games;
}

// --- O Componente da Página ---
export default async function GamesPage() {
  const games = await getGames();

  return (
    <div>
      <p className={styles.introText}>
        Explore os jogos que desenvolvi enquanto aprendo sobre LLM.
        Ainda teremos novos jogos gerais e também jogos neuropsicológicos
      </p>

      {games.length > 0 ? (
        <div className={styles.gamesGrid}>
          {games.map((game) => (
            <Link key={game.id} href={game.href} className={styles.gameCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h2 className={styles.cardTitle}>{game.name}</h2>
                <p className={styles.cardDescription}>{game.description}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className={styles.introText}>Ainda não há jogos disponíveis. Volte em breve!</p>
      )}
    </div>
  );
}

// Forçar a geração estática e revalidação
export const dynamic = 'force-static'; 
export const revalidate = false;
