import React, { useState, useEffect } from 'react';
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

const auditLogs = [
  { id: 1, doc: 'customer_onboarding_final.pdf', date: 'Mar 12, 2024', time: '14:20', pii: 15, risk: 'HIGH', status: 'Redacted' },
  { id: 2, doc: 'employee_payroll_data.xlsx', date: 'Mar 12, 2024', time: '11:05', pii: 42, risk: 'MEDIUM', status: 'Flagged' },
  { id: 3, doc: 'vendor_contract_v2.docx', date: 'Mar 11, 2024', time: '16:45', pii: 5, risk: 'LOW', status: 'Cleared' },
  { id: 4, doc: 'passport_scan_john.jpg', date: 'Mar 11, 2024', time: '09:12', pii: 2, risk: 'HIGH', status: 'Redacted' },
  { id: 5, doc: 'internal_memo_draft.txt', date: 'Mar 10, 2024', time: '18:30', pii: 0, risk: 'NONE', status: 'Cleared' },
  { id: 6, doc: 'audit_report_q1.pdf', date: 'Mar 10, 2024', time: '14:15', pii: 8, risk: 'MEDIUM', status: 'Redacted' },
  { id: 7, doc: 'kyc_compliance_batch_1.zip', date: 'Mar 09, 2024', time: '10:00', pii: 156, risk: 'HIGH', status: 'Redacted' },
];

const History = () => {
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
      .catch(console.error);
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
    link.setAttribute("download", "audit_logs_page.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this audit record?')) return;
    try {
      await axios.delete(`/api/v1/upload/${id}`);
      toast.success('Record purged');
      setLogs(logs.filter(l => l.id !== id));
      setTotalCount(prev => prev - 1);
    } catch (err) {
      toast.error('Failed to delete record');
    }
  };

  return (
    <div className="space-y-10 animate-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Audit History</h1>
          <p className="text-slate-500 mt-2 font-medium">Traceable logs of all document discoveries and redaction events.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={Download} onClick={exportCSV}>Export Logs (CSV)</Button>
        </div>
      </header>

      {/* Filters Bar */}
      <Card className="p-4 bg-slate-900/40 border-white/5 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by filename or ID..." 
            className="w-full bg-slate-950/60 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 border border-white/5 rounded-xl text-xs font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <div className="h-10 w-px bg-white/5 mx-2 hidden md:block" />
          <select 
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="flex-1 md:flex-none bg-slate-900 border border-white/5 rounded-xl px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="text-left py-5 px-8 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">Filename</th>
                <th className="text-left py-5 px-8 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">Timeline</th>
                <th className="text-center py-5 px-8 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">Entities</th>
                <th className="text-left py-5 px-8 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">Risk Vector</th>
                <th className="text-center py-5 px-8 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">Status</th>
                <th className="text-right py-5 px-8 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                         <HistoryIcon className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-black uppercase tracking-widest">No audit records found</p>
                    </div>
                  </td>
                </tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="group hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => window.location.href = `/scan-results?docId=${log.id}`}>
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-primary-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200 uppercase tracking-tight group-hover:text-primary-400 transition-colors">{log.filename}</p>
                        <p className="text-[10px] text-slate-600 font-bold uppercase">ID: LOG-{log.id}99X</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-300">{new Date(log.created_at || Date.now()).toLocaleDateString()}</p>
                      <p className="text-[10px] text-slate-600 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(log.created_at || Date.now()).toLocaleTimeString()}
                      </p>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-center text-sm font-black text-slate-400 font-mono">
                    {log.status === 'redacted' ? 'Analysis Complete' : (log.status === 'scanned' ? 'Pending Mask' : 'In Progress')}
                  </td>
                  <td className="py-5 px-8">
                     <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                       log.status === 'redacted' ? 'bg-success-500/10 text-success-400 border border-success-500/20' : 
                       'bg-warning-500/10 text-warning-400 border border-warning-500/20'
                     }`}>
                       {log.status === 'redacted' ? 'SECURE' : 'ACTION NEEDED'}
                     </span>
                  </td>
                  <td className="py-5 px-8 text-center">
                    <span className="text-[10px] text-slate-400 font-black uppercase flex items-center justify-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        log.status === 'redacted' ? 'bg-success-500' : 'bg-warning-500'
                      }`} />
                      {log.status}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <button 
                      onClick={(e) => handleDelete(log.id, e)}
                      className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-600 hover:text-danger-500 hover:border-danger-500/20 hover:bg-danger-500/10 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
          Showing page {page} of {totalPages} ({totalCount} total results)
        </p>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            className={`px-4 py-2 ${page <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
          >Previous</Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className={`px-4 py-2 ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >Next Page</Button>
        </div>
      </div>
    </div>
  );
};

export default History;
