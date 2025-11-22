# FotoCrime - Analisi Forense Assistita da IA

**Autore:** Claudio Arena  
**Versione:** 1.0.0  
**Stato:** Rilascio Stabile

---

## 🔍 Descrizione del Progetto

**FotoCrime** è un'applicazione web professionale progettata per l'analisi tecnica e geometrica di immagini relative a scene del crimine o contesti forensi. Utilizzando la potenza del modello neurale Gemini 2.5 Flash, l'applicazione funge da "assistente digitale" per rilevare dettagli che potrebbero sfuggire all'occhio umano, mantenendo un approccio rigorosamente scientifico e non interpretativo.

L'applicazione è costruita con un'interfaccia "Dark Mode" ad alto contrasto, ottimizzata per l'uso in ambienti con scarsa illuminazione o sale operative.

## 🚀 Funzionalità Principali

### 1. Analisi Anomalie Visive
Il sistema scansiona l'immagine alla ricerca di discrepanze cromatiche, oggetti fuori posto o dettagli che deviano dal pattern ambientale standard.

### 2. Classificazione Sostanze
Identificazione visiva (non chimica) di materiali, fluidi e texture. Distingue tra liquidi viscosi, polveri, frammenti solidi e tessuti, fornendo descrizioni fisiche dettagliate.

### 3. Ricostruzione Spaziale
Mappatura geometrica della scena. Calcola distanze relative, densità degli oggetti e prospettive per fornire una comprensione topologica dell'ambiente.

### 4. Analisi Traiettorie (Simulazione BPA)
Studio vettoriale delle tracce (macchie, spruzzi). Il modello stima angoli di impatto e direzioni di provenienza basandosi sulla forma geometrica delle evidenze (ellitticità, code, satelliti).

### 5. Dossier Forense Completo
Generazione di un rapporto onnicomprensivo che include tutti i punti precedenti, formattato come documento ufficiale con intestazione tecnica, ID univoco e note conclusive.

### 6. Export Documentale
Possibilità di esportare i risultati delle analisi in formato **PDF** e **DOCX** (Word), impaginati professionalmente con font monospaziati (Courier) dimensione 12pt.

### 7. Strumenti di Visualizzazione
- **Zoom Forense:** Modalità lente d'ingrandimento (2.5x) per ispezionare i dettagli dell'immagine senza perdere la risoluzione.
- **Layout Fisso:** L'immagine di riferimento rimane sempre visibile durante la lettura dei rapporti lunghi.

## 🛠 Note Tecniche

*   **Engine IA:** Google Gemini 2.5 Flash
*   **Framework:** React 19
*   **Styling:** Tailwind CSS
*   **Sicurezza:** I filtri di sicurezza standard sono stati calibrati su `BLOCK_NONE` per permettere l'analisi di materiale forense sensibile (sangue, ferite, armi) necessario per lo scopo dell'applicazione.
*   **Privacy:** Le immagini vengono processate in tempo reale e non vengono salvate su database permanenti dall'applicazione client.

## ⚠️ Disclaimer Legale

Questo software è uno strumento di supporto all'analisi geometrica. I risultati generati dall'IA **non costituiscono perizia forense certificata** e devono essere sempre validati da personale umano qualificato e specialisti del settore. L'IA non deduce colpevolezze né moventi.

---
© 2025 Claudio Arena. All Rights Reserved.