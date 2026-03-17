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
                <Clock className="w-3 h-3" /> Processed {documentInfo?.created_at ? new Date(documentInfo.created_at).toLocaleDateString() : 'recently'}
              </span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">{documentInfo.filename}</h1>
            <p className="text-slate-500 mt-1 font-medium">Compliance Report ID: <span className="text-slate-300">SHIELD-{documentInfo.id}-X</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={Download} onClick={() => {
            const baseUrl = viewMode === 'redacted' || viewMode === 'compare' ? redactedUrl : originalUrl;
            const fullUrl = `${baseUrl}&download=true`;
            const link = document.createElement('a');
            link.href = fullUrl;
            link.download = documentInfo.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}>Download Document</Button>
          <Button variant="primary" icon={ShieldCheck} className="px-10" loading={redacting} onClick={executeMasking}>Execute Global Masking</Button>
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
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setViewMode('original')}
                  className={`text-[10px] font-black hover:text-white ${viewMode === 'original' ? 'text-white bg-white/10' : 'text-slate-500'}`}
                  icon={Eye}
                >ORIGINAL VIEW</Button>
                {documentInfo.status === 'redacted' && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setViewMode('redacted')}
                      className={`text-[10px] font-black hover:text-white ${viewMode === 'redacted' ? 'text-white bg-white/10' : 'text-slate-500'}`}
                      icon={Shield}
                    >REDACTED VIEW</Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setViewMode('compare')}
                      className={`text-[10px] font-black hover:text-white ${viewMode === 'compare' ? 'text-white bg-white/10' : 'text-slate-500'}`}
                      icon={EyeOff}
                    >COMPARE</Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="h-[800px] w-full bg-[#111] relative overflow-hidden flex flex-col">
              {viewMode === 'compare' ? (
                <div className="flex-1 flex overflow-hidden">
                  <div className="w-1/2 h-full border-r border-white/10 flex flex-col">
                    <div className="bg-slate-950 p-2 text-center text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">Original Source</div>
                    <iframe src={originalUrl} className="flex-1 w-full border-none bg-white" title="Original" />
                  </div>
                  <div className="w-1/2 h-full flex flex-col">
                    <div className="bg-primary-950/20 p-2 text-center text-[9px] font-black text-primary-400 uppercase tracking-[0.2em] border-b border-white/5">Redacted Output</div>
                    <iframe src={redactedUrl} className="flex-1 w-full border-none bg-white" title="Redacted" />
                  </div>
                </div>
              ) : viewMode === 'redacted' ? (
                 <iframe src={redactedUrl} className="w-full h-full border-none bg-white" title="Redacted" />
              ) : (
                 <iframe src={originalUrl} className="w-full h-full border-none bg-white" title="Original" />
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
              <span className="text-xs font-black text-primary-400 font-mono bg-primary-500/10 px-3 py-1 rounded-full">{entities.length} FOUND</span>
            </div>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {entities.map((entity) => (
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
                    <span className="text-[10px] font-bold text-slate-600 uppercase">{Math.round((entity.confidence || 0) * 100)}% Match</span>
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
                  <span className="text-[10px] font-black text-indigo-400">
                    {entities.length > 0 ? Math.max(0, 100 - (entities.filter(e => e.risk === 'HIGH').length / entities.length * 100)).toFixed(1) : 100}%
                  </span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/40" style={{width: `${entities.length > 0 ? Math.max(0, 100 - (entities.filter(e => e.risk === 'HIGH').length / entities.length * 100)) : 100}%`}} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-300">Risk Mitigation Score</span>
                  <span className="text-[10px] font-black text-success-400">
                    {viewMode === 'redacted' ? '100% (Secured)' : `${entities.length > 0 ? Math.max(0, 100 - (entities.length * 5)).toFixed(1) : 100}%`}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-success-500 rounded-full shadow-lg shadow-success-500/40" style={{width: viewMode === 'redacted' ? '100%' : `${entities.length > 0 ? Math.max(0, 100 - (entities.length * 5)) : 100}%`}} />
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed mt-6 italic">
              *Analysis based on recent DPDP guidelines updated March 2024.
            </p>
          </Card>

          <Button variant="secondary" className="w-full rounded-2xl py-4 group" icon={HistoryIcon} onClick={() => navigate('/audit-logs')}>
            View Processing Logs <ExternalLink className="w-3 h-3 ml-1 opacity-40 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScanResult;
