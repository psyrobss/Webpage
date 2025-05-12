// app/conceitos/hooks/useConceptStore.ts
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Concept } from '../page'; // Supondo que Concept é importado corretamente

// Chaves do Local Storage
const PSI_STORAGE_KEY = 'conceptStore_psi_v1';
const PURCHASED_STORAGE_KEY = 'conceptStore_purchased_v1';
const CART_STORAGE_KEY = 'conceptStore_cart_v1';
const MAX_CONCEPTS = 3;

interface UseConceptStoreProps {
  initialPsi: number;
  allConcepts: Concept[];
}

const getInitialState = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') {
        return defaultValue;
    }
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue !== null && storedValue !== 'undefined') {
            return JSON.parse(storedValue) as T;
        }
        return defaultValue;
    } catch (error) {
        console.error(`Error reading localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

export function useConceptStore({ initialPsi, allConcepts }: UseConceptStoreProps) {
  const [psiBalance, setPsiBalance] = useState<number>(() => getInitialState(PSI_STORAGE_KEY, initialPsi));
  const [purchasedConceptIds, setPurchasedConceptIds] = useState<string[]>(() => getInitialState(PURCHASED_STORAGE_KEY, []));
  const [cartItemIds, setCartItemIds] = useState<string[]>(() => getInitialState(CART_STORAGE_KEY, []));
  const [isClientHydrated, setIsClientHydrated] = useState(false);

  const conceptCosts = useMemo(() => {
      const map = new Map<string, number>();
      allConcepts.forEach(c => {
        const cost = typeof c.custo_ficticio === 'number' && !isNaN(c.custo_ficticio) ? c.custo_ficticio : 0;
        map.set(c.id, cost);
      });
      return map;
  }, [allConcepts]);

  useEffect(() => {
    setIsClientHydrated(true);
  }, []);

  useEffect(() => {
    if (isClientHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem(PSI_STORAGE_KEY, JSON.stringify(psiBalance));
        localStorage.setItem(PURCHASED_STORAGE_KEY, JSON.stringify(purchasedConceptIds));
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItemIds));
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    }
  }, [psiBalance, purchasedConceptIds, cartItemIds, isClientHydrated]);

  const calculateCartTotal = useCallback((): number => {
    return cartItemIds.reduce((total, itemId) => {
      return total + (conceptCosts.get(itemId) ?? 0);
    }, 0);
  }, [cartItemIds, conceptCosts]);

  const cartTotalCost = useMemo(calculateCartTotal, [calculateCartTotal]);

  const addToCart = useCallback((conceptId: string): { success: boolean; message: string } => {
    if (purchasedConceptIds.includes(conceptId)) {
      return { success: false, message: "Já adquirido." };
    }
    if (cartItemIds.includes(conceptId)) {
      return { success: false, message: "Já está no carrinho." };
    }
    if (purchasedConceptIds.length + cartItemIds.length >= MAX_CONCEPTS) {
        return { success: false, message: `Limite total de ${MAX_CONCEPTS} conceitos atingido.` };
    }

    setCartItemIds((prevCart) => [...prevCart, conceptId]);
    return { success: true, message: "Adicionado ao carrinho!" };
  }, [cartItemIds, purchasedConceptIds]);

  const removeFromCart = useCallback((conceptId: string): void => {
    setCartItemIds((prevCart) => prevCart.filter(id => id !== conceptId));
  }, []);

  const checkoutCart = useCallback((): { success: boolean; message: string, purchasedItems?: Concept[] } => {
    if (cartItemIds.length === 0) return { success: false, message: "Seu carrinho está vazio." };

    const finalTotalCount = purchasedConceptIds.length + cartItemIds.length;
    if (finalTotalCount > MAX_CONCEPTS) {
      return { success: false, message: `Não é possível comprar. Você excederia o limite de ${MAX_CONCEPTS} conceitos.` };
    }

    const totalCost = calculateCartTotal();
    if (psiBalance < totalCost) {
      return { success: false, message: `Psi insuficiente! (Precisa: ${totalCost} Ψ)` };
    }

    const newlyPurchasedIds = [...cartItemIds];
    setPsiBalance((prevPsi) => prevPsi - totalCost);
    setPurchasedConceptIds((prevPurchased) => Array.from(new Set([...prevPurchased, ...newlyPurchasedIds])));
    setCartItemIds([]);

    const newlyPurchasedConcepts = allConcepts.filter(c => newlyPurchasedIds.includes(c.id));

    return { success: true, message: `Compra realizada! ${newlyPurchasedIds.length} conceito(s) adquirido(s).`, purchasedItems: newlyPurchasedConcepts };

  }, [cartItemIds, purchasedConceptIds, psiBalance, allConcepts, calculateCartTotal]);

  const returnConcept = useCallback((conceptId: string): { success: boolean; message: string } => {
    if (!purchasedConceptIds.includes(conceptId)) {
      return { success: false, message: "Conceito não encontrado no inventário." };
    }
    const costToRefund = conceptCosts.get(conceptId);
    if (costToRefund === undefined) {
      console.error(`Custo não encontrado para devolução: ${conceptId}`);
      return { success: false, message: "Erro ao processar devolução." };
    }

    setPsiBalance((prevPsi) => prevPsi + costToRefund);
    setPurchasedConceptIds((prevPurchased) => prevPurchased.filter(id => id !== conceptId));
    setCartItemIds((prevCart) => prevCart.filter(id => id !== conceptId));

    const conceptName = allConcepts.find(c => c.id === conceptId)?.nome || conceptId;
    return { success: true, message: `"${conceptName}" devolvido! +${costToRefund} Ψ.` };
  }, [purchasedConceptIds, conceptCosts, allConcepts]); // Comentário eslint-disable removido

  const resetStore = useCallback(() => {
    setPsiBalance(initialPsi);
    setPurchasedConceptIds([]);
    setCartItemIds([]);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(PSI_STORAGE_KEY);
        localStorage.removeItem(PURCHASED_STORAGE_KEY);
        localStorage.removeItem(CART_STORAGE_KEY);
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    }
  }, [initialPsi]);

  return {
    psiBalance,
    purchasedConceptIds,
    cartItemIds,
    cartTotalCost,
    isClientHydrated,
    actions: {
        addToCart,
        removeFromCart,
        checkoutCart,
        returnConcept,
        resetStore,
    },
    MAX_CONCEPTS,
  };
}