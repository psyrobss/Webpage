// app/conceitos/page.tsx
import fs from 'fs';
import path from 'path';
import StoreClientWrapper from './components/StoreClientWrapper';
import styles from './page.module.css';
import Header from '../components/Header'; 

interface ConceptFromFile {
  nome?: string;
  descricao_simples?: string;
  descricao_complexa?: string;
  custo_ficticio?: number;
  icone_imagem?: string;
}

// Tipagem final do conceito (usada em todo o app)
export interface Concept {
  nome: string;
  descricao_simples: string;
  descricao_complexa: string;
  custo_ficticio: number;
  icone_imagem: string | null;
  id: string;
}

async function getAllConcepts(): Promise<Concept[]> {
    const conceptsDirectory = path.join(process.cwd(), 'public/concepts');
    const indexFilePath = path.join(conceptsDirectory, 'index.json');
    const allConcepts: Concept[] = [];
    const seenIds = new Set<string>();

    try {
        const indexFileContent = fs.readFileSync(indexFilePath, 'utf-8');
        const indexData = JSON.parse(indexFileContent) as { conceptFiles?: string[] };
        const conceptFilenames: string[] = indexData.conceptFiles || [];

        if (conceptFilenames.length === 0) {
            console.warn("No concept files listed in public/concepts/index.json. Returning empty array.");
            return [];
        }

        for (const filename of conceptFilenames) {
            const filePath = path.join(conceptsDirectory, filename);
            try {
                const fileContent = fs.readFileSync(filePath, 'utf-8');

                const conceptsFromFile = JSON.parse(fileContent) as ConceptFromFile[];

                if (!Array.isArray(conceptsFromFile)) {
                    console.warn(`File ${filename} does not contain a valid JSON array. Skipping.`);
                    continue;
                }

                conceptsFromFile.forEach(conceptData => {
                    if (!conceptData || typeof conceptData.nome !== 'string' || conceptData.nome.trim() === '') {
                        console.warn(`Skipping invalid concept entry in ${filename} due to missing or invalid 'nome':`, conceptData);
                        return;
                    }

                    const id = conceptData.nome.trim();

                    if (!seenIds.has(id)) {
                        const iconeFinal = (conceptData.icone_imagem && typeof conceptData.icone_imagem === 'string' && conceptData.icone_imagem.trim() !== '')
                            ? conceptData.icone_imagem.trim()
                            : null;

                        const custoFinal = (typeof conceptData.custo_ficticio === 'number' && !isNaN(conceptData.custo_ficticio))
                            ? conceptData.custo_ficticio
                            : 0;

                        allConcepts.push({
                            id: id,
                            nome: id,
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


            } catch (fileError: unknown) {
                let errorMessage = `Error reading or parsing concept file ${filename}.`;
                if (fileError instanceof Error) {
                    errorMessage += ` Details: ${fileError.message}`;
                } else if (typeof fileError === 'string') {
                    errorMessage += ` Details: ${fileError}`;
                }
                console.error(errorMessage);
            }
        }
        console.log(`Successfully loaded ${allConcepts.length} unique concepts.`);
        return allConcepts;

    } catch (error: unknown) {
        let errorMessage = "Critical error loading concepts index (public/concepts/index.json) or processing files.";
        if (error instanceof Error) {
            errorMessage += ` Details: ${error.message}`;
        } else if (typeof error === 'string') {
            errorMessage += ` Details: ${error}`;
        }
        console.error(errorMessage);
        return []; // Retorna array vazio em caso de erro grave
    }
}

export default async function ConceitosPage() {
  const allConceptsData = await getAllConcepts();
  const startingPsi = 500;

  return (
    <div className={styles.pageContainer} suppressHydrationWarning={true}>
      {/* Componente Header aqui */}
      <Header /> 

      {/* O header específico da página */}
      <header className={styles.pageHeader}>
          <h1>Loja de Conceitos Psicológicos</h1>
          <p>Adquira conhecimento e conecte ideias! Comece com {startingPsi} Ψ.</p>
      </header>

      {/* Conteúdo principal da página */}
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