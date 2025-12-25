import React, { useState } from 'react';
import Header from './components/Header';
import UploadArea from './components/UploadArea';
import AnalysisPanel from './components/AnalysisPanel';
import { AnalysisType, UploadedImage } from './types';
import { analyzeImage } from './services/geminiService';

const App: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<UploadedImage | null>(null);
  const [selectedMode, setSelectedMode] = useState<AnalysisType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);

  const handleImageSelected = (image: UploadedImage) => {
    setCurrentImage(image);
    setResult(null);
    setSelectedMode(null);
  };

  const handleModeSelect = async (mode: AnalysisType, customInstruction?: string) => {
    if (!currentImage || isAnalyzing) return;

    setSelectedMode(mode);
    setIsAnalyzing(true);
    setResult(null);

    try {
      const text = await analyzeImage(currentImage.base64, currentImage.mimeType, mode, customInstruction);
      setResult(text);
    } catch (error) {
      console.error(error);
      setResult("ERRORE DI SISTEMA: Impossibile completare l'analisi. Riprovare.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/20 overflow-hidden">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          
          {/* Left Column: Image Upload & Preview 
              Usa h-full e overflow-hidden per assicurare che l'immagine stia ferma
          */}
          <div className="lg:col-span-5 h-full flex flex-col min-h-0">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 shadow-xl h-full backdrop-blur-sm flex flex-col overflow-hidden">
               <UploadArea 
                 onImageSelected={handleImageSelected}
                 currentImage={currentImage}
               />
            </div>
          </div>

          {/* Right Column: Controls & Output 
              Usa h-full per permettere lo scroll interno al pannello analisi
          */}
          <div className="lg:col-span-7 h-full flex flex-col min-h-0">
             <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 shadow-xl h-full backdrop-blur-sm flex flex-col overflow-hidden">
               <AnalysisPanel 
                 selectedMode={selectedMode}
                 onModeSelect={handleModeSelect}
                 isAnalyzing={isAnalyzing}
                 result={result}
                 hasImage={!!currentImage}
               />
             </div>
          </div>
          
        </div>
      </main>
      
      {/* Background ambient effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
};

export default App;