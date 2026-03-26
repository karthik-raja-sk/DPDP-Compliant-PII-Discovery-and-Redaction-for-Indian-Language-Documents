import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Shield, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp, 
  Clock,
  Search,
  Zap,
  ChevronRight,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState({ items: [], page: 1, total_pages: 1, total: 0 });
  const [dashboardStats, setDashboardStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, statsRes] = await Promise.all([
          axios.get('/api/v1/upload/'),
          axios.get('/api/v1/upload/stats')
        ]);
        setDocuments(docsRes.data || { items: [] });
        setDashboardStats(statsRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Remove this document from records?')) return;
    try {
      await axios.delete(`/api/v1/upload/${id}`);
      toast.success('Document removed');
      setDocuments(prev => ({
        ...prev,
        items: (prev.items || []).filter(d => d.id !== id)
      }));
      // Refresh stats
      const statsRes = await axios.get('/api/v1/upload/stats');
      setDashboardStats(statsRes.data);
    } catch (err) {
      toast.error('Deletion failed');
      console.error("Deletion failed:", err);
    }
  };

  const memoizedTrendData = useMemo(() => dashboardStats?.trend_data || [], [dashboardStats]);
  const memoizedPieData = useMemo(() => dashboardStats?.pie_data || [], [dashboardStats]);
  
  const memoizedStats = useMemo(() => {
    if (!dashboardStats) return [
      { label: 'Processed Volumes', value: '0', change: 'Live', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'Identified PII Elements', value: '0', change: 'Live', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Compliance Anomalies', value: '0', change: 'Live', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'DPDP Risk Index', value: '100', change: 'Live', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];
    return [
      { label: 'Processed Volumes', value: dashboardStats.total_files.toString(), change: 'Live', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'Identified PII Elements', value: dashboardStats.total_entities.toString(), change: 'Live', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Compliance Anomalies', value: dashboardStats.risk_alerts.toString(), change: 'Live', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'DPDP Risk Index', value: dashboardStats.privacy_score.toString(), change: 'Live', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];
  }, [dashboardStats]);

  const currentRecentActivity = useMemo(() => {
    if (!documents?.items) return [];
    return documents.items.slice(0, 5).map(doc => ({
      id: doc.id,
      doc: doc.filename,
      status: doc.status === 'processing' ? 'Processing' : (doc.status === 'scanned' || doc.status === 'redacted' ? 'Completed' : 'Pending'),
      risk: doc.risk_score !== undefined ? doc.risk_score : 'N/A',
      time: new Date(doc.created_at).toLocaleDateString()
    }));
  }, [documents]);

  return (
    <div className="space-y-8 animate-in font-sans pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Enterprise Overview</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Monitoring data privacy health across Indian demographics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
             onClick={() => navigate('/audit-logs')}
             className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Clock className="w-4 h-4" /> View Audit Trail
          </button>
          <button 
             onClick={() => navigate('/upload')}
             className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
          >
            <Zap className="w-4 h-4" /> Initiate Discovery Run
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {memoizedStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wider">
                {stat.change}
              </span>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Discovery Trends</h3>
              <p className="text-slate-400 text-xs mt-1 font-medium">PII identification velocity over time.</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none">
              <option>Past 7 Business Days</option>
            </select>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={memoizedTrendData}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={10} fontWeights={700} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dx={-10} fontWeights={700} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#4f46e5', fontWeight: 'bold', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="count" stroke="#4f46e5" fillOpacity={1} fill="url(#colorTrend)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Entities Panel */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Entity Map</h3>
          <p className="text-slate-400 text-xs font-medium mb-8">Categorical distribution of PII.</p>
          
          <div className="h-[200px] w-full relative mb-10 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={memoizedPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {memoizedPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-900">
                {memoizedPieData.length > 0 
                  ? `${Math.round((memoizedPieData[0].value / Math.max(dashboardStats?.total_entities, 1)) * 100)}%`
                  : '0%'}
              </span>
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tight">
                {memoizedPieData.length > 0 ? memoizedPieData[0].name : 'Primary'}
              </span>
            </div>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {memoizedPieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{item.name}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                   {item.value} units
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 pb-4 flex items-center justify-between">
             <h3 className="text-lg font-bold text-slate-900">Recent Telemetry</h3>
             <button onClick={() => navigate('/scan-results')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-colors">
               Explorer All
             </button>
          </div>
          <div className="px-2 pb-6 flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="py-4 px-6 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Project File</th>
                  <th className="py-4 px-6 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Compliance</th>
                  <th className="py-4 px-6 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Severity</th>
                  <th className="py-4 px-6 text-right text-[10px] uppercase tracking-widest text-slate-400 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentRecentActivity.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/scan-results?id=${item.id}`)}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-indigo-600 transition-all">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-700 truncate">{item.doc}</p>
                          <p className="text-[10px] text-slate-400 font-medium italic mt-0.5">{item.time}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${
                        item.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                       <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                             className={`h-full rounded-full ${item.risk > 70 ? 'bg-rose-500' : (item.risk > 30 ? 'bg-amber-500' : 'bg-emerald-500')}`}
                             style={{ width: `${item.risk || 0}%` }}
                          />
                       </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                         onClick={(e) => handleDelete(item.id, e)}
                         className="w-8 h-8 rounded-lg border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all flex items-center justify-center ml-auto"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-indigo-600 rounded-[32px] p-8 relative overflow-hidden flex flex-col justify-between shadow-xl shadow-indigo-100">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-6 border border-white/30">
               <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 leading-tight">Regulatory Update</h3>
            <p className="text-indigo-100 text-xs font-medium leading-relaxed mb-8 opacity-80">
              New guidelines on Aadhaar masking have been issued. Review your detection patterns to ensure 100% compliance.
            </p>
          </div>
          <button 
             onClick={() => navigate('/settings')}
             className="w-full bg-white text-indigo-600 rounded-xl py-3 text-xs font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            Update Policies <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
