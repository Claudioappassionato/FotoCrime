import React from 'react';
import { ScanEye, Activity } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-cyan-900/20 p-2 rounded-lg border border-cyan-900/50">
            <ScanEye className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Foto<span className="text-cyan-400">Crime</span>
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              Unit. Analisi Forense
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-mono text-slate-400">SYSTEM: ONLINE</span>
          </div>
          <Activity className="w-5 h-5 text-slate-500" />
        </div>
      </div>
    </header>
  );
};

export default Header;
