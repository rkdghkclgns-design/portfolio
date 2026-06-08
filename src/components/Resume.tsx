import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeHeader } from './ResumeHeader';
import { ResumeExperience } from './ResumeExperience';
import { ResumeEducation } from './ResumeEducation';
import { ResumeTools } from './ResumeTools';
import { CoverLetter } from './CoverLetter';
import { PdfTemplate } from './PdfTemplate';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ResumeData } from '../types';

interface ResumeProps {
  setView: (v: any) => void;
  onBack: () => void;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  data: ResumeData;
  setData: (d: ResumeData) => void;
  activeTab: 'resume' | 'cover-letter';
  setActiveTab: (tab: 'resume' | 'cover-letter') => void;
  isGeneratingPdf: boolean;
  setIsGeneratingPdf: (v: boolean) => void;
}

export const Resume = ({ setView, onBack, isEditing, data, setData, activeTab, isGeneratingPdf }: ResumeProps) => {

  const handleDownload = () => {
    const htmlString = renderToStaticMarkup(<PdfTemplate data={data} />);
    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    if (!printWindow) {
      alert('팝업 차단이 활성화되어 있습니다. 팝업을 허용해주세요.');
      return;
    }

    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map(node => node.outerHTML)
      .join('\n');

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="utf-8">
          <title>홍길동_게임기획자_포트폴리오</title>
          ${styles}
          <style>
            @page { size: A4 portrait; margin: 0; }
            body { margin: 0; background: #f8f9fa; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .pdf-page { page-break-after: always; break-after: page; }
            .pdf-page:last-child { page-break-after: auto; break-after: auto; }
          </style>
        </head>
        <body>${htmlString}</body>
      </html>
    `);
    printWindow.document.close();

    printWindow.onload = () => {
      Promise.all([
        printWindow.document.fonts.ready,
        ...Array.from(printWindow.document.images).map(img =>
          img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
        )
      ]).then(() => {
        printWindow.focus();
        printWindow.print();
      });
    };

    const handleAfterPrint = () => {
      printWindow.close();
      printWindow.removeEventListener('afterprint', handleAfterPrint);
    };
    printWindow.addEventListener('afterprint', handleAfterPrint);
  };

  React.useEffect(() => {
    const handler = () => handleDownload();
    window.addEventListener('triggerPdfDownload', handler);
    return () => window.removeEventListener('triggerPdfDownload', handler);
  }, [activeTab, data]);

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="pt-28 pb-12 md:pb-20 px-6 md:px-12 max-w-[1300px] mx-auto w-full min-h-screen flex flex-col relative">

      <AnimatePresence mode="wait">
        {activeTab === 'resume' ? (
          <motion.div 
            key="resume"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[1080px] mx-auto bg-white shadow-[0_40px_120px_rgba(0,0,0,0.1)] border border-black/5 rounded-sm overflow-hidden flex flex-col"
          >
            <ResumeHeader data={data} setData={setData} isEditing={isEditing} isGeneratingPdf={isGeneratingPdf} />

            <div className="grid lg:grid-cols-12 gap-0">
              <aside className="lg:col-span-4 p-8 lg:p-10 border-r border-zinc-100 bg-[#FCFCFC]">
                <ResumeEducation data={data} setData={setData} isEditing={isEditing} />
              </aside>

              <main className="lg:col-span-8 p-8 lg:p-10 bg-white">
                <ResumeExperience data={data} setData={setData} isEditing={isEditing} />
                <ResumeTools data={data} />
              </main>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="cover-letter"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <CoverLetter setView={setView} isEditing={isEditing} data={data} setData={setData} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
