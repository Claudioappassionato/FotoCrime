import React from 'react';

export const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  // Very basic regex-based parser for the sake of no external heavy deps, 
  // tailored to Gemini's output structure (headers, bold, lists).
  
  const processText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Headers
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-amber-500 mt-6 mb-2 font-sans tracking-wide border-b border-stone-700 pb-1">{line.replace('### ', '')}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-stone-100 mt-8 mb-3 font-sans border-l-4 border-amber-600 pl-3">{line.replace('## ', '')}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-white mb-6 border-b-2 border-amber-600 pb-2">{line.replace('# ', '')}</h1>;
      
      // List items
      if (line.trim().startsWith('- ')) {
        const content = line.trim().substring(2);
        return <li key={i} className="ml-6 list-disc text-stone-300 font-mono text-sm leading-relaxed mb-1 pl-1 marker:text-amber-600">
           {parseInline(content)}
        </li>;
      }
      if (line.trim().match(/^\d+\./)) {
        const content = line.trim().replace(/^\d+\.\s*/, '');
        return <li key={i} className="ml-6 list-decimal text-stone-300 font-mono text-sm leading-relaxed mb-1 pl-1 marker:text-amber-600">
          {parseInline(content)}
        </li>;
      }

      // Empty lines
      if (line.trim() === '') return <div key={i} className="h-2"></div>;

      // Paragraphs
      return <p key={i} className="text-stone-300 font-mono text-sm leading-relaxed mb-2 text-justify">{parseInline(line)}</p>;
    });
  };

  const parseInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-amber-200 font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return <div className="markdown-body">{processText(content)}</div>;
};