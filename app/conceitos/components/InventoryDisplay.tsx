// app/conceitos/components/InventoryDisplay.tsx
'use client';

import { Concept } from '../page';
import styles from './InventoryDisplay.module.css';

interface InventoryDisplayProps {
  purchasedConcepts: Concept[];
  maxItems: number;
  onReturnConcept: (conceptId: string) => void;
}

export default function InventoryDisplay({
  purchasedConcepts,
  maxItems,
  onReturnConcept
}: InventoryDisplayProps) {
  return (
    <div className={styles.inventoryContainer}>
      <h4 className={styles.title}>
        Meus Conceitos ({purchasedConcepts.length}/{maxItems})
      </h4>

      {purchasedConcepts.length > 0 ? (
        <ul className={styles.list}>
          {purchasedConcepts.map(concept => (
            <li key={concept.id} className={styles.item}>
              <span className={styles.itemName}>{concept.nome}</span>
              <button
                onClick={() => onReturnConcept(concept.id)}
                className={styles.returnButton}
                title={`Devolver ${concept.nome}`}
                aria-label={`Devolver ${concept.nome}`}
              >
                × {/* Caractere 'X' */}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyMessage}>Nenhum conceito adquirido.</p>
      )}
    </div>
  );
}