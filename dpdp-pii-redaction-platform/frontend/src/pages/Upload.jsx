import React, { useState } from 'react';
import { Upload, X, ShieldCheck, FileCheck, ArrowRight } from 'lucide-react';

const UploadPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles([...files, ...Array.from(e.dataTransfer.files)]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Detect PII in Documents</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Upload PDF, images, or documents to scan for Aadhaar, PAN, and other sensitive entities under DPDP framework.
        </p>
      </div>

      <div 
        className={`relative h-80 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all duration-300 bg-slate-900/40 backdrop-blur-sm shadow-2xl ${
          dragActive ? 'border-primary-500 bg-primary-500/5 ring-8 ring-primary-500/10' : 'border-slate-800 hover:border-slate-700'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <Upload className="w-10 h-10 text-primary-500" />
        </div>
        <p className="text-xl font-medium text-slate-200">Drag and drop files here</p>
        <p className="text-slate-500 mt-2">or <span className="text-primary-400 cursor-pointer hover:underline">browse files</span></p>
        <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" />
      </div>

      {files.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-500" />
            Queued for Processing ({files.length})
          </h3>
          <div className="space-y-3">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700 group hover:border-slate-600 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-400 uppercase">{file.name.split('.').pop()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={() => setFiles(files.filter((_, index) => index !== i))}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <button className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all group active:scale-[0.98]">
            Process Documents
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        {[
          { title: 'Secure OCR', desc: 'Enterprise-grade text extraction for handwritten and printed text.' },
          { title: 'Multilingual', desc: 'Full support for Hindi, Tamil, Telugu, and 8+ Indian languages.' },
          { title: 'Compliant', desc: 'Risk scores generated strictly following DPDP guidelines.' },
        ].map((feat, i) => (
          <div key={i} className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/50">
            <h4 className="font-bold text-primary-400 mb-2">{feat.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadPage;
