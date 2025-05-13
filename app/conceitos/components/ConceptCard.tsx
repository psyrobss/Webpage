// app/conceitos/components/ConceptCard.tsx


'use client';

import Image from 'next/image';
import { Concept } from '../page'; 
import styles from './ConceptCard.module.css';
import { useState, useEffect } from 'react';



interface ConceptCardProps {
  concept: Concept;
  isInCart: boolean;
  isPurchased: boolean; 
  disableAdd: boolean;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  onClickDetails: () => void;
}

export default function ConceptCard({
  concept,
  isInCart,
  disableAdd,
  onAddToCart,
  onRemoveFromCart,
  onClickDetails,
}: ConceptCardProps) {
  const iconPath = concept.icone_imagem ? './icons/${concept.icone_imagem}' : null;
  const [imgError, setImgError] = useState(!iconPath);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Para animação de entrada

  // Ativa animação quando montado no cliente
  useEffect(() => {
    // Pequeno delay para garantir que o CSS esteja pronto e a animação funcione
    const timer = setTimeout(() => {
        setIsVisible(true);
    }, 50); // Delay mínimo
    return () => clearTimeout(timer);
  }, []);

  // Resetar estado da imagem se o concept.id mudar
  useEffect(() => {
      setImgError(!iconPath);
      setIsImageLoaded(false);
  }, [concept.id, iconPath]);

  const ButtonAction = () => {
    if (isInCart) {
      return (
        <button onClick={onRemoveFromCart} className={`${styles.button} ${styles.removeButton}`}>
          Remover
        </button>
      );
    } else {
      return (
        <button
          onClick={onAddToCart}
          className={`${styles.button} ${styles.addButton}`}
          disabled={disableAdd}
          title={disableAdd ? "Carrinho cheio (Máx. 3)" : `Adicionar ${concept.nome}`}
        >
          Adicionar
        </button>
      );
    }
  };

  // **CORREÇÃO:** Usa a variável cardClassName que inclui a lógica de animação
  const cardClassName = `${styles.card} ${isVisible ? styles.cardVisible : ''}`;

  return (
    // Usar <article> é semanticamente bom para um card independente
    // **CORREÇÃO:** Aplica a variável cardClassName aqui
    <article className={cardClassName} aria-labelledby={`title-${concept.id}`}>
      <div className={styles.cardHeader}>
        <div className={styles.iconWrapper}>
          {!imgError && iconPath && (
            <Image
              src={iconPath}
              alt="" // Alt vazio para ícones decorativos ou que complementam o título
              fill // Usa fill para preencher o wrapper (requer position:relative no pai)
              sizes="(max-width: 768px) 10vw, (max-width: 1200px) 8vw, 50px" // Ajuste sizes
              className={`${styles.icon} ${isImageLoaded ? styles.iconLoaded : ''}`}
              onError={() => setImgError(true)}
              onLoad={() => setIsImageLoaded(true)}
              priority={false} // Apenas imagens acima da dobra devem ser prioridade
            />
          )}
          {/* O placeholder CSS (::before no iconWrapper) será visível se a imagem não carregar ou não existir */}
        </div>
        <div className={styles.headerText}>
           <h3 id={`title-${concept.id}`} className={styles.title}>{concept.nome}</h3>
           <span className={styles.costBadge} aria-label={`Custo: ${concept.custo_ficticio} Psi`}>
             {concept.custo_ficticio}
           </span>
        </div>
      </div>

      <p className={styles.description}>{concept.descricao_simples}</p>

      <div className={styles.cardActions}>
        <button onClick={onClickDetails} className={`${styles.button} ${styles.detailsButton}`}>
          Detalhes
        </button>
        <ButtonAction />
      </div>

      {/* Overlay de Carrinho Cheio (renderizado condicionalmente) */}
      {disableAdd && !isInCart && (
         <div className={styles.disabledOverlay}>Carrinho Cheio</div>
      )}
    </article>
  );
}