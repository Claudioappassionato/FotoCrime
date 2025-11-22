import { jsPDF } from "jspdf";

export const downloadPDF = (content: string, filename: string = 'Rapporto_Forense.pdf') => {
  const doc = new jsPDF();
  
  // Configurazione font
  doc.setFont("courier"); // Font monospaziato per look tecnico
  
  // Intestazione
  doc.setFontSize(16);
  doc.text("FOTOCRIME - RAPPORTO DI ANALISI FORENSE", 10, 20);
  
  doc.setFontSize(10);
  doc.text(`Autore Software: Claudio Arena | Data: ${new Date().toLocaleString()}`, 10, 30);
  doc.line(10, 35, 200, 35);

  // Contenuto - Impostato a size 11/12 come richiesto per leggibilità standard
  doc.setFontSize(11); 
  
  const splitText = doc.splitTextToSize(content, 180);
  let y = 45;
  
  splitText.forEach((line: string) => {
    // Controllo fine pagina
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 10, y);
    y += 5; // Interlinea
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Pagina ${i} di ${pageCount} - Documento generato da FotoCrime (Dev: Claudio Arena)`, 10, 290);
  }

  doc.save(filename);
};

export const downloadDOCX = (content: string, filename: string = 'Rapporto_Forense.doc') => {
  // Costruiamo un HTML strutturato specificamente per l'engine di importazione di Word
  // Usiamo stili inline pesanti e definizioni XML per forzare il rendering
  const preHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Rapporto Forense</title>
      <!-- XML per dire a Word come comportarsi -->
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
        </w:WordDocument>
      </xml>
      <style>
        /* Reset CSS per Word */
        @page {
            size: 21cm 29.7cm;
            margin: 2.54cm 2.54cm 2.54cm 2.54cm;
            mso-page-orientation: portrait;
        }
        body { 
            font-family: 'Courier New', Courier, monospace; 
            font-size: 12.0pt; 
        }
      </style>
    </head>
    <body style="font-family: 'Courier New', Courier, monospace; font-size: 12.0pt;">
    
    <div style="font-family: Arial, sans-serif; margin-bottom: 20px;">
        <h2 style="font-size: 16pt; margin-bottom: 5px;">FOTOCRIME - RAPPORTO TECNICO</h2>
        <p style="font-size: 10pt; color: #555; margin-top: 0;">
            Generato il: ${new Date().toLocaleString()} | Dev: Claudio Arena
        </p>
        <hr size="1" color="#000000" />
    </div>

    <!-- 
      IMPORTANTE: 
      1. Usiamo style inline ESPLICITI su questo div per forzare Word.
      2. white-space: pre-wrap mantiene l'impaginazione del testo raw.
    -->
    <div style="font-family: 'Courier New', Courier, monospace; font-size: 12.0pt; line-height: 1.2; white-space: pre-wrap;">`;
    
  const postHtml = "</div></body></html>";
  
  const html = preHtml + content + postHtml;

  const blob = new Blob(['\ufeff', html], {
      type: 'application/msword'
  });
  
  const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
  
  const downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);
  
  const nav = navigator as any;
  if(nav.msSaveOrOpenBlob ){
      nav.msSaveOrOpenBlob(blob, filename);
  } else {
      downloadLink.href = url;
      downloadLink.download = filename;
      downloadLink.click();
  }
  
  document.body.removeChild(downloadLink);
};