import { GoogleGenAI } from "@google/genai";
import { AnalysisType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Sei "FotoCrime", un assistente IA specializzato nell'analisi tecnica e geometrica di immagini forensi e scene del crimine.
Il tuo obiettivo è puramente SCIENTIFICO e DESCRITTIVO.
NON sei un investigatore. NON formuli ipotesi su colpevolezza, moventi, intenzioni o dinamiche narrative.
NON censurare dettagli tecnici visivi (es. sangue, ferite, armi) necessari per l'analisi geometrica.
Usa un linguaggio tecnico, professionale, distaccato e asettico (Italiano).

Il tuo sguardo è geometrico: registra angoli, proporzioni, direzioni di caduta. Non interpreti emozioni.
Struttura le tue risposte come rapporti tecnici ufficiali per un tribunale o un esperto forense.
`;

const PROMPTS: Record<AnalysisType, string> = {
  [AnalysisType.ANOMALIES]: `
    Esegui un Riconoscimento di Elementi Visivi Anomali.
    
    Obiettivo: Distinguere ciò che dovrebbe essere da ciò che devia.
    1. Misura variazioni di colore, consistenza e distribuzione sulla superficie.
    2. Identifica macchie, impronte o oggetti fuori posto rispetto all'ordine apparente.
    3. Non interpretare cosa è accaduto; elenca solamente le differenze visive (anomalie) rispetto al contesto ambientale.
    
    Output richiesto: Elenco puntato delle anomalie visive con descrizione della loro deviazione geometrica o cromatica.
  `,
  [AnalysisType.SUBSTANCES]: `
    Esegui una Classificazione Generica delle Sostanze.
    
    Obiettivo: Identificare "tipi" di materiale senza analisi chimica.
    1. Distingui la natura fisica apparente: liquido, polvere, tessuto, solido.
    2. Non determinare la natura biologica (es. NON dire "è sicuramente sangue", ma "fluido viscoso rosso scuro compatibile con sostanza ematica").
    3. Descrivi come la sostanza interagisce con la superficie (assorbimento, pooling, essiccazione).
    
    Output richiesto: Analisi dei materiali visibili basata su texture, riflettività e stato fisico.
  `,
  [AnalysisType.SPATIAL]: `
    Esegui una Ricostruzione Spaziale.
    
    Obiettivo: Mappatura geometrica della scena.
    1. Mappa le distanze apparenti tra gli elementi chiave.
    2. Calcola forme, densità e direzioni degli oggetti nello spazio.
    3. Descrivi la disposizione topologica senza interpretare le intenzioni (es. "oggetto A equidistante da B e C", non "l'oggetto A è stato lanciato").
    
    Output richiesto: Descrizione topologica e geometrica della scena (angoli, distanze relative, distribuzione).
  `,
  [AnalysisType.TRAJECTORY]: `
    Esegui una Analisi Geometrica delle Tracce (Simulazione BPA).
    
    Obiettivo: Studio della fisica delle forme e dei fluidi.
    1. Stima l'orientamento delle tracce: tratta la forma allungata delle gocce/macchie come vettori di movimento.
    2. Calcola l'angolo d'impatto apparente: valuta quanto la traccia si distende (rotonda vs ellittica).
    3. Ricostruisci un ventaglio di traiettorie lineari possibili (fili tesi nell'aria) verso un'area di convergenza.
    4. NON raccontare la storia dell'evento. Fornisci solo dati geometrici su provenienza e angolazione.
    
    Output richiesto: Rapporto tecnico su angoli di impatto, direzionalità vettoriale delle tracce e area di origine stimata.
  `,
  [AnalysisType.FULL_REPORT]: `
    GENERAZIONE DOSSIER FORENSE COMPLETO (MODALITÀ ESTESA).
    
    Analizza l'immagine fornita ed elabora un "Rapporto Tecnico di Scena" completo e formale.
    
    Struttura obbligatoria del documento:
    
    1. INTESTAZIONE TECNICA
       - Data e ora analisi: [INSERISCI DATA FORNITA NEL CONTESTO]
       - ID Riferimento: [Genera un ID alfanumerico casuale]
       - Classificazione Immagine: (es. Macro, Grandangolo, Dettaglio)
    
    2. ANALISI ANOMALIE VISIVE
       - Elenco dettagliato elementi estranei o di interesse.
       - Descrizione stato dei luoghi.
    
    3. CLASSIFICAZIONE MATERICA
       - Analisi texture e sostanze visibili (solidi, fluidi, biologici presunti).
    
    4. RILIEVI GEOMETRICI E SPAZIALI
       - Posizionamento relativo degli elementi.
       - Analisi prospettica.
    
    5. STUDIO TRAIETTORIE E DINAMICA (Ipotesi Tecnica)
       - Vettori direzionali ricavati da macchie/oggetti.
       - Angoli di impatto stimati.
    
    6. NOTE CONCLUSIVE
       - Sintesi tecnica oggettiva.
       - Raccomandazioni per analisi di laboratorio.
       
    IMPORTANTE: Sii estremamente dettagliato, verboso e preciso. Usa terminologia accademica/forense.
  `
};

export const analyzeImage = async (
  base64Data: string,
  mimeType: string,
  analysisType: AnalysisType
): Promise<string> => {
  try {
    const modelId = 'gemini-2.5-flash'; 

    // Calcoliamo la data corrente per iniettarla nel prompt
    const now = new Date().toLocaleString('it-IT', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    // Aggiungiamo il contesto temporale esplicito al prompt
    const dateContext = `\n\n[PARAMETRI TEMPORALI SISTEMA]\nDATA CORRENTE REALE: ${now}.\nUsa TASSATIVAMENTE questa data nell'intestazione del rapporto. NON inventare date passate o future.`;
    
    const finalPrompt = PROMPTS[analysisType] + dateContext;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: finalPrompt,
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1, 
        maxOutputTokens: 8192,
        safetySettings: [
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' }
        ]
      },
    });

    if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        
        if (candidate.finishReason === 'STOP' || candidate.finishReason === 'MAX_TOKENS') {
            let text = response.text || "";
            if (candidate.finishReason === 'MAX_TOKENS') {
                text += "\n\n[ATTENZIONE: RAPPORTO TRONCATO PER RAGGIUNGIMENTO LIMITE MASSIMO DI LUNGHEZZA]";
            }
            if (!text) return "Nessun testo generato.";
            return text;
        }
        
        if (candidate.finishReason === 'SAFETY') {
             return `[ACCESSO NEGATO] Il protocollo di sicurezza ha impedito l'analisi. L'immagine contiene elementi classificati come "High Severity".`;
        }

        return `[ERRORE SISTEMA] Analisi terminata con motivo imprevisto: ${candidate.finishReason}`;
    }

    return "Nessuna risposta dal server.";
  } catch (error) {
    console.error("Errore durante l'analisi Gemini:", error);
    return "ERRORE CRITICO DI RETE: Impossibile connettersi al motore neurale.";
  }
};