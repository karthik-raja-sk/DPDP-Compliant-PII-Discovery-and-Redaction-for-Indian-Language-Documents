import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Download, ChevronRight, AlertTriangle, FileCheck } from 'lucide-react';

const mockEntities = [
  { id: 1, type: 'AADHAAR', value: 'XXXX XXXX 9012', risk: 'HIGH', confidence: 0.98 },
  { id: 2, type: 'PAN', value: 'XXXXX1234F', risk: 'HIGH', confidence: 0.95 },
  { id: 3, type: 'EMAIL', value: 'r***@gmail.com', risk: 'MEDIUM', confidence: 0.99 },
  { id: 4, type: 'PHONE', value: 'XXXXXXX010', risk: 'MEDIUM', confidence: 0.91 },
  { id: 5, type: 'NAME', value: 'Rajesh Kumar', risk: 'MEDIUM', confidence: 0.88 },
];

const ScanResult = () => {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <Shield className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Scanning Complete</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">doc_012_onboarding.pdf</h1>
          <p className="text-slate-400 mt-1">Processed in 2.4s • 5 PII entities discovered</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-200 rounded-xl hover:bg-slate-700 transition-colors font-medium">
            <Download className="w-4 h-4" />
            Download Original
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-all font-bold shadow-lg shadow-primary-900/20 active:scale-95">
            <FileCheck className="w-4 h-4" />
            Execute Redaction
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Document Preview */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-slate-800/50 p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Secure Preview</span>
              <button 
                onClick={() => setShowOriginal(!showOriginal)}
                className="flex items-center gap-2 text-xs text-primary-400 hover:text-primary-300 transition-colors font-bold"
              >
                {showOriginal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showOriginal ? 'HIDE SENSITIVE DATA' : 'REVEAL SENSITIVE DATA'}
              </button>
            </div>
            <div className="p-8 aspect-[1/1.414] bg-white text-slate-800 font-serif leading-relaxed relative selection:bg-primary-200">
               {/* Blurred Content Placeholder */}
               <div className={showOriginal ? '' : 'blur-sm select-none'}>
                  <p className="mb-4">This is a system-generated preview of the uploaded document.</p>
                  <p className="mb-4">The PII entities like Aadhaar: 1234 5678 9012 and PAN: ABCDE1234F have been identified.</p>
                  <p>Contact information for Rajesh Kumar includes email: rajesh@example.com and phone: +91 9876543010.</p>
               </div>
               {!showOriginal && (
                 <div className="absolute inset-0 flex items-center justify-center p-12 text-center pointer-events-none">
                   <div className="bg-slate-900/80 backdrop-blur-md text-white p-6 rounded-2xl border border-white/10 shadow-3xl">
                     <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
                     <h4 className="font-bold text-lg mb-1">Confidential View Restricted</h4>
                     <p className="text-sm text-slate-400">Toggle "Reveal" to view unprotected data.</p>
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Entities Panel */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              Discovered Entities
              <span className="bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded text-xs font-mono">{mockEntities.length}</span>
            </h3>
            <div className="space-y-3">
              {mockEntities.map((entity) => (
                <div key={entity.id} className="p-4 bg-slate-800/30 border border-slate-800 rounded-xl hover:border-slate-700 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      entity.risk === 'HIGH' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {entity.type}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{(entity.confidence * 100).toFixed(0)}% CONF</span>
                  </div>
                  <p className="text-sm font-mono text-slate-200">{entity.value}</p>
                  <div className="flex items-center justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-primary-400 flex items-center gap-1 font-bold italic">
                      View Context <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6">
            <h4 className="text-indigo-400 font-bold text-sm mb-2">Compliance Summary</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              This document contains high-risk PII which must be redacted according to DPDP Clause 7.
            </p>
            <div className="flex items-center gap-4">
               <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-500 w-[65%]" />
               </div>
               <span className="text-xs font-bold text-indigo-400">65% Risk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanResult;
