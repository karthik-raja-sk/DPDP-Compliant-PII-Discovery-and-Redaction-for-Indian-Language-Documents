import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  FileText, 
  Shield, 
  Clock,
  ChevronRight,
  MoreVertical,
  X
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { toast } from 'react-hot-toast';



const History = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      axios.get('/api/v1/upload/', {
        params: {
          page: page,
          limit: limit,
          search: search || undefined,
          status_filter: filter
        }
      })
      .then(res => {
        setLogs(res.data.items || []);
        setTotalPages(res.data.total_pages || 1);
        setTotalCount(res.data.total || 0);
      })
      .catch(() => toast.error('Failed to load history logs'));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [page, search, filter]);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Filename,Status,Created At\n" + 
      logs.map(l => `${l.id},${l.filename},${l.status},${new Date(l.created_at).toLocaleString()}`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Purge this record from the immutable audit trail?')) return;
    try {
      await axios.delete(`/api/v1/upload/${id}`);
      toast.success('Record purged successfully');
      setLogs(logs.filter(l => l.id !== id));
      setTotalCount(prev => prev - 1);
    } catch (err) {
      toast.error('Failed to purge record');
    }
  };

  return (
    <div className="space-y-8 animate-in font-sans pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Immutable Audit Ledger</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Cryptographically isolated ledger of all discovery and redaction operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
             onClick={exportCSV}
             className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </header>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search documents by name or ID..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select 
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="flex-1 md:flex-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all cursor-pointer outline-none"
          >
            <option value="All">All Compliance States</option>
            <option value="Completed">Completed Scans</option>
            <option value="Pending">Pending Review</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/30">
                <th className="py-5 px-8 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Document Info</th>
                <th className="py-5 px-8 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Timeline</th>
                <th className="py-5 px-8 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Process State</th>
                <th className="py-5 px-8 text-[10px] uppercase tracking-widest text-slate-400 font-bold text-center">Security</th>
                <th className="py-5 px-8 text-right text-[10px] uppercase tracking-widest text-slate-400 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                         <HistoryIcon className="w-8 h-8" />
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No audit telemetries found</p>
                    </div>
                  </td>
                </tr>
              ) : logs.map((log) => (
                <tr
                  key={log.id}
                  className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/scan-results?docId=${log.id}`)}
                >
                  <td className="py-4 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-indigo-600 transition-all">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{log.filename}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">REFERENCE: {log.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-8">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-600">{new Date(log.created_at).toLocaleDateString()}</p>
                      <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-8">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        log.status === 'redacted' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />
                      {log.status}
                    </span>
                  </td>
                  <td className="py-4 px-8 text-center">
                     <span className={`text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                       log.status === 'redacted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                       'bg-amber-50 text-amber-700 border border-amber-100'
                     }`}>
                       {log.status === 'redacted' ? 'Secured' : 'Needs Review'}
                     </span>
                  </td>
                  <td className="py-4 px-8 text-right">
                    <button 
                      onClick={(e) => handleDelete(log.id, e)}
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
      
      {/* Pagination Bar */}
      <div className="flex items-center justify-between px-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Displaying {logs.length} of {totalCount} records
        </p>
        <div className="flex gap-2">
          <button 
            className={`px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-30 disabled:pointer-events-none`}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
          >Previous</button>
          <button 
            className={`px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-30 disabled:pointer-events-none`}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >Next</button>
        </div>
      </div>
    </div>
  );
};

export default History;
