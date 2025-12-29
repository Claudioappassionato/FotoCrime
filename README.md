# PetraScan 🗿 - Analisi Forense di Arte Rupestre con IA

**PetraScan** è un'applicazione web professionale progettata per archeologi, ricercatori e appassionati di preistoria. Utilizza l'intelligenza artificiale generativa (Google Gemini 2.5) per assistere nell'analisi, catalogazione e interpretazione di arte rupestre, petroglifi, strutture megalitiche e tracce di lavorazione litica.

L'applicazione adotta un approccio "forense", combinando l'osservazione fenomenologica rigorosa con capacità di visione artificiale avanzata.

---

## 🌟 Funzionalità Principali

### 🔍 Analisi Multi-Modale
L'applicazione offre diverse modalità di indagine, ciascuna guidata da prompt ingegnerizzati specificamente per simulare diversi specialisti:

1.  **Report Completo (Standard)**: Un'analisi a 360° che copre morfologia, statica, tafonomia e ipotesi funzionale.
2.  **Simbologia**: Ricerca mirata di grafemi, coppelle, antropomorfi e pattern geometrici, distinguendo tra segni antropici e pareidolia.
3.  **Tecnica & Geologia**: Focus petrografico (litologia, fratturazione) e tecnologico (tracce d'uso, sbozzatura).
4.  **Confronto Culturale**: Analisi comparativa speculativa con culture note (es. Megalitismo Atlantico, Nuragico, Camuno).
5.  **Analisi Specialistica**: Modalità avanzata che integra metodologie di *Binford*, *Renfrew* e *Hodder* per una validazione scientifica profonda (Livelli di confidenza Alpha/Beta/Gamma).

### 🧠 Metodologia "Chaîne Opératoire"
Il cuore del sistema non si limita a descrivere l'immagine, ma tenta di ricostruire la **catena operativa**:
*   Estrazione della materia prima.
*   Trasporto.
*   Lavorazione (tecnologia litica).
*   Uso e Abbandono (processi post-deposizionali).

### ⚖️ Blind Test vs Analisi Assistita
*   **Modalità AUTO (Blind Test)**: L'IA analizza l'immagine senza bias esterni, basandosi solo sull'evidenza visiva.
*   **Modalità MANUALE**: L'utente può fornire note di scavo, coordinate o contesto storico che l'IA integrerà nel report finale.

### 📄 Export Professionale
*   **Markdown (.md)**: Per archiviazione digitale e modifica rapida.
*   **Microsoft Word (.doc)**: Formattato automaticamente con intestazioni, disclaimer e metadati per l'inclusione in pubblicazioni o relazioni tecniche.

---

## 🛠️ Stack Tecnologico

*   **Frontend**: React 19, TypeScript.
*   **Styling**: Tailwind CSS (Design System "Dark Stone" per ridurre l'affaticamento visivo in ambienti con poca luce).
*   **AI Engine**: Google GenAI SDK (`@google/genai`) con modello `gemini-2.5-flash`.
*   **Icons**: Lucide React.
*   **Build Tool**: Vite (implicito dalla struttura).

---

## 🚀 Installazione e Avvio

### Prerequisiti
*   Node.js (v18 o superiore)
*   Una API Key valida di Google Gemini (AI Studio).

### Setup

1.  **Clona il repository** (o scarica i file sorgente):
    ```bash
    git clone https://github.com/tuo-user/petrascan.git
    cd petrascan
    ```

2.  **Installa le dipendenze**:
    ```bash
    npm install
    ```

3.  **Configurazione API Key**:
    L'applicazione richiede che la variabile d'ambiente `API_KEY` sia iniettata nel processo di build o runtime.
    Crea un file `.env` nella root del progetto:
    ```env
    API_KEY=la_tua_chiave_gemini_qui
    ```

4.  **Avvia l'applicazione**:
    ```bash
    npm start
    ```
    L'app sarà disponibile su `http://localhost:3000` (o altra porta definita dal bundler).

---

## 📖 Guida all'Uso

1.  **Caricamento**: Trascina una foto del reperto nell'area dedicata o clicca "Seleziona File".
2.  **Contesto**:
    *   Lascia su **AUTO** per un'analisi oggettiva.
    *   Seleziona **MANUALE** per inserire note (es. *"Ritrovamento in Val Camonica, orientamento Sud-Est"*).
3.  **Analisi**: Scegli il tipo di analisi dal pannello di controllo a destra (es. *Tecnica & Geo*).
4.  **Attesa**: Il sistema simulerà i passaggi cognitivi (Scansione Morfologica -> Inferenza -> Validazione).
5.  **Risultato**: Leggi il report generato. Puoi zoomare l'immagine originale per verificare i dettagli citati nel testo.
6.  **Export**: Scarica il report in formato Word o Markdown.

---

## ⚠️ Disclaimer Scientifico e Legale

PetraScan è uno strumento di **supporto alla ricerca**. 

*   **Non costituisce perizia legale.**
*   I risultati sono generati da un modello probabilistico (LLM) e possono contenere "allucinazioni" (interpretazione errata di fratture naturali come segni antropici).
*   È imperativo che ogni risultato sia validato *in situ* da un archeologo qualificato.

---

## 🎨 Design System

L'interfaccia utilizza una palette cromatica ispirata alla pietra e alla terra:
*   **Stone 950/900**: Background (simula l'oscurità di una grotta o l'ambiente notturno).
*   **Amber 600**: Accenti (richiama il colore dell'ocra rossa usata nel paleolitico o la luce delle torce).
*   **Font**: *Inter* per l'UI, *Courier Prime* per i report (stile macchina da scrivere/documento tecnico).

---

**Autore**: Progetto generato per analisi forense digitale.
