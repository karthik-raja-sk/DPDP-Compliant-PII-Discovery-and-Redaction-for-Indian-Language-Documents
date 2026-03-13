import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Upload as UploadIcon, 
  X, 
  ShieldCheck, 
  FileCheck, 
  ArrowRight, 
  File, 
  Type, 
  Globe, 
  Lock,
  ChevronRight,
  Loader2,
  Files
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Upload = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [scanning, setScanning] = useState(false);
  const inputRef = useRef(null);

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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const startScan = async () => {
    if (files.length === 0) return;
    setScanning(true);
    try {
      // Simulate scan
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Analysis Pipeline Initialized');
      navigate('/scan-results');
    } catch (err) {
      toast.error('Scan failed');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-10 animate-in">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-widest mb-4">
          <ShieldCheck className="w-3.5 h-3.5" /> Secure Discovery Core
        </div>
        <h1 className="text-5xl font-black text-white tracking-tight">Detect PII in Documents</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
          Upload PDFs, images, or raw text to identify Aadhaar, PAN, and other sensitive entities under the DPDP framework.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Upload Column */}
        <div className="lg:col-span-7 space-y-8">
          <div 
            className={`relative min-h-[400px] border-2 border-dashed rounded-[40px] flex flex-col items-center justify-center transition-all duration-500 group overflow-hidden ${
              dragActive 
              ? 'border-primary-500 bg-primary-500/5 ring-8 ring-primary-500/10' 
              : 'border-white/5 bg-slate-900/40 hover:border-white/10'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 group-hover:opacity-10 transition-opacity"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-slate-900 rounded-[30px] border border-white/5 flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <UploadIcon className="w-10 h-10 text-primary-500" />
              </div>
              <p className="text-2xl font-black text-white text-center">
                Drag and drop your files <br /> 
                <span className="text-slate-500 font-medium">to initialize scanning</span>
              </p>
              <div className="flex items-center gap-4 mt-8">
                <div className="h-px w-8 bg-white/5" />
                <p className="text-xs font-black text-slate-600 uppercase tracking-widest">or</p>
                <div className="h-px w-8 bg-white/5" />
              </div>
              <input 
                ref={inputRef}
                type="file" 
                multiple 
                onChange={handleFileChange}
                className="hidden" 
              />
              <Button 
                variant="secondary" 
                size="lg" 
                className="mt-8 rounded-2xl" 
                onClick={() => inputRef.current.click()}
              >
                Browse File System
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { title: 'Secure OCR', icon: Type, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
              { title: 'Hindi/Tamil', icon: Globe, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { title: 'DPDP-Ready', icon: Lock, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            ].map((feat, i) => (
              <Card key={i} className="p-5 text-center group">
                <div className={`w-10 h-10 mx-auto rounded-xl ${feat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feat.icon className={`w-5 h-5 ${feat.color}`} />
                </div>
                <p className="text-xs font-bold text-slate-300">{feat.title}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Queued Files Column */}
        <div className="lg:col-span-5">
          <Card className="h-full flex flex-col p-8 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                  <Files className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Queue</h3>
              </div>
              {files.length > 0 && (
                <span className="text-xs font-black text-primary-400 bg-primary-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
                  {files.length} Managed
                </span>
              )}
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {files.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-40">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-white/5">
                    <File className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No documents queued</p>
                </div>
              ) : (
                files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/[0.03] p-4 rounded-2xl border border-white/5 group hover:border-primary-500/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 border border-white/5 rounded-xl flex flex-col items-center justify-center">
                        <span className="text-[10px] font-black text-primary-500 uppercase">{file.name.split('.').pop()}</span>
                      </div>
                      <div className="max-w-[150px]">
                        <p className="text-sm font-bold text-slate-200 truncate uppercase tracking-tight">{file.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold">{(file.size / 1024 / 1024).toFixed(2)} MB • READY</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFile(i)}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-danger-500 hover:bg-danger-500/10 rounded-lg transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {files.length > 0 && (
              <div className="pt-8 mt-8 border-t border-white/5">
                <Button 
                  className="w-full rounded-[20px] py-5 shadow-2xl shadow-primary-500/20" 
                  size="lg"
                  loading={scanning}
                  onClick={startScan}
                  icon={scanning ? null : ArrowRight}
                >
                  {scanning ? 'Initializing Engine...' : 'Initialize Analysis Pipeline'}
                </Button>
                <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] mt-6">
                  Secured by AES-256 Encryption
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Upload;
