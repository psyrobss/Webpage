// app/conceitos/components/BalanceDisplay.tsx
'use client';

import styles from './BalanceDisplay.module.css';

interface BalanceDisplayProps {
  psi: number;
}

export default function BalanceDisplay({ psi }: BalanceDisplayProps) {
  return (
    <div className={styles.balanceContainer}>
      <span className={styles.icon} aria-hidden="true">Ψ</span>
      <span className={styles.value} title={`Seu saldo atual de Psi`}>
        {psi}
      </span>
    </div>
  );
}