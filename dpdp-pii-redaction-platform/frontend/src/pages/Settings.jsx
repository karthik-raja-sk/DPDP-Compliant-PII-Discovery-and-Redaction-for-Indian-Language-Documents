import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Shield, 
  Bell, 
  Lock, 
  Globe, 
  CreditCard, 
  Zap, 
  Key,
  Database,
  Mail,
  Smartphone,
  Check,
  ChevronRight
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState({
    full_name: '',
    email: ''
  });
  const [saving, setSaving] = useState(false);
  const [purging, setPurging] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        full_name: user.full_name || '',
        email: user.email || ''
      });
    }
    
    axios.get('/api/v1/upload/stats')
      .then(res => setStats(res.data))
      .catch(console.error);
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axios.put('/api/v1/auth/me', profile);
      updateUser(response.data);
      toast.success('Enterprise profile synchronized');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePurge = async () => {
    if (!window.confirm('CRITICAL: This will permanently delete all documents and compliance logs. This action is irreversible. Proceed?')) return;
    setPurging(true);
    try {
      const res = await axios.delete('/api/v1/upload/');
      toast.success(res.data.message);
      // Refresh stats
      const statsRes = await axios.get('/api/v1/upload/stats');
      setStats(statsRes.data);
    } catch (err) {
      toast.error('Purge operation failed');
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in font-sans pb-10">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 mt-1 font-medium">Manage your enterprise profile, security thresholds, and regulatory configurations.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Sidebar Nav */}
        <div className="md:col-span-4 space-y-2">
          {[
            { label: 'General Profile', icon: User, active: true },
            { label: 'Security & Auth', icon: Lock },
            { label: 'Regulatory Core', icon: Shield },
            { label: 'Communications', icon: Bell },
            { label: 'Global Regions', icon: Globe },
            { label: 'API Gateway', icon: Key },
            { label: 'Billing & Quota', icon: CreditCard },
          ].map((item, i) => (
            <button 
              key={i}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all font-bold text-sm border ${
                item.active 
                ? 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm' 
                : 'text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? 'text-indigo-600' : 'text-slate-400'}`} />
              {item.label}
            </button>
          ))}
        </div>

        {/* content Area */}
        <div className="md:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mr-10 -mt-10" />
            <h3 className="text-lg font-bold text-slate-900 mb-8 border-b border-slate-50 pb-4 relative z-10">Institutional Profile</h3>
            
            <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all cursor-pointer">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-md border-2 border-white">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800">{user?.full_name || 'Administrator'}</h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Primary Analyst • Enterprise Node</p>
                  <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-2 hover:underline">Update Image</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Legal Name</label>
                  <input 
                    type="text" 
                    value={profile.full_name} 
                    onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all font-medium" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Job Designation</label>
                  <input type="text" defaultValue="Compliance Officer" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all font-medium" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Institutional Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      value={profile.email} 
                      onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all font-medium" 
                    />
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-50 flex justify-end gap-3">
                <button 
                   onClick={() => setProfile({ full_name: user?.full_name || '', email: user?.email || '' })}
                   className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
                >Discard Changes</button>
                <button 
                   disabled={saving}
                   onClick={handleSave}
                   className="px-8 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
                >
                   {saving ? "Synchronizing..." : "Apply Updates"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[32px] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-base font-bold text-white">Resource Utilization</h3>
                   <p className="text-slate-500 text-[10px] font-medium uppercase tracking-widest">Enterprise Shield Tier</p>
                </div>
              </div>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-widest">Global Status: Active</span>
            </div>

            <div className="space-y-6 relative z-10">
               <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Institutional Quota</span>
                    <span className="text-xs font-bold text-indigo-400 font-mono">{stats?.total_files || 0} / 10K DOCS</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all" style={{ width: `${Math.min(100, ((stats?.total_files || 0) / 10000) * 100)}%` }} />
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 group/card hover:bg-white/[0.05] transition-all">
                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Privacy Risks Deflected</p>
                     <p className="text-2xl font-bold text-white group-hover/card:text-indigo-400 transition-colors">{stats?.risk_alerts || 0}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 group/card hover:bg-white/[0.05] transition-all">
                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Entities Sanitized</p>
                     <p className="text-2xl font-bold text-white group-hover/card:text-emerald-400 transition-colors">{stats?.total_entities || 0}</p>
                  </div>
               </div>
            </div>

            <button 
              onClick={() => navigate('/upload')}
              className="w-full mt-8 bg-white/10 hover:bg-white/20 text-white rounded-2xl py-3.5 text-xs font-bold transition-all border border-white/10 flex items-center justify-center gap-2"
            >
              Expand Processing Pipeline <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-rose-50/30 p-8 rounded-[32px] border border-rose-100 border-dashed">
            <h3 className="text-sm font-bold text-rose-600 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Data Sovereignty Protocol
            </h3>
            <p className="text-slate-500 text-xs font-medium mb-6 italic">Secure purge operations to clear institutional memory from the infrastructure.</p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-5 rounded-2xl bg-white border border-rose-100 shadow-sm">
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-800">Clear Compliance Ledger</h4>
                <p className="text-[10px] text-slate-400 font-medium">Permanently delete all internal history, risk logs, and processed documents.</p>
              </div>
              <button 
                 disabled={purging}
                 onClick={handlePurge}
                 className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                 {purging ? "Purging..." : "Purge Institutional Data"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
