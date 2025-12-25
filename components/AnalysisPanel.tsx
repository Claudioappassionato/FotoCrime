import React, { useState } from 'react';
import { AnalysisType } from '../types';
import { Microscope, Layers, Ruler, Target, Loader2, ChevronRight, FileText, Download, FileCheck, MessageSquarePlus } from 'lucide-react';
import { downloadPDF, downloadDOCX } from '../services/reportService';

interface AnalysisPanelProps {
  selectedMode: AnalysisType | null;
  onModeSelect: (mode: AnalysisType, customInstruction?: string) => void;
  isAnalyzing: boolean;
  result: string | null;
  hasImage: boolean;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ 
  selectedMode, 
  onModeSelect, 
  isAnalyzing, 
  result,
  hasImage 
}) => {
  const [customInstruction, setCustomInstruction] = useState("");

  const modes = [
    {
      id: AnalysisType.ANOMALIES,
      label: 'Anomalie Visive',
      desc: 'Rilevamento discrepanze.',
      icon: Microscope,
      color: 'text-purple-400',
      border: 'hover:border-purple-500/50'
    },
    {
      id: AnalysisType.SUBSTANCES,
      label: 'Sostanze',
      desc: 'Analisi visiva texture.',
      icon: Layers,
      color: 'text-emerald-400',
      border: 'hover:border-emerald-500/50'
    },
    {
      id: AnalysisType.SPATIAL,
      label: 'Spaziale',
      desc: 'Mappatura distanze.',
      icon: Ruler,
      color: 'text-blue-400',
      border: 'hover:border-blue-500/50'
    },
    {
      id: AnalysisType.TRAJECTORY,
      label: 'Traiettorie',
      desc: 'Angoli di impatto.',
      icon: Target,
      color: 'text-rose-400',
      border: 'hover:border-rose-500/50'
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 shrink-0">
        <h2 className="text-sm font-bold text-cyan-500 uppercase tracking-widest font-mono mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-500 rotate-45"></div>
          Protocolli di Analisi
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onModeSelect(mode.id, customInstruction)}
              disabled={!hasImage || isAnalyzing}
              className={`relative text-left p-3 rounded-lg border transition-all duration-200 group
                ${selectedMode === mode.id 
                  ? 'bg-slate-800 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                  : 'bg-slate-900/50 border-slate-800 ' + mode.border}
                ${!hasImage || isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800'}
              `}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div className={`p-1.5 rounded-md bg-slate-950 border border-slate-800 ${selectedMode === mode.id ? mode.color : 'text-slate-500'}`}>
                  <mode.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-xs font-semibold ${selectedMode === mode.id ? 'text-slate-100' : 'text-slate-300'}`}>
                    {mode.label}
                  </h3>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Full Report Button */}
        <button
          onClick={() => onModeSelect(AnalysisType.FULL_REPORT, customInstruction)}
          disabled={!hasImage || isAnalyzing}
          className={`w-full flex items-center justify-center gap-3 p-3 rounded-lg border border-dashed transition-all duration-300 mb-4
            ${selectedMode === AnalysisType.FULL_REPORT 
              ? 'bg-cyan-950/30 border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.1)]' 
              : 'bg-slate-900/20 border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400'}
             ${!hasImage || isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
           {isAnalyzing && selectedMode === AnalysisType.FULL_REPORT ? (
             <Loader2 className="w-5 h-5 animate-spin" />
           ) : (
             <FileCheck className="w-5 h-5" />
           )}
           <span className="font-mono font-bold uppercase tracking-wider text-sm">Genera Dossier Forense Completo</span>
        </button>

        {/* Custom Instruction Input */}
        <div>
             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-2 mb-2">
                <MessageSquarePlus className="w-3 h-3" />
                Note Operative Aggiuntive (Opzionale)
             </label>
             <textarea
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder="Inserisci istruzioni specifiche per l'analisi (es. 'Concentrati sulla ferita alla gamba', 'Ignora lo sfondo')..."
                className="w-full bg-slate-950/50 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-900/50 transition-all resize-none h-16"
                disabled={isAnalyzing}
             />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2">
             <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2">
               <span>Registro Output</span>
               {result && <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-500">READ-ONLY</span>}
             </h2>
             {result && (
               <div className="flex gap-2">
                  <button 
                    onClick={() => downloadDOCX(result)}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-900/30 border border-blue-800/50 rounded hover:bg-blue-900/50 text-[10px] text-blue-300 font-mono transition-colors"
                  >
                    <FileText className="w-3 h-3" /> DOCX
                  </button>
                  <button 
                    onClick={() => downloadPDF(result)}
                    className="flex items-center gap-1 px-2 py-1 bg-red-900/30 border border-red-800/50 rounded hover:bg-red-900/50 text-[10px] text-red-300 font-mono transition-colors"
                  >
                    <Download className="w-3 h-3" /> PDF
                  </button>
               </div>
             )}
        </div>
        
        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden relative flex flex-col shadow-inner shadow-black">
            {/* Terminal Header */}
            <div className="bg-slate-900 border-b border-slate-800 p-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <div className="ml-2 text-[10px] font-mono text-slate-500 flex-1">
                    terminal://fotocrime-agent/output
                </div>
                {selectedMode === AnalysisType.FULL_REPORT && isAnalyzing && (
                   <span className="text-[10px] text-cyan-500 font-mono animate-pulse">GENERATING REPORT...</span>
                )}
            </div>

            {/* Terminal Content */}
            <div className="flex-1 p-6 overflow-y-auto font-mono text-sm leading-relaxed text-slate-300 selection:bg-cyan-900 selection:text-cyan-100">
                {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-70">
                        <div className="relative w-16 h-16">
                             <div className="absolute inset-0 rounded-full border-2 border-t-cyan-500 border-r-transparent border-b-cyan-700 border-l-transparent animate-spin"></div>
                             <div className="absolute inset-2 rounded-full border-2 border-r-cyan-500 border-b-transparent border-l-cyan-700 border-t-transparent animate-spin-reverse"></div>
                        </div>
                        <div className="text-center">
                            <p className="text-cyan-400 animate-pulse">ELABORAZIONE {selectedMode === AnalysisType.FULL_REPORT ? 'COMPLETA' : 'GEOMETRICA'} IN CORSO...</p>
                            <p className="text-xs text-slate-600 mt-1">
                              {selectedMode === AnalysisType.FULL_REPORT 
                                ? "L'analisi approfondita richiede più tempo. Non spegnere." 
                                : "Calcolo vettori e densità."}
                            </p>
                        </div>
                    </div>
                ) : result ? (
                    <div className="whitespace-pre-wrap animate-fade-in">
                        <div className="border-l-2 border-cyan-900 pl-4 mb-4 flex justify-between items-start">
                            <div>
                              <span className="text-cyan-600 text-xs uppercase font-bold">Status:</span> <span className="text-cyan-400 text-xs">COMPLETO</span>
                              <div className="text-[10px] text-slate-500 mt-1">Tokens: {result.length} chars (approx)</div>
                            </div>
                        </div>
                        {result}
                        <div className="mt-8 pt-4 border-t border-slate-800/50 text-xs text-slate-600 flex items-center gap-2">
                             <ChevronRight className="w-3 h-3" />
                             Fine del rapporto.
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
                        <p className="text-xs uppercase tracking-widest">In attesa di input</p>
                        <p className="text-[10px]">Seleziona un protocollo o Genera un Dossier Completo.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;