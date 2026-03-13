import React from 'react';
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

const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tight">System Settings</h1>
        <p className="text-slate-500 mt-2 font-medium">Manage your enterprise profile, security preferences, and API integrations.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Sidebar Nav */}
        <div className="md:col-span-4 space-y-2">
          {[
            { label: 'General Profile', icon: User, active: true },
            { label: 'Security & Auth', icon: Lock },
            { label: 'Privacy Core', icon: Shield },
            { label: 'Notifications', icon: Bell },
            { label: 'Language & Region', icon: Globe },
            { label: 'API & Integrations', icon: Key },
            { label: 'Billing & Plans', icon: CreditCard },
          ].map((item, i) => (
            <button 
              key={i}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${
                item.active 
                ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' 
                : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* content Area */}
        <div className="md:col-span-8 space-y-8">
          <Card className="p-8">
            <h3 className="text-xl font-bold text-white mb-8 border-b border-white/5 pb-4">Personal Information</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-3xl bg-slate-900 border-2 border-dashed border-white/10 flex items-center justify-center text-slate-700 group-hover:border-primary-500/50 transition-all cursor-pointer">
                    <User className="w-10 h-10" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-primary-500 text-white flex items-center justify-center shadow-lg cursor-pointer">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Samin Ahmed</h4>
                  <p className="text-slate-500 text-sm font-medium">Administrator • Enterprise Tier</p>
                  <Button variant="ghost" size="sm" className="mt-2 text-primary-500 px-0">Update Avatar</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                  <input type="text" defaultValue="Samin Ahmed" className="w-full bg-slate-950/60 border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Job Title</label>
                  <input type="text" defaultValue="Security Architect" className="w-full bg-slate-950/60 border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input type="email" defaultValue="samin@enterprise.com" className="w-full bg-slate-950/60 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                <Button variant="secondary">Discard</Button>
                <Button variant="primary">Save Changes</Button>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-accent-600/5 to-transparent border-accent-500/20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-white">Usage & Quota</h3>
                   <p className="text-slate-500 text-xs font-medium">Enterprise Discovery Plan</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-accent-400 bg-accent-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Active</span>
            </div>

            <div className="space-y-6">
               <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Document Credits</span>
                    <span className="text-xs font-bold text-white">8,420 / 10,000</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-500 w-[84%] rounded-full shadow-lg shadow-accent-500/40" />
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Scan Hours</p>
                     <p className="text-xl font-black text-white">124.5h</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Entities Redacted</p>
                     <p className="text-xl font-black text-white">45.2k</p>
                  </div>
               </div>
            </div>

            <Button variant="ghost" className="w-full mt-6 text-accent-400 hover:bg-accent-500/10" icon={ChevronRight}>
              Upgrade for Unlimited Processing
            </Button>
          </Card>

          <Card className="p-8 border-danger-500/20 bg-danger-500/5">
            <h3 className="text-lg font-bold text-danger-500 uppercase tracking-tight mb-2">Danger Zone</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">Irreversible actions on your enterprise account.</p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-[24px] bg-slate-950/60 border border-white/5">
              <div>
                <h4 className="text-sm font-bold text-white">Purge Compliance Logs</h4>
                <p className="text-xs text-slate-600 font-medium">Clear all document history and analytics data.</p>
              </div>
              <Button variant="danger" size="sm" className="w-full sm:w-auto">Purge Data</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
