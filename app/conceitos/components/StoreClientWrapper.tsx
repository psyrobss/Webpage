// app/conceitos/components/StoreClientWrapper.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Concept } from '../page';
import { useConceptStore } from '../hooks/useConceptStore';

import ConceptCard from './ConceptCard';
import BalanceDisplay from './BalanceDisplay';
import CartDisplay from './CartDisplay';
import InventoryDisplay from './InventoryDisplay';
import ConceptDetailModal from './ConceptDetailModal';
import LLMResultDisplay from './LLMResultDisplay';

import layoutStyles from './StoreClientWrapper.module.css';

const ITEMS_PER_PAGE = 12;

function LoadingState() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      gap: 16
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: '4px solid var(--border-color-light)',
        borderTopColor: 'var(--color-primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ color: 'var(--text-color-secondary)', fontWeight: 'var(--font-weight-medium)' }}>
        Carregando…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

interface StoreClientWrapperProps {
  allConcepts: Concept[];
  initialPsi: number;
}

export default function StoreClientWrapper({ allConcepts, initialPsi }: StoreClientWrapperProps) {
  const {
    psiBalance,
    purchasedConceptIds,
    cartItemIds,
    cartTotalCost,
    isClientHydrated,
    actions,
    MAX_CONCEPTS,
  } = useConceptStore({ initialPsi, allConcepts });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedConceptDetails, setSelectedConceptDetails] = useState<Concept | null>(null);
  const [lastPurchasedConcepts, setLastPurchasedConcepts] = useState<Concept[]>([]);
  const [showLLMResult, setShowLLMResult] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const getConceptById = useCallback(
    (id: string): Concept | undefined => allConcepts.find(c => c.id === id),
    [allConcepts]
  );

  const purchasedConceptsFull = useMemo(
    () => purchasedConceptIds.map(getConceptById).filter((c): c is Concept => Boolean(c)),
    [purchasedConceptIds, getConceptById]
  );

  const cartConcepts = useMemo(
    () => cartItemIds.map(getConceptById).filter((c): c is Concept => Boolean(c)),
    [cartItemIds, getConceptById]
  );

  const availableConcepts = useMemo(
    () => allConcepts.filter(concept => !purchasedConceptIds.includes(concept.id)),
    [allConcepts, purchasedConceptIds]
  );

  const totalAvailableItems = availableConcepts.length;
  const totalPages = Math.ceil(totalAvailableItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalAvailableItems);

  const paginatedConcepts = useMemo(
    () => availableConcepts.slice(startIndex, endIndex),
    [availableConcepts, startIndex, endIndex]
  );

  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  const handleAddToCart = (concept: Concept) => {
    actions.addToCart(concept.id);
  };

  const handleRemoveFromCart = (conceptId: string) => {
    actions.removeFromCart(conceptId);
  };

  const handleCheckout = () => {
    const purchasedIds = actions.checkoutCart();
    if (Array.isArray(purchasedIds) && purchasedIds.length > 0) {
      const concepts = purchasedIds.map(getConceptById).filter((c): c is Concept => Boolean(c));
      setLastPurchasedConcepts(concepts);
      setShowLLMResult(true);
      setNotification({ type: 'success', message: 'Compra concluída!' });
    } else {
      setNotification({ type: 'error', message: 'Não foi possível concluir a compra.' });
    }
  };

  const handleReturnConcept = (conceptId: string) => {
    if (window.confirm('Deseja devolver este conceito e recuperar seu Ψ?')) {
      actions.returnConcept(conceptId);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Tem certeza que deseja resetar seu progresso?')) return;
    setIsResetting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    actions.resetStore();
    setIsResetting(false);
  };

  const canCheckout =
    cartConcepts.length > 0 &&
    (purchasedConceptsFull.length + cartConcepts.length <= MAX_CONCEPTS) &&
    cartTotalCost <= psiBalance;

  const checkoutDisabledReason = !cartConcepts.length
    ? 'Carrinho vazio.'
    : cartTotalCost > psiBalance
    ? 'Ψ insuficiente.'
    : (purchasedConceptsFull.length + cartConcepts.length > MAX_CONCEPTS
      ? 'Limite de conceitos atingido.'
      : '');

  const allConceptsPurchased =
    allConcepts.length > 0 && purchasedConceptsFull.length === allConcepts.length;

  if (!isClientHydrated) return <LoadingState />;

  return (
    <div className={layoutStyles.wrapper}>
      {notification && (
        <div className={`${layoutStyles.notification} ${layoutStyles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <header className={layoutStyles.headerSection}>
        <BalanceDisplay psi={psiBalance} />
        <InventoryDisplay
          purchasedConcepts={purchasedConceptsFull}
          maxItems={MAX_CONCEPTS}
          onReturnConcept={handleReturnConcept}
        />
      </header>

      <main className={layoutStyles.mainArea}>
        <section className={layoutStyles.shopColumn} aria-labelledby="shop-title">
          <h2 id="shop-title" className={layoutStyles.shopTitle}>Explore os Conceitos</h2>

          <div className={layoutStyles.shopGrid}>
            {paginatedConcepts.map((concept) => {
              const isInCart = cartItemIds.includes(concept.id);
              const disableAdd = (cartItemIds.length + purchasedConceptsFull.length >= MAX_CONCEPTS && !isInCart);
              return (
                <ConceptCard
                  key={concept.id}
                  concept={concept}
                  isInCart={isInCart}
                  isPurchased={false}
                  disableAdd={disableAdd}
                  onAddToCart={() => handleAddToCart(concept)}
                  onRemoveFromCart={() => handleRemoveFromCart(concept.id)}
                  onClickDetails={() => setSelectedConceptDetails(concept)}
                />
              );
            })}

            {totalAvailableItems === 0 && !allConceptsPurchased && (
              <p className={layoutStyles.noConceptsMessage}>Todos os conceitos disponíveis foram adquiridos!</p>
            )}
            {allConceptsPurchased && (
              <div className={layoutStyles.allBoughtMessage}>Parabéns! Você coletou todos os conceitos! 🥳</div>
            )}
            {allConcepts.length === 0 && (
              <p className={layoutStyles.noConceptsMessage}>Ops! Nenhum conceito carregado.</p>
            )}
          </div>

          {totalPages > 1 && (
            <nav className={layoutStyles.paginationControls} aria-label="Navegação de conceitos">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={layoutStyles.pageButton}
              >
                &lt; Anterior
              </button>
              <span className={layoutStyles.pageInfo}>
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={layoutStyles.pageButton}
              >
                Próxima &gt;
              </button>
            </nav>
          )}
        </section>

        <aside className={layoutStyles.cartColumn}>
          <CartDisplay
            cartConcepts={cartConcepts}
            totalCost={cartTotalCost}
            maxItems={MAX_CONCEPTS}
            onRemove={handleRemoveFromCart}
            onCheckout={handleCheckout}
            canCheckout={canCheckout}
            checkoutDisabledReason={checkoutDisabledReason}
          />
        </aside>
      </main>

      {showLLMResult && lastPurchasedConcepts.length > 0 && (
        <LLMResultDisplay
          concepts={lastPurchasedConcepts}
          onClose={() => setShowLLMResult(false)}
        />
      )}

      <footer className={layoutStyles.resetSection}>
        <button
          onClick={handleReset}
          className={layoutStyles.resetButton}
          disabled={isResetting}
        >
          {isResetting ? 'Aguarde…' : 'Resetar Progresso'}
        </button>
      </footer>

      {selectedConceptDetails && (
        <ConceptDetailModal
          concept={selectedConceptDetails}
          onClose={() => setSelectedConceptDetails(null)}
        />
      )}
    </div>
  );
}
