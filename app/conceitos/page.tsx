// app/conceitos/page.tsx
import fs from 'fs';
import path from 'path';
import StoreClientWrapper from './components/StoreClientWrapper';
import styles from './page.module.css';

// Interface para o formato esperado dos conceitos nos arquivos JSON
// (antes de adicionarmos 'id' e normalizarmos 'icone_imagem')
interface ConceptFromFile {
  nome?: string; // Nome é obrigatório, mas Partial permite checagem
  descricao_simples?: string;
  descricao_complexa?: string;
  custo_ficticio?: number;
  icone_imagem?: string; // Pode ser string ou undefined
}

// Tipagem final do conceito (usada em todo o app)
export interface Concept {
  nome: string;
  descricao_simples: string;
  descricao_complexa: string;
  custo_ficticio: number;
  icone_imagem: string | null; // Normalizado para string ou null
  id: string;
}

async function getAllConcepts(): Promise<Concept[]> {
    const conceptsDirectory = path.join(process.cwd(), 'public/concepts');
    const indexFilePath = path.join(conceptsDirectory, 'index.json');
    // **CORREÇÃO 1: Usar const para allConcepts**
    const allConcepts: Concept[] = [];
    const seenIds = new Set<string>();

    try {
        const indexFileContent = fs.readFileSync(indexFilePath, 'utf-8');
        const indexData = JSON.parse(indexFileContent) as { conceptFiles?: string[] }; // Tipagem para indexData
        const conceptFilenames: string[] = indexData.conceptFiles || [];

        if (conceptFilenames.length === 0) {
            console.warn("No concept files listed in public/concepts/index.json. Returning empty array.");
            return [];
        }

        for (const filename of conceptFilenames) {
            const filePath = path.join(conceptsDirectory, filename);
            try {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                // **CORREÇÃO 3 (Simplificação de Tipo):**
                // Tipar como um array de objetos parcialmente formados
                const conceptsFromFile = JSON.parse(fileContent) as ConceptFromFile[];

                if (!Array.isArray(conceptsFromFile)) {
                    console.warn(`File ${filename} does not contain a valid JSON array. Skipping.`);
                    continue;
                }

                conceptsFromFile.forEach(conceptData => {
                    // Validação robusta da entrada do JSON
                    if (!conceptData || typeof conceptData.nome !== 'string' || conceptData.nome.trim() === '') {
                        console.warn(`Skipping invalid concept entry in ${filename} due to missing or invalid 'nome':`, conceptData);
                        return;
                    }

                    const id = conceptData.nome.trim(); // Usar nome como ID, removendo espaços extras

                    if (!seenIds.has(id)) {
                        const iconeFinal = (conceptData.icone_imagem && typeof conceptData.icone_imagem === 'string' && conceptData.icone_imagem.trim() !== '')
                            ? conceptData.icone_imagem.trim()
                            : null;

                        const custoFinal = (typeof conceptData.custo_ficticio === 'number' && !isNaN(conceptData.custo_ficticio))
                            ? conceptData.custo_ficticio
                            : 0;

                        allConcepts.push({
                            id: id,
                            nome: id, // Usar o ID (nome trimado) como nome final
                            descricao_simples: conceptData.descricao_simples || 'Descrição simples não fornecida.',
                            descricao_complexa: conceptData.descricao_complexa || 'Descrição complexa não fornecida.',
                            custo_ficticio: custoFinal,
                            icone_imagem: iconeFinal,
                        });
                        seenIds.add(id);
                    } else {
                        console.warn(`Duplicate concept name/ID found and skipped: "${id}" from file ${filename}.`);
                    }
                });
            // **CORREÇÃO 2: Tipar fileError como unknown**
            } catch (fileError: unknown) {
                let errorMessage = `Error reading or parsing concept file ${filename}.`;
                if (fileError instanceof Error) {
                    errorMessage += ` Details: ${fileError.message}`;
                } else if (typeof fileError === 'string') {
                    errorMessage += ` Details: ${fileError}`;
                }
                console.error(errorMessage);
                // Opcional: registrar o objeto fileError inteiro se precisar de mais depuração
                // console.error("Full file error object:", fileError);
            }
        }
        console.log(`Successfully loaded ${allConcepts.length} unique concepts.`);
        return allConcepts;

    // **CORREÇÃO 2: Tipar error como unknown**
    } catch (error: unknown) {
        let errorMessage = "Critical error loading concepts index (public/concepts/index.json) or processing files.";
        if (error instanceof Error) {
            errorMessage += ` Details: ${error.message}`;
        } else if (typeof error === 'string') {
            errorMessage += ` Details: ${error}`;
        }
        console.error(errorMessage);
        // console.error("Full index/files error object:", error);
        return []; // Retorna array vazio em caso de erro grave
    }
}

export default async function ConceitosPage() {
  const allConceptsData = await getAllConcepts();
  const startingPsi = 500;

  return (
    <div className={styles.pageContainer} suppressHydrationWarning={true}>
      <header className={styles.pageHeader}>
          <h1>Loja de Conceitos Psicológicos</h1>
          <p>Adquira conhecimento e conecte ideias! Comece com {startingPsi} Ψ.</p>
      </header>

      {/* Validação adicional antes de renderizar StoreClientWrapper */}
      {Array.isArray(allConceptsData) ? (
        <StoreClientWrapper
          allConcepts={allConceptsData}
          initialPsi={startingPsi}
        />
      ) : (
        <p className={styles.errorMessage}>
            Erro ao carregar os conceitos. Por favor, tente recarregar a página ou contate o suporte.
        </p>
      )}
    </div>
  );
}