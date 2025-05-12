// app/conceitos/components/ConceptDetailModal.tsx
'use client';

import { Concept } from '../page'; // Garanta que o path está correto
import styles from './ConceptDetailModal.module.css';
import { useEffect, useRef } from 'react'; // Adicionar useRef

interface ConceptDetailModalProps {
  concept: Concept;
  onClose: () => void;
}

export default function ConceptDetailModal({ concept, onClose }: ConceptDetailModalProps) {
  const modalContentRef = useRef<HTMLDivElement>(null); // Ref para o contentBox

  const getScholarSearchUrl = (query: string) => {
    const encodedQuery = encodeURIComponent(`"${query}" Terapia Cognitivo-Comportamental OR Psicologia Clínica`);
    return `https://scholar.google.com/scholar?hl=pt&as_sdt=0,5&q=${encodedQuery}`;
  };
  const scholarUrl = getScholarSearchUrl(concept.nome);

  // Efeito para fechar com ESC e focar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Foco no modal ou em um elemento focável dentro dele
    if (modalContentRef.current) {
      // Tenta focar no primeiro botão ou link dentro do modal
      // **CORREÇÃO:** Descomentado e usado focusableButton
      const focusableElements = modalContentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusableElement = Array.from(focusableElements).find(
          (el) => !(el as HTMLElement).hasAttribute('disabled') && (el as HTMLElement).offsetParent !== null // Visível e não desabilitado
      ) as HTMLElement | null;


      if (firstFocusableElement) {
        firstFocusableElement.focus();
      } else {
        // Se nenhum elemento focável for encontrado, foca no próprio contêiner do modal
        // (isso é útil se o conteúdo for apenas texto, mas menos ideal)
        modalContentRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]); // Adiciona onClose à dependência

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      {/* Adiciona a ref ao contentBox */}
      <div
        ref={modalContentRef}
        className={styles.contentBox}
        onClick={(e) => e.stopPropagation()}
        role="document"
        tabIndex={-1} // Permite que a div receba foco programaticamente
      >
        <button onClick={onClose} className={styles.closeButtonTop} aria-label="Fechar detalhes do conceito">
          × {/* "X" para fechar */}
        </button>

        <h2 id="modal-title" className={styles.title}>{concept.nome}</h2>

        <div className={styles.description}>
            {/* Divide a string por quebras de linha e renderiza cada parte como um parágrafo */}
            {concept.descricao_complexa.split('\n').map((paragraph, index) => (
                 paragraph.trim() ? <p key={index}>{paragraph}</p> : null
            ))}
        </div>

        <div className={styles.actionArea}>
          <a
            href={scholarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.scholarButton} button-style`} // Garante classe base de botão
          >
            Pesquisar Scholar
          </a>
          <button onClick={onClose} className={styles.closeButtonBottom}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}