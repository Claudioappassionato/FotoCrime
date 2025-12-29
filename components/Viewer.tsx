import React, { useState, useRef, useEffect } from 'react';
import { IconZoomIn, IconZoomOut, IconLeft, IconRight } from './Icons';

interface ViewerProps {
  imageUrls: string[];
}

export const Viewer: React.FC<ViewerProps> = ({ imageUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset view when images change
  useEffect(() => {
    setCurrentIndex(0);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [imageUrls]); // Reset solo se cambia l'intero array

  // Reset zoom when switching index manually
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  const currentImage = imageUrls.length > 0 ? imageUrls[currentIndex] : null;

  const handleWheel = (e: React.WheelEvent) => {
    if (!currentImage) return;
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(1, scale + delta), 6); // Max zoom aumentato per forensic
    setScale(newScale);
  };

  const startDrag = (e: React.MouseEvent) => {
    if (!currentImage) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const onDrag = (e: React.MouseEvent) => {
    if (isDragging && currentImage) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < imageUrls.length - 1) setCurrentIndex(p => p + 1);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) setCurrentIndex(p => p - 1);
  };

  return (
    <div className="flex flex-col h-full gap-2">
        {/* Main Viewport */}
        <div className="relative flex-1 bg-stone-900 overflow-hidden border border-stone-700 rounded-lg shadow-inner group">
        {!currentImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-500 opacity-50 select-none pointer-events-none">
            <p className="text-sm font-mono">Nessun reperto caricato</p>
            </div>
        )}

        {currentImage && (
            <>
            <div 
                ref={containerRef}
                className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
                onWheel={handleWheel}
                onMouseDown={startDrag}
                onMouseMove={onDrag}
                onMouseUp={endDrag}
                onMouseLeave={endDrag}
            >
                <img 
                src={currentImage} 
                alt={`Reperto ${currentIndex + 1}`} 
                className="max-w-none transition-transform duration-75 ease-linear shadow-xl"
                style={{ 
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    maxHeight: '90%',
                    maxWidth: '90%',
                    objectFit: 'contain'
                }}
                draggable={false}
                />
            </div>

            {/* Navigation Arrows (Overlay) */}
            {imageUrls.length > 1 && (
                <>
                    <button 
                        onClick={prevImage}
                        disabled={currentIndex === 0}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-stone-950/50 hover:bg-stone-800 text-stone-200 rounded-full disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm transition-all border border-stone-700"
                    >
                        <IconLeft size={24} />
                    </button>
                    <button 
                        onClick={nextImage}
                        disabled={currentIndex === imageUrls.length - 1}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-stone-950/50 hover:bg-stone-800 text-stone-200 rounded-full disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm transition-all border border-stone-700"
                    >
                        <IconRight size={24} />
                    </button>
                </>
            )}

            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-stone-900/90 backdrop-blur-sm p-2 rounded-full border border-stone-600 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button 
                    onClick={() => setScale(s => Math.min(s + 0.5, 6))}
                    className="p-2 hover:bg-stone-700 rounded-full text-stone-200 active:bg-amber-600"
                    title="Ingrandisci"
                >
                    <IconZoomIn size={20} />
                </button>
                <span className="text-xs font-mono text-stone-400 self-center w-12 text-center select-none">
                {Math.round(scale * 100)}%
                </span>
                <button 
                    onClick={() => setScale(s => Math.max(s - 0.5, 1))}
                    className="p-2 hover:bg-stone-700 rounded-full text-stone-200 active:bg-amber-600"
                    title="Riduci"
                >
                    <IconZoomOut size={20} />
                </button>
            </div>

            {/* Image Counter Badge */}
            <div className="absolute top-4 right-4 bg-amber-600 text-stone-950 text-[10px] font-bold px-2 py-1 rounded font-mono shadow-lg border border-amber-500">
                REP. {currentIndex + 1}/{imageUrls.length}
            </div>
            </>
        )}
        </div>

        {/* Thumbnail Strip */}
        {imageUrls.length > 1 && (
            <div className="h-20 shrink-0 flex gap-2 overflow-x-auto p-2 bg-stone-900 border border-stone-800 rounded-lg">
                {imageUrls.map((url, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`relative aspect-square h-full rounded overflow-hidden border-2 transition-all ${idx === currentIndex ? 'border-amber-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}
                    >
                        <img src={url} className="w-full h-full object-cover" alt="thumbnail" />
                    </button>
                ))}
            </div>
        )}
    </div>
  );
};