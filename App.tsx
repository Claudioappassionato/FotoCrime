import React, { useState, useRef } from 'react';
import { Viewer } from './components/Viewer';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { analyzeImage } from './services/geminiService';
import { AnalysisMode, AnalysisResult, ProcessingState } from './types';
import { 
  IconReport, 
  IconClose,
  IconLogo,
  IconAnalyze,
  IconMarkdown,
  IconWord,
  IconAuto,
  IconManual,
  IconFiles,
  IconSymbology,
  IconGeo,
  IconCulture,
  IconExpert,
  IconTech
} from './components/Icons';

export default function App() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({ isAnalyzing: false, statusMessage: '' });
  const [inputMode, setInputMode] = useState<'AUTO' | 'MANUAL'>('AUTO');
  const [userNotes, setUserNotes] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Cleanup old URLs
      imageUrls.forEach(url => URL.revokeObjectURL(url));
      
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      
      setSelectedFiles(newFiles);
      setImageUrls(newUrls);
      setResult(null); 
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const runAnalysis = async (mode: AnalysisMode) => {
    if (selectedFiles.length === 0) return;

    setProcessing({ isAnalyzing: true, statusMessage: 'Inizializzazione Core Archeologico...' });
    
    // Simulate steps for UX
    setTimeout(() => setProcessing(prev => ({ ...prev, statusMessage: `Scansione morfologica (${selectedFiles.length} viste)...` })), 800);
    setTimeout(() => setProcessing(prev => ({ ...prev, statusMessage: 'Identificazione grafemi e patine...' })), 2000);
    if (inputMode === 'MANUAL') {
        setTimeout(() => setProcessing(prev => ({ ...prev, statusMessage: 'Integrazione Note di Scavo...' })), 3000);
    }
    
    setTimeout(() => setProcessing(prev => ({ ...prev, statusMessage: 'Redazione Scheda Tecnica...' })), 4000);

    try {
      const notesToPass = inputMode === 'MANUAL' ? userNotes : undefined;
      const markdown = await analyzeImage(selectedFiles, mode, notesToPass);
      setResult({
        markdown,
        timestamp: new Date().toLocaleString(),
        mode,
        imageUrls: imageUrls
      });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setProcessing({ isAnalyzing: false, statusMessage: '' });
    }
  };

  const clearSession = () => {
    imageUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setImageUrls([]);
    setResult(null);
    setUserNotes('');
    setInputMode('AUTO');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Export Functions ---

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadMD = () => {
    if (!result) return;
    const filename = `PetraScan_Rilievo_${new Date().toISOString().slice(0,10)}.md`;
    downloadFile(result.markdown, filename, 'text/markdown');
  };

  const handleDownloadDoc = () => {
    if (!result) return;

    let htmlBody = result.markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
      .replace(/\*(.*?)\*\*/gim, '<i>$1</i>')
      .replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>') 
      .replace(/\n/gim, '<br>');

    htmlBody = htmlBody.replace(/<\/ul><br><ul>/gim, '');

    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>PetraScan Report</title>
        <style>
          body { font-family: 'Courier Prime', 'Courier New', monospace; font-size: 11pt; line-height: 1.4; }
          h1 { font-size: 18pt; color: #000; border-bottom: 2px solid #000; padding-bottom: 10px; text-transform: uppercase; }
          h2 { font-size: 14pt; color: #333; margin-top: 20px; text-decoration: underline; }
          h3 { font-size: 12pt; color: #555; font-weight: bold; }
          .header { margin-bottom: 30px; border: 1px solid #000; padding: 15px; }
          .footer { margin-top: 50px; font-size: 9pt; text-align: center; border-top: 1px solid #000; padding-top: 10px; }
          .notes { background-color: #eee; padding: 10px; margin-bottom: 20px; font-style: italic; border-left: 5px solid #333; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PetraScan - Scheda Rilievo</h1>
          <p>
            <strong>ID Scheda:</strong> ${Math.random().toString(36).substr(2, 8).toUpperCase()}<br/>
            <strong>Data Rilievo:</strong> ${result.timestamp}<br/>
            <strong>Tipologia Analisi:</strong> ${result.mode}<br/>
            <strong>Immagini Analizzate:</strong> ${selectedFiles.length}
          </p>
        </div>
        ${inputMode === 'MANUAL' && userNotes ? `
        <div class="notes">
          <strong>Note di Campo:</strong> ${userNotes}
        </div>` : ''}
        <div class="content">
          ${htmlBody}
        </div>
        <div class="footer">
          GENERATO DA PETRASCAN IA - SUPPORTO ALLA RICERCA ARCHEOLOGICA<br/>
          RICHIEDE VALIDAZIONE IN SITU
        </div>
      </body>
      </html>
    `;

    const filename = `PetraScan_Report_${new Date().toISOString().slice(0,10)}.doc`;
    downloadFile(docContent, filename, 'application/msword');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-stone-950 text-stone-200 overflow-hidden font-sans">
      {/* Header */}
      <header className="h-16 border-b border-stone-800 bg-slate-900 flex items-center justify-between px-6 shrink-0 z-20 shadow-lg select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-600 rounded flex items-center justify-center text-stone-950 shadow-amber-600/20 shadow-lg">
            <IconLogo size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-stone-100 leading-none uppercase">PetraScan</h1>
            <p className="text-[10px] text-amber-500 font-mono tracking-widest uppercase opacity-80">Analisi Arte Rupestre & Megalitismo</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-stone-500">
          <span>RESEARCH UNIT</span>
          <span>|</span>
          <span className="text-amber-500/80">v3.0 (Multi-View)</span>
          <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse ml-2" title="System Ready"></div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Left Panel: Viewer & Context */}
        <div className="flex-1 flex flex-col p-4 gap-4 min-w-0 bg-stone-950 relative border-r border-stone-800">
           
           {/* Viewer Container */}
           <div className="flex-1 min-h-0 relative"> 
              <Viewer imageUrls={imageUrls} />
              
               {/* Upload Overlay */}
              {imageUrls.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                  <div className="bg-stone-900/90 border border-stone-700 p-8 rounded-sm shadow-2xl backdrop-blur-md flex flex-col items-center gap-4 max-w-md text-center pointer-events-auto transition-transform hover:scale-105">
                    <div className="w-16 h-16 rounded bg-stone-800 flex items-center justify-center mb-2 border border-stone-600">
                        <IconFiles size={32} className="text-stone-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-200 uppercase tracking-wide">Nuovo Rilievo</h3>
                      <p className="text-stone-500 text-sm mt-1 font-mono">Carica una o più foto (dettagli, luce radente)</p>
                    </div>
                    <button 
                      onClick={triggerFileInput}
                      className="mt-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-2 px-6 rounded-sm transition-colors shadow-lg shadow-amber-900/20 active:bg-amber-700 uppercase tracking-wider text-xs"
                    >
                      Apri Foto
                    </button>
                  </div>
                </div>
              )}
           </div>

           {/* Context Panel */}
           {imageUrls.length > 0 && (
             <div className="h-40 shrink-0 bg-stone-900 border border-stone-800 rounded-sm p-4 shadow-lg flex flex-col gap-2 transition-all">
                <div className="flex items-center justify-between mb-1">
                   <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Note di Scavo</span>
                   </div>
                   <div className="flex bg-stone-950 rounded-sm p-1 border border-stone-800 gap-1">
                      <button
                        onClick={() => setInputMode('AUTO')}
                        className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono rounded-sm transition-all ${inputMode === 'AUTO' ? 'bg-stone-700 text-stone-100 shadow-sm' : 'text-stone-500'}`}
                      >
                        <IconAuto size={12} />
                        BLIND
                      </button>
                      <button
                        onClick={() => setInputMode('MANUAL')}
                        className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono rounded-sm transition-all ${inputMode === 'MANUAL' ? 'bg-amber-600 text-stone-950 font-bold shadow-sm' : 'text-stone-500'}`}
                      >
                        <IconManual size={12} />
                        MANUALE
                      </button>
                   </div>
                </div>

                <div className="relative flex-1">
                  {inputMode === 'MANUAL' ? (
                    <textarea
                      value={userNotes}
                      onChange={(e) => setUserNotes(e.target.value)}
                      placeholder="Inserisci località, orientamento, contesto geologico o datazione presunta..."
                      className="w-full h-full bg-stone-950/80 border border-stone-700 rounded-sm p-3 text-sm font-mono text-stone-300 focus:outline-none focus:border-amber-600/50 resize-none placeholder:text-stone-700"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center border border-stone-800 border-dashed rounded-sm bg-stone-950/30 text-stone-600 text-xs font-mono select-none">
                      <span className="flex items-center gap-2">
                        <IconAuto size={14} />
                        Analisi oggettiva (Morfologia Pura). Nessun bias esterno.
                      </span>
                    </div>
                  )}
                </div>
             </div>
           )}

           <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleFileSelect} 
             accept="image/*" 
             multiple 
             className="hidden" 
           />
        </div>

        {/* Right Panel: Controls & Results */}
        <div className="w-[450px] bg-stone-900 flex flex-col min-h-0 shadow-2xl relative z-10 border-l border-stone-800">
          
          {/* Action Bar */}
          <div className="p-6 border-b border-stone-800 shrink-0">
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600">Protocolli di Analisi</h2>
                {imageUrls.length > 0 && (
                  <button onClick={clearSession} className="text-stone-500 hover:text-red-500 transition-colors flex items-center gap-1 text-[10px] uppercase font-bold" title="Chiudi Scheda">
                    <IconClose size={14} /> Chiudi Scheda
                  </button>
                )}
             </div>

             <div className="grid grid-cols-2 gap-3">
                <button 
                  disabled={imageUrls.length === 0 || processing.isAnalyzing}
                  onClick={() => runAnalysis(AnalysisMode.SYMBOLOGY)}
                  className="flex flex-col items-center gap-2 p-3 bg-stone-800 hover:bg-stone-750 border border-stone-700 rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 group"
                >
                  <IconSymbology className="text-fuchsia-400 group-hover:scale-110 transition-transform" size={20} />
                  <span className="text-xs font-medium text-stone-300">Simbologia</span>
                </button>

                <button 
                   disabled={imageUrls.length === 0 || processing.isAnalyzing}
                   onClick={() => runAnalysis(AnalysisMode.TECHNIQUE_GEO)}
                   className="flex flex-col items-center gap-2 p-3 bg-stone-800 hover:bg-stone-750 border border-stone-700 rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 group"
                >
                  <IconTech className="text-emerald-400 group-hover:scale-110 transition-transform" size={20} />
                  <span className="text-xs font-medium text-stone-300">Tecnica & Geo</span>
                </button>

                <button 
                   disabled={imageUrls.length === 0 || processing.isAnalyzing}
                   onClick={() => runAnalysis(AnalysisMode.CULTURAL_COMPARE)}
                   className="flex flex-col items-center gap-2 p-3 bg-stone-800 hover:bg-stone-750 border border-stone-700 rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 group"
                >
                  <IconCulture className="text-cyan-400 group-hover:scale-110 transition-transform" size={20} />
                  <span className="text-xs font-medium text-stone-300">Confronto</span>
                </button>

                 <button 
                   disabled={imageUrls.length === 0 || processing.isAnalyzing}
                   onClick={() => runAnalysis(AnalysisMode.EXPERT_VALIDATION)}
                   className="flex flex-col items-center gap-2 p-3 bg-stone-800 hover:bg-stone-750 border border-stone-700 rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 group"
                >
                  <IconExpert className="text-rose-400 group-hover:scale-110 transition-transform" size={20} />
                  <span className="text-xs font-medium text-stone-300">Analisi Esperta</span>
                </button>

                <button 
                   disabled={imageUrls.length === 0 || processing.isAnalyzing}
                   onClick={() => runAnalysis(AnalysisMode.FULL_REPORT)}
                   className="col-span-2 flex items-center justify-center gap-3 p-3 bg-amber-900/20 hover:bg-amber-900/30 border border-amber-800/50 rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 relative overflow-hidden group mt-1"
                >
                  <IconReport className="text-amber-500 group-hover:scale-110 transition-transform" size={20} />
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wide">Scheda Rilievo Completa</span>
                </button>
             </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-stone-900">
            {processing.isAnalyzing ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-center animate-in fade-in duration-500">
                <div className="w-12 h-12 border-4 border-stone-800 border-t-amber-600 rounded-full animate-spin"></div>
                <div>
                   <p className="text-stone-300 font-mono text-sm uppercase">{processing.statusMessage}</p>
                   <p className="text-stone-600 text-xs mt-1">Elaborazione Neurale in corso...</p>
                </div>
              </div>
            ) : result ? (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-6 border-b border-stone-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-stone-100 uppercase">Esito Analisi</h3>
                    <p className="text-xs text-stone-500 font-mono">ID: {Math.random().toString(36).substr(2, 10).toUpperCase()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleDownloadMD}
                      className="flex items-center gap-2 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 rounded-sm border border-stone-700 transition-colors text-xs font-mono text-stone-300"
                      title="Scarica Markdown"
                    >
                      <IconMarkdown size={14} />
                      MD
                    </button>
                    <button 
                      onClick={handleDownloadDoc}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-800/50 rounded-sm transition-colors text-xs font-mono text-blue-200"
                      title="Scarica Documento Word"
                    >
                      <IconWord size={14} />
                      DOC
                    </button>
                  </div>
                </div>
                
                {inputMode === 'MANUAL' && userNotes && (
                   <div className="mb-6 p-3 bg-amber-900/10 border-l-2 border-l-amber-600 text-xs text-stone-400 font-mono italic">
                      <strong className="text-amber-600 not-italic block mb-1 uppercase">Contesto Fornito:</strong>
                      "{userNotes}"
                   </div>
                )}

                <div className="font-mono text-sm">
                   <MarkdownRenderer content={result.markdown} />
                </div>
                
                <div className="mt-8 p-4 bg-stone-950 border border-amber-900/30 rounded-sm text-xs text-stone-500 font-mono leading-relaxed text-justify">
                  <strong className="text-amber-800">DISCLAIMER:</strong> L'analisi è generata da un sistema IA probabilistico. Non sostituisce la validazione scientifica in situ. Verificare sempre fratture naturali vs segni antropici.
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                <IconAnalyze size={48} className="text-stone-600 mb-4" />
                <p className="text-sm font-medium text-stone-400 uppercase tracking-widest">Sistema in attesa</p>
                <p className="text-xs text-stone-600 mt-2 max-w-[200px]">Carica le immagini del reperto o del sito per iniziare.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}