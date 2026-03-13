import React, { useState } from 'react';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Download, 
  ChevronRight, 
  AlertTriangle, 
  FileCheck, 
  FileText,
  Clock,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  History as HistoryIcon,
  Lock
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const mockEntities = [
  { id: 1, type: 'AADHAAR', value: 'XXXX XXXX 9012', risk: 'HIGH', confidence: 0.98, context: '...his identity card number is 1234 5678 9012...' },
  { id: 2, type: 'PAN', value: 'XXXXX1234F', risk: 'HIGH', confidence: 0.95, context: '...provided PAN ABCDE1234F for taxation...' },
  { id: 3, type: 'EMAIL', value: 'r***@gmail.com', risk: 'MEDIUM', confidence: 0.99, context: '...send email to rajesh@example.com...' },
  { id: 4, type: 'PHONE', value: 'XXXXXXX010', risk: 'MEDIUM', confidence: 0.91, context: '...call on +91 9876543010 for verification...' },
  { id: 5, type: 'NAME', value: 'Rajesh Kumar', risk: 'MEDIUM', confidence: 0.88, context: '...the applicant name is Rajesh Kumar...' },
];

const ScanResult = () => {
  const [showOriginal, setShowOriginal] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(mockEntities[0]);

  return (
    <div className="space-y-10 animate-in">
      {/* Dynamic Header */}
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 pb-4">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-[24px] bg-slate-900 border border-white/5 flex items-center justify-center text-primary-400 shadow-2xl">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-success-500/10 text-success-400 text-[10px] font-black uppercase tracking-widest">Validated</span>
              <span className="w-1 h-1 rounded-full bg-slate-700"></span>
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-3 h-3" /> Processed 2.4s ago
              </span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">doc_012_onboarding.pdf</h1>
            <p className="text-slate-500 mt-1 font-medium">Compliance Report ID: <span className="text-slate-300">SHIELD-9912-X</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={Download}>Raw Data</Button>
          <Button variant="primary" icon={ShieldCheck} className="px-10">Execute Global Masking</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Document Preview Area */}
        <div className="xl:col-span-8 space-y-6">
          <Card className="overflow-hidden border-none shadow-3xl bg-slate-900/60">
            <div className="glass-panel p-5 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-danger-500/20 border border-danger-500/30" />
                  <div className="w-3 h-3 rounded-full bg-warning-500/20 border border-warning-500/30" />
                  <div className="w-3 h-3 rounded-full bg-success-500/20 border border-success-500/30" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Enterprise Preview Engine v2.0</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowOriginal(!showOriginal)}
                className="text-[10px] font-black text-primary-400 hover:text-primary-300"
                icon={showOriginal ? EyeOff : Eye}
              >
                {showOriginal ? 'HIDE SOURCE' : 'REVEAL SOURCE'}
              </Button>
            </div>
            
            <div className="p-12 min-h-[700px] bg-white text-slate-900 font-serif leading-relaxed relative overflow-hidden select-none">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <div className="w-full h-full bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
                </div>

                <div className={showOriginal ? 'relative z-10' : 'relative z-10 blur-[8px] opacity-40 grayscale'}>
                  <div className="mb-10 flex justify-between items-start border-b-2 border-slate-100 pb-8">
                    <div>
                      <h2 className="text-2xl font-black uppercase tracking-tight">Onboarding Request</h2>
                      <p className="text-slate-500 text-sm italic">Confidential Document • Internal Use Only</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">Ref: 2024/FIN/012</p>
                      <p className="text-slate-400 text-[10px]">Date: March 12, 2024</p>
                    </div>
                  </div>

                  <p className="mb-6">This document serves as a formal onboarding request for the processing entity.</p>
                  
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8">
                    <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Subject Information</h4>
                    <p className="mb-4">Verification subject <strong>Rajesh Kumar</strong> has submitted the following identifiers:</p>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Aadhaar Number</p>
                        <p className="font-mono text-lg font-bold">1234 5678 9012</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-slate-400 mb-1">PAN Card</p>
                        <p className="font-mono text-lg font-bold">ABCDE1234F</p>
                      </div>
                    </div>
                  </div>

                  <p>For further communication, reach out at <span className="underline font-bold">rajesh@example.com</span> or contact directly via registered phone <span className="font-bold">+91 9876543010</span>.</p>
                </div>

                {!showOriginal && (
                  <div className="absolute inset-0 flex items-center justify-center p-12 text-center z-20">
                    <div className="glass-card p-10 rounded-[40px] border border-white/5 shadow-3xl max-w-sm">
                      <div className="w-20 h-20 bg-primary-500 rounded-[30px] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-primary-500/40">
                        <Lock className="w-10 h-10" />
                      </div>
                      <h4 className="font-black text-2xl text-white mb-3">Redaction Active</h4>
                      <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        Sensitive data is being masked by the SHIELD engine. Click "Reveal Source" above to bypass.
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </Card>
        </div>

        {/* Intelligence Panel */}
        <div className="xl:col-span-4 space-y-8">
          <Card className="p-8 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl rounded-full" />
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">PII Insights</h3>
              <span className="text-xs font-black text-primary-400 font-mono bg-primary-500/10 px-3 py-1 rounded-full">{mockEntities.length} FOUND</span>
            </div>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {mockEntities.map((entity) => (
                <div 
                  key={entity.id} 
                  onClick={() => setSelectedEntity(entity)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer group/item ${
                    selectedEntity?.id === entity.id 
                    ? 'bg-primary-500/10 border-primary-500/30' 
                    : 'bg-white/[0.03] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        entity.risk === 'HIGH' ? 'bg-danger-500/10 text-danger-400' : 'bg-warning-500/10 text-warning-400'
                      }`}>
                         <Shield className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{entity.type}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">98% Match</span>
                  </div>
                  <p className="text-sm font-bold text-white mb-2 font-mono group-hover/item:text-primary-400 transition-colors uppercase tracking-tight">{entity.value}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                      entity.risk === 'HIGH' ? 'bg-danger-500/10 text-danger-400' : 'bg-warning-500/10 text-warning-400'
                    }`}>
                      {entity.risk} RISK
                    </span>
                    <ChevronRight className={`w-4 h-4 text-slate-700 transition-transform ${selectedEntity?.id === entity.id ? 'translate-x-1 text-primary-500' : ''}`} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-indigo-600/10 to-transparent border-indigo-500/20">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
              <h4 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em]">Compliance Matrix</h4>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-300">DPDP Act Compliance</span>
                  <span className="text-[10px] font-black text-indigo-400">88%</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[88%] rounded-full shadow-lg shadow-indigo-500/40" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-300">Risk Mitigation Score</span>
                  <span className="text-[10px] font-black text-success-400">92%</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-success-500 w-[92%] rounded-full shadow-lg shadow-success-500/40" />
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed mt-6 italic">
              *Analysis based on recent DPDP guidelines updated March 2024.
            </p>
          </Card>

          <Button variant="secondary" className="w-full rounded-2xl py-4 group" icon={HistoryIcon}>
            View Processing Logs <ExternalLink className="w-3 h-3 ml-1 opacity-40 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScanResult;
