import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
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

// Removed mockEntities completely

const ScanResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const docId = searchParams.get('docId');
  const { token } = useAuth();
  const [viewMode, setViewMode] = useState('original');
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [documentInfo, setDocumentInfo] = useState({ filename: 'Loading...', id: docId || 'NONE' });
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const [redacting, setRedacting] = useState(false);
  
  const originalUrl = `/api/v1/upload/${docId}/original?token=${token}`;
  const redactedUrl = `/api/v1/upload/${docId}/redacted?token=${token}&t=${cacheBuster}`;

  useEffect(() => {
    if (!docId) return;
    
    // Fetch document info
    axios.get(`/api/v1/upload/${docId}`).then(res => {
      setDocumentInfo(res.data);
    }).catch(() => {});

    // Fetch entities
    axios.get(`/api/v1/scan/${docId}/entities`).then(res => {
      if (res.data && res.data.length > 0) {
        // Map backend entities to frontend structure
        const mapped = res.data.map(e => ({
          id: e.id,
          type: e.entity_type,
          value: e.original_value,
          risk: e.risk_level.toUpperCase(),
          confidence: e.confidence_score,
          context: `...entity found between pos ${e.metadata_info?.start || 0} and ${e.metadata_info?.end || 0}...`
        }));
        setEntities(mapped);
        setSelectedEntity(mapped[0]);
      } else {
        setEntities([]);
        setSelectedEntity(null);
      }
    }).catch(() => {});
  }, [docId]);

  const executeMasking = async () => {
    if (!docId) return toast.error('No document selected');
    setRedacting(true);
    try {
      await axios.post(`/api/v1/redact/${docId}`);
      setCacheBuster(Date.now());
      setDocumentInfo(prev => ({ ...prev, status: 'redacted' }));
      setViewMode('redacted');
      toast.success('Global masking executed successfully');
    } catch (err) {
      toast.error('Failed to execute masking');
    } finally {
      setRedacting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in font-sans pb-10">
      {/* Dynamic Header */}
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-100 italic">Analyzed</span>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ml-1">
                <Clock className="w-3 h-3" /> {documentInfo?.created_at ? new Date(documentInfo.created_at).toLocaleDateString() : 'recent scan'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{documentInfo.filename}</h1>
            <p className="text-slate-400 text-xs font-medium">Compliance Identifier: <span className="text-slate-600 font-bold">{documentInfo.id}</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
             onClick={() => {
                const baseUrl = viewMode === 'redacted' || viewMode === 'compare' ? redactedUrl : originalUrl;
                const fullUrl = `${baseUrl}&download=true`;
                window.open(fullUrl, '_blank');
             }}
             className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" /> Download
          </button>
          <button 
             onClick={executeMasking}
             disabled={redacting || documentInfo.status === 'redacted'}
             className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
          >
            <ShieldCheck className="w-4 h-4" /> {redacting ? "Processing..." : (documentInfo.status === 'redacted' ? "Masked Successfully" : "Apply Masking")}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Document Preview Area */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[800px]">
            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Render Engine v4.0</span>
              </div>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                <button 
                  onClick={() => setViewMode('original')}
                  className={`px-3 py-1.5 text-[9px] font-bold rounded-lg transition-all flex items-center gap-2 ${viewMode === 'original' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <Eye className="w-3 h-3" /> ORIGINAL
                </button>
                {documentInfo.status === 'redacted' && (
                  <>
                    <button 
                      onClick={() => setViewMode('redacted')}
                      className={`px-3 py-1.5 text-[9px] font-bold rounded-lg transition-all flex items-center gap-2 ${viewMode === 'redacted' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      <Shield className="w-3 h-3" /> REDACTED
                    </button>
                    <button 
                      onClick={() => setViewMode('compare')}
                      className={`px-3 py-1.5 text-[9px] font-bold rounded-lg transition-all flex items-center gap-2 ${viewMode === 'compare' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      <EyeOff className="w-3 h-3" /> COMPARE
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex-1 bg-slate-200 relative overflow-hidden">
              {viewMode === 'compare' ? (
                <div className="h-full flex divide-x divide-slate-300">
                  <div className="w-1/2 h-full flex flex-col">
                    <div className="bg-slate-100 p-2 text-center text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Source Document</div>
                    <iframe src={originalUrl} className="flex-1 w-full border-none bg-white" title="Original" />
                  </div>
                  <div className="w-1/2 h-full flex flex-col">
                    <div className="bg-indigo-50 p-2 text-center text-[9px] font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-100">DPDP Protected</div>
                    <iframe src={redactedUrl} className="flex-1 w-full border-none bg-white" title="Redacted" />
                  </div>
                </div>
              ) : (
                 <iframe 
                    src={viewMode === 'redacted' ? redactedUrl : originalUrl} 
                    className="w-full h-full border-none bg-white" 
                    title="Preview" 
                 />
              )}
            </div>
          </div>
        </div>

        {/* Intelligence Panel */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-10 -mt-10 blur-2xl" />
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="text-lg font-bold text-slate-900">PII Forensics</h3>
              <span className="text-[10px] font-bold text-indigo-600 italic bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">{entities.length} Detected</span>
            </div>
            
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
              {entities.map((entity) => (
                <div 
                  key={entity.id} 
                  onClick={() => setSelectedEntity(entity)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                    selectedEntity?.id === entity.id 
                    ? 'bg-indigo-50/50 border-indigo-200 ring-2 ring-indigo-500/5' 
                    : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/30 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2.5">
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${entity.risk === 'HIGH' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                       <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{entity.type}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-300 uppercase">{Math.round((entity.confidence || 0) * 100)}% Confidence</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-slate-800 font-mono truncate max-w-[180px]">{entity.value}</p>
                    <ChevronRight className={`w-4 h-4 text-slate-300 transition-transform ${selectedEntity?.id === entity.id ? 'translate-x-1 text-indigo-500' : ''}`} />
                  </div>
                </div>
              ))}
              {entities.length === 0 && (
                <div className="text-center py-20">
                  <ShieldCheck className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-sm font-bold text-slate-400">Clean Document</p>
                  <p className="text-[10px] text-slate-300 font-medium px-10">No PII detected based on active regulatory policies.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[32px] shadow-xl relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Risk Analysis</h4>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compliance Index</span>
                  <span className="text-xs font-bold text-indigo-400">
                    {entities.length > 0 ? Math.max(0, 100 - (entities.filter(e => e.risk === 'HIGH').length / entities.length * 100)).toFixed(1) : 100}%
                  </span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{width: `${entities.length > 0 ? Math.max(0, 100 - (entities.filter(e => e.risk === 'HIGH').length / entities.length * 100)) : 100}%`}} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Safety Margin</span>
                  <span className="text-xs font-bold text-emerald-400">
                    {viewMode === 'redacted' ? '100%' : `${entities.length > 0 ? Math.max(0, 100 - (entities.length * 5)).toFixed(1) : 100}%`}
                  </span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{width: viewMode === 'redacted' ? '100%' : `${entities.length > 0 ? Math.max(0, 100 - (entities.length * 5)) : 100}%`}} />
                </div>
              </div>
            </div>
            <p className="text-[9px] text-slate-500 leading-relaxed mt-8 font-medium italic border-t border-white/5 pt-4">
              *AI evaluation engine validated against DPDP Rulebook r2.1-IN.
            </p>
          </div>

          <button 
             onClick={() => navigate('/audit-logs')}
             className="w-full bg-white border border-slate-200 rounded-2xl py-4 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm group"
          >
            Trace Logic Pipeline <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanResult;
