import React from 'react';
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
  MoreVertical
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
  return (
    <div className="space-y-10 animate-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Audit History</h1>
          <p className="text-slate-500 mt-2 font-medium">Traceable logs of all document discoveries and redaction events.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={Download}>Export Logs (CSV)</Button>
        </div>
      </header>

      {/* Filters Bar */}
      <Card className="p-4 bg-slate-900/40 border-white/5 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by filename or ID..." 
            className="w-full bg-slate-950/60 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 border border-white/5 rounded-xl text-xs font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <div className="h-10 w-px bg-white/5 mx-2 hidden md:block" />
          <select className="flex-1 md:flex-none bg-slate-900 border border-white/5 rounded-xl px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-500/20">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Past 24 Hours</option>
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
              {auditLogs.map((log) => (
                <tr key={log.id} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-primary-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200 uppercase tracking-tight group-hover:text-primary-400 transition-colors">{log.doc}</p>
                        <p className="text-[10px] text-slate-600 font-bold uppercase">ID: LOG-{log.id}99X</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-300">{log.date}</p>
                      <p className="text-[10px] text-slate-600 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {log.time}
                      </p>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-center text-sm font-black text-slate-400 font-mono">
                    {log.pii}
                  </td>
                  <td className="py-5 px-8">
                     <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                       log.risk === 'HIGH' ? 'bg-danger-500/10 text-danger-400 border border-danger-500/20' : 
                       log.risk === 'MEDIUM' ? 'bg-warning-500/10 text-warning-400 border border-warning-500/20' :
                       'bg-success-500/10 text-success-400 border border-success-500/20'
                     }`}>
                       {log.risk}
                     </span>
                  </td>
                  <td className="py-5 px-8 text-center">
                    <span className="text-[10px] text-slate-400 font-black uppercase flex items-center justify-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        log.status === 'Redacted' ? 'bg-primary-500' : 
                        log.status === 'Flagged' ? 'bg-warning-500' : 'bg-success-500'
                      }`} />
                      {log.status}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <button className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-600 hover:text-white hover:border-white/20 transition-all">
                      <MoreVertical className="w-4 h-4" />
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
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Showing 7 of 480 results</p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="px-4 py-2 opacity-50 cursor-not-allowed">Previous</Button>
          <Button variant="secondary" size="sm" className="px-4 py-2">Next Page</Button>
        </div>
      </div>
    </div>
  );
};

export default History;
