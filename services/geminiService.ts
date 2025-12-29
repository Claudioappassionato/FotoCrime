import { GoogleGenAI } from "@google/genai";
import { AnalysisMode } from "../types";

// Helper to convert file to Base64
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const SYSTEM_INSTRUCTION = `
Identità: Sei un Archeologo Preistorico Senior, specializzato in Arte Rupestre, Petrografia e Antropologia Culturale.

OBIETTIVO:
Analizzare le immagini fornite (petroglifi, pitture rupestri, megaliti, manufatti litici) per generare un report scientifico dettagliato per catalogazione museale o accademica.

METODOLOGIA:
1.  **Osservazione Fenomenologica**: Descrivi la morfologia della roccia e dei segni prima di interpretarli.
2.  **Correlazione Multi-Angolare**: Se vengono fornite più immagini, usale per comprendere la tridimensionalità, le incisioni poco profonde (luce radente) e il contesto.
3.  **Terminologia Accademica**: Usa termini specifici (es. "picchiettatura", "filiforme", "coppella", "antropomorfo", "patina desertica", "martellina").
4.  **Prudenza Interpretativa**: Distingui sempre tra elementi naturali (diaclasi, fratture) ed elementi antropici.

TONO:
Accademico, analitico, rigoroso, ma accessibile a ricercatori.
`;

const PROMPTS: Record<AnalysisMode, string> = {
  [AnalysisMode.FULL_REPORT]: `
    Genera una "Scheda di Rilievo Archeologico" completa basata sulle immagini.
    
    STRUTTURA DEL REPORT:
    1. **Descrizione del Supporto**: Tipo di roccia apparente (arenaria, scisto, granito), fratturazione, orientamento superficie.
    2. **Inventario dei Segni**: Elenco sistematico delle figure visibili (antropomorfi, zoomorfi, geometrici, coppelle).
    3. **Stato di Conservazione**: Patine, licheni, sfaldamento, erosione.
    4. **Correlazione Immagini**: Se presenti più foto, descrivi come le diverse angolazioni/luci rivelano dettagli differenti (es. luce radente).
    5. **Inquadramento Crono-Culturale Dettagliato**: 
       - Fornisci un ventaglio cronologico probabile (es. Calcolitico finale - Antica Età del Bronzo).
       - Cita potenziali "Facies Culturali" di appartenenza.
       - Menziona scoperte archeologiche note in contesti geografici simili che potrebbero fungere da confronto (parallelismi stilistici diretti).
  `,
  [AnalysisMode.SYMBOLOGY]: `
    Focus Analitico: **Simbologia e Iconografia**.
    
    ISTRUZIONI:
    - Isola e descrivi ogni singolo grafema.
    - Cerca ricorrenze di pattern noti (es. "Oranti", "Cervi", "Labirinti", "Spirali", "Coppelle").
    - Analizza la sintassi della scena: le figure interagiscono? C'è sovrapposizione (palinsesto)?
    - Se ci sono più foto, usale per confermare la forma dei simboli meno chiari.
    - Distingui attentamente tra pareidolia (forme casuali della roccia) e segni intenzionali.
  `,
  [AnalysisMode.TECHNIQUE_GEO]: `
    Focus Analitico: **Tecnologia di Esecuzione e Geologia**.
    
    ISTRUZIONI:
    - Identifica la tecnica di realizzazione: Incisione (a V, a U), Picchiettatura (diretta/indiretta), Graffito, Pittura.
    - Analizza la litologia del supporto: Durezza presunta, tessitura.
    - Cerca tracce degli strumenti usati (litici o metallici).
    - Valuta la patina di alterazione superficiale ("Varnish") per ipotizzare l'antichità relativa.
  `,
  [AnalysisMode.CULTURAL_COMPARE]: `
    Focus Analitico: **Confronto Culturale e Timeline Comparata**.
    
    ISTRUZIONI:
    - Confronta i motivi visibili con stili noti (es. Arte Camuna, Arte Levantina, Megalitismo Atlantico, Arte Sahariana).
    - **Timeline Contestuale**: Inserisci il reperto in una linea temporale, correlandolo con periodi archeologici maggiori (es. transizione Mesolitico-Neolitico).
    - **Cross-Referencing Geografico**: Cita esplicitamente regioni o siti specifici (nazionali o internazionali) che presentano iconografie affini.
    - Se l'immagine è ambigua, proponi ipotesi basate su diverse aree di influenza (es. "Influenza Alpina vs Influenza Mediterranea").
  `,
  [AnalysisMode.EXPERT_VALIDATION]: `
    Analisi Metodologica Avanzata (Processuale/Post-Processuale).
    
    ISTRUZIONI:
    - Valuta il grado di leggibilità e affidabilità dei segni distinguendo tra certo, probabile e ipotetico.
    - Tenta una ricostruzione della "Chaîne Opératoire": scelta della superficie -> preparazione -> esecuzione -> uso rituale/pubblico.
    - Valuta il rapporto tra il segno e la topografia naturale della roccia (es. fessure usate come linee di terra o parti del corpo).
  `
};

export const analyzeImage = async (files: File[], mode: AnalysisMode, userNotes?: string): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API Key non configurata.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Converti TUTTI i file in parti generative
    const imagePartsPromise = files.map(file => fileToGenerativePart(file));
    const imageParts = await Promise.all(imagePartsPromise);
    
    let promptText = PROMPTS[mode];

    if (files.length > 1) {
        promptText += `\n\nNOTA: Ti sono state fornite ${files.length} immagini. Considerale come parte dello stesso pannello roccioso o sito. Usale tutte per un'analisi incrociata (es. diverse luci, dettagli e totali).`;
    }

    if (userNotes && userNotes.trim() !== "") {
      promptText += `
        \n\n--- NOTE DI CAMPO (ARCHEOLOGO) ---
        "${userNotes}"
        
        ISTRUZIONI:
        Integra queste note nel contesto (localizzazione, orientamento, datazione stratigrafica se nota).
        --------------------------------------------------\n
      `;
    } else {
        promptText += `\n\n(Nessun contesto fornito: procedere con analisi "Blind" morfologica pura).`;
    }
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
            role: 'user',
            parts: [
                ...imageParts, // Spread di tutte le immagini
                { text: promptText }
            ]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Basso per rigore scientifico
      }
    });

    return response.text || "Il modello non ha rilevato elementi significativi per un'analisi archeologica.";
  } catch (error) {
    console.error("Errore analisi:", error);
    throw new Error("Errore durante l'elaborazione dei dati rupestri.");
  }
};