import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
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
  const { token } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
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
    let lastDocId = null;
    try {
      for (const file of files) {
        setScanStatus(`Uploading ${file.name}...`);
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await axios.post('/api/v1/upload/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const docId = uploadRes.data.id;
        lastDocId = docId;
        
        // Start background scan
        setScanStatus(`[${file.name}] QUEUED`);
        await axios.post(`/api/v1/scan/${docId}`);
        
        // Wait for SSE completion
        await new Promise((resolve, reject) => {
          // Send token via query param because EventSource does not support Headers
          const evtSource = new EventSource(`/api/v1/scan/${docId}/stream?token=${token}`);
          
            evtSource.onmessage = function(event) {
              const data = JSON.parse(event.data);
              if (data.error) {
                evtSource.close();
                reject(new Error(data.error));
              } else if (data.status) {
                const statusMap = {
                  'queued': 'Queued in Engine',
                  'processing': 'Initializing Processor',
                  'extracting text': 'Extracting Document Text',
                  'detecting pii': 'Identifying Sensitive Entities',
                  'saving entities': 'Finalizing Report',
                  'scanned': 'Completed'
                };
                setScanStatus(`[${file.name}] ${statusMap[data.status] || data.status.toUpperCase()}`);
                if (data.status === 'failed') {
                  evtSource.close();
                  reject(new Error("Document processing failed on server"));
                } else if (['scanned', 'redacted'].includes(data.status)) {
                  evtSource.close();
                  resolve();
                }
              }
            };
          
          evtSource.onerror = function(err) {
            evtSource.close();
            reject(new Error("Lost connection to scan stream"));
          };
        });
      }
      toast.success('Analysis Pipeline Completed');
      if (lastDocId) navigate(`/scan-results?docId=${lastDocId}`);
      else navigate('/scan-results');
    } catch (err) {
      toast.error(`Scan interrupted: ${err.message || 'Unknown error'}`);
    } finally {
      setScanning(false);
      setScanStatus('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-10 animate-in font-sans">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-2 italic">
          <ShieldCheck className="w-4 h-4" /> Enterprise Compliance Core
        </div>
        <h1 className="text-5xl font-bold text-slate-900 tracking-tight">Detect PII in Documents</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
          Upload PDFs, images, or raw text to identify sensitive entities <br /> 
          <span className="text-indigo-600 font-bold">under the DPDP framework.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Upload Column */}
        <div className="lg:col-span-7 space-y-8">
          <div 
            className={`relative min-h-[420px] border-2 border-dashed rounded-[48px] flex flex-col items-center justify-center transition-all duration-500 group overflow-hidden ${
              dragActive 
              ? 'border-indigo-500 bg-indigo-50/50 ring-8 ring-indigo-500/5' 
              : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-[32px] border border-slate-100 flex items-center justify-center mb-8 shadow-xl shadow-slate-200/50 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                <UploadIcon className="w-10 h-10 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-slate-800 text-center tracking-tight">
                Drag and drop your files <br /> 
                <span className="text-slate-400 font-medium text-lg">to initialize scanning engine</span>
              </p>
              
              <div className="flex items-center gap-4 mt-8 mb-8">
                <div className="h-px w-8 bg-slate-100" />
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">secure gateway</p>
                <div className="h-px w-8 bg-slate-100" />
              </div>

              <input 
                ref={inputRef}
                type="file" 
                multiple 
                onChange={handleFileChange}
                className="hidden" 
              />
              <button 
                className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                onClick={() => inputRef.current.click()}
              >
                Browse File System
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { title: 'Secure OCR', icon: Type, color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'Text Extraction' },
              { title: 'Multilingual', icon: Globe, color: 'text-amber-600', bg: 'bg-amber-50', desc: 'Regional Support' },
              { title: 'DPDP-Ready', icon: Lock, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Legal Compliance' },
            ].map((feat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center group hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 mx-auto rounded-2xl ${feat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feat.icon className={`w-6 h-6 ${feat.color}`} />
                </div>
                <p className="text-xs font-bold text-slate-800 mb-1">{feat.title}</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Queued Files Column */}
        <div className="lg:col-span-5">
          <div className="bg-white h-full flex flex-col p-10 rounded-[48px] border border-slate-100 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10" />
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                  <Files className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Queue</h3>
              </div>
              {files.length > 0 && (
                <span className="text-[10px] font-bold text-indigo-600 bg-white border border-indigo-100 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                  {files.length} Total
                </span>
              )}
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto max-h-[380px] pr-2 custom-scrollbar relative z-10">
              {files.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-60 mt-10">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                    <File className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No documents queued</p>
                  <p className="text-[10px] text-slate-300 font-medium mt-2">Add files to begin analysis pipeline</p>
                </div>
              ) : (
                files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group hover:border-indigo-200 hover:bg-indigo-50/30 transition-all shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex flex-col items-center justify-center shadow-sm">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase italic">{file.name.split('.').pop()}</span>
                      </div>
                      <div className="max-w-[180px]">
                        <p className="text-sm font-bold text-slate-700 truncate">{file.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{(file.size / 1024 / 1024).toFixed(2)} MB • READY</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFile(i)}
                      className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-10 mt-10 border-t border-slate-50 space-y-6 relative z-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest italic animate-pulse">
                    {scanStatus || 'Initializing Core Engine...'}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1.5">
                    {scanning && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />}
                    {scanning ? 'LINK_ESTABLISHED' : ''}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000 origin-left" 
                    style={{ width: scanning ? '100%' : '0%' }}
                  />
                </div>
              </div>
              
              <button 
                disabled={files.length === 0 || scanning}
                onClick={startScan}
                className="w-full bg-indigo-600 text-white rounded-[24px] py-5 font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none group"
              >
                {scanning ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Initialise Analysis Pipeline <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                  End-to-End SSL Encryption
                </p>
                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
