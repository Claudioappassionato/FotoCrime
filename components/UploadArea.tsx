import React, { ChangeEvent, useRef, useState } from 'react';
import { Upload, Image as ImageIcon, AlertTriangle, ZoomIn, ZoomOut } from 'lucide-react';
import { UploadedImage } from '../types';

interface UploadAreaProps {
  onImageSelected: (image: UploadedImage) => void;
  currentImage: UploadedImage | null;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onImageSelected, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isZoomEnabled, setIsZoomEnabled] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      
      onImageSelected({
        file,
        previewUrl: result,
        base64: base64Data,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomEnabled) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-sm font-bold text-cyan-500 uppercase tracking-widest font-mono flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Reperto Visivo
        </h2>
        
        <div className="flex items-center gap-3">
            {currentImage && (
                <button
                    onClick={() => setIsZoomEnabled(!isZoomEnabled)}
                    className={`p-1.5 rounded border transition-all ${isZoomEnabled ? 'bg-cyan-900/50 border-cyan-500 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-cyan-500/50'}`}
                    title={isZoomEnabled ? "Disattiva Lente" : "Attiva Lente Forense"}
                >
                    {isZoomEnabled ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                </button>
            )}
            
            {currentImage && (
            <button 
                onClick={triggerUpload}
                className="text-xs text-slate-400 hover:text-white underline decoration-slate-600 underline-offset-4 transition-colors"
            >
                Cambia
            </button>
            )}
        </div>
      </div>

      <div className="flex-1 relative group min-h-0 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-inner shadow-black/50">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />

        {currentImage ? (
          <div 
            className="relative w-full h-full overflow-hidden cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => isZoomEnabled}
            onMouseLeave={() => isZoomEnabled}
          >
            <img
              src={currentImage.previewUrl}
              alt="Evidence"
              className={`w-full h-full object-contain p-2 transition-transform duration-100 ease-out origin-center
                 ${isZoomEnabled ? 'scale-[2.5]' : 'scale-100'}
              `}
              style={isZoomEnabled ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
              } : {}}
            />
            
            {!isZoomEnabled && (
                <>
                <div className="absolute bottom-0 left-0 right-0 bg-slate-950/90 border-t border-slate-800 p-3 backdrop-blur-sm pointer-events-none">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <span className="w-2 h-2 bg-cyan-500 rounded-sm"></span>
                    FILE: {currentImage.file.name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1 uppercase">
                    SIZE: {(currentImage.file.size / 1024 / 1024).toFixed(2)} MB | TYPE: {currentImage.mimeType}
                </div>
                </div>
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_0%,rgba(34,211,238,0.05)_50%,transparent_100%)] bg-[length:100%_200%] animate-[scan_3s_linear_infinite]"></div>
                </>
            )}
            
            {isZoomEnabled && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-cyan-400 text-[10px] px-2 py-1 rounded font-mono border border-cyan-900 pointer-events-none">
                    ZOOM 2.5x ACTIVE
                </div>
            )}
          </div>
        ) : (
          <div 
            onClick={triggerUpload}
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800/30 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.05)]"
          >
            <div className="p-4 bg-slate-800 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-cyan-400" />
            </div>
            <p className="text-slate-300 font-medium mb-2">Carica Immagine Scena</p>
            <p className="text-xs text-slate-500 font-mono text-center px-8">
              JPG, PNG supportati. <br/>Massima risoluzione consigliata.
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-4 p-3 bg-yellow-950/20 border border-yellow-900/30 rounded flex items-start gap-3 shrink-0">
        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
        <p className="text-[10px] text-yellow-600/80 leading-relaxed">
          <strong className="uppercase">Disclaimer Legale:</strong> Questo strumento fornisce un'analisi geometrica automatizzata. 
          I risultati non costituiscono perizia forense certificata e devono essere validati da personale umano qualificato.
        </p>
      </div>
    </div>
  );
};

export default UploadArea;