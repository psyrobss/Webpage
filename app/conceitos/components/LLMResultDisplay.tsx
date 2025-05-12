// app/conceitos/components/LLMResultDisplay.tsx
'use client';

import { useState, useEffect } from 'react';
import { Concept } from '../page';
import styles from './LLMResultDisplay.module.css';

interface LLMResultDisplayProps {
  concepts: Concept[];
  onClose: () => void; // nome corrigido para consistência
}

function generateTemplatedConnection(concepts: Concept[]): string {
  if (concepts.length < 1) return "Selecione conceitos para ver a conexão.";

  const conceptNames = concepts.map(c => `<strong>${c.nome}</strong>`).join(', ');

  if (concepts.length === 1) {
    return `Explorando ${conceptNames}: ${concepts[0].descricao_simples}`;
  }

  if (concepts.length === 2) {
    return `Combinando ${conceptNames}. Como a ideia de ${concepts[0].nome} pode interagir com ${concepts[1].nome} em situações práticas?`;
  }

  const [c1, c2, c3] = concepts;
  const templates = [
    `Ao integrar ${conceptNames}, considere como a autoconsciência de ${c1.nome} pode ser potencializada pelas estratégias de ${c2.nome}, especialmente ao lidar com padrões relacionados a ${c3.nome}.`,
    `Uma aplicação prática de ${conceptNames}: Use ${c1.nome} para identificar um gatilho, aplique ${c2.nome} para analisar seus pensamentos e use ${c3.nome} para desenvolver uma resposta mais adaptativa.`,
    `Reflexão: Como os conceitos ${conceptNames} se manifestam juntos em seus desafios diários? Pense em um exemplo recente.`
  ];
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
}

export default function LLMResultDisplay({ concepts, onClose }: LLMResultDisplayProps) {
  const [generatedHTML, setGeneratedHTML] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setGeneratedHTML(generateTemplatedConnection(concepts));
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [concepts]);

  const conceptNamesForTitle = concepts.map(c => c.nome).join(' + ');

  return (
    <div className={styles.llmContainer}>
      <button onClick={onClose} className={styles.dismissButton} aria-label="Fechar conexão">
        ×
      </button>
      <h3 className={styles.title}>
        <span className={styles.titleIcon}>💡</span>
        Conectando Conceitos: {conceptNamesForTitle}
      </h3>
      {isLoading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          Gerando conexão...
        </div>
      ) : (
        <p className={styles.resultText} dangerouslySetInnerHTML={{ __html: generatedHTML }} />
      )}
    </div>
  );
}
