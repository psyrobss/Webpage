// app/conceitos/components/CartDisplay.tsx
'use client';

import { Concept } from '../page';
import styles from './CartDisplay.module.css';

interface CartDisplayProps {
  cartConcepts: Concept[];
  totalCost: number;
  maxItems: number;
  onRemove: (conceptId: string) => void;
  onCheckout: () => void;
  canCheckout: boolean;
  checkoutDisabledReason?: string;
}

export default function CartDisplay({
  cartConcepts,
  totalCost,
  maxItems,
  onRemove,
  onCheckout,
  canCheckout,
  checkoutDisabledReason
}: CartDisplayProps) {
  return (
    <aside className={styles.cartContainer} aria-labelledby="cart-title"> {/* Use aside e aria */}
      <h3 id="cart-title" className={styles.title}>
         <span className={styles.titleIcon} aria-hidden="true">🛒</span>
         Seu Carrinho ({cartConcepts.length}/{maxItems})
      </h3>

      {cartConcepts.length === 0 ? (
        <div className={styles.emptyMessage} role="status"> {/* role=status */}
            Seu carrinho está vazio.
        </div>
      ) : (
        <ul className={styles.itemList}>
          {cartConcepts.map((concept) => (
            <li key={concept.id} className={styles.item}>
              <span className={styles.itemName}>{concept.nome}</span>
              <span className={styles.itemCost} aria-label={`Custo: ${concept.custo_ficticio} Psi`}>{concept.custo_ficticio}</span>
              <button
                onClick={() => onRemove(concept.id)}
                className={styles.removeButton}
                title="Remover do carrinho"
                aria-label={`Remover ${concept.nome} do carrinho`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Renderizar rodapé apenas se houver itens ou mensagem de erro */}
      {(cartConcepts.length > 0 || !canCheckout ) && (
          <div className={styles.cartFooter}>
              {/* Total só aparece se tiver itens */}
              {cartConcepts.length > 0 && (
                <div className={styles.total}>
                  <span>Total:</span>
                  <span className={styles.totalValue} aria-label={`Total: ${totalCost} Psi`}>{totalCost}</span>
                </div>
              )}

              <button
                onClick={onCheckout}
                disabled={!canCheckout}
                className={styles.checkoutButton}
                title={!canCheckout ? checkoutDisabledReason : "Finalizar Compra"}
              >
                Finalizar Compra
              </button>

              {!canCheckout && checkoutDisabledReason && (
                <p className={styles.disabledReason} role="alert">{checkoutDisabledReason}</p>
              )}
          </div>
      )}
    </aside>
  );
}