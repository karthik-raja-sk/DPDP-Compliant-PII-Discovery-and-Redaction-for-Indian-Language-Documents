import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Shield, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const data = [
  { name: 'Mon', count: 4 },
  { name: 'Tue', count: 7 },
  { name: 'Wed', count: 5 },
  { name: 'Thu', count: 12 },
  { name: 'Fri', count: 8 },
  { name: 'Sat', count: 3 },
  { name: 'Sun', count: 6 },
];

const stats = [
  { label: 'Total Files Scanned', value: '1,284', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'PII Entities Found', value: '45,092', icon: Shield, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { label: 'High Risk Threats', value: '1,024', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  { label: 'Compliance Score', value: '98.2%', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
];

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Security Analytics</h1>
        <p className="text-slate-400 mt-2">Real-time DPDP compliance monitoring and risk discovery.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all hover:scale-[1.02] cursor-default">
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">Discovery Trends</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#0ea5e9' }}
                />
                <Area type="monotone" dataKey="count" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Panel */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">Language Identification</h3>
          <div className="space-y-6">
            {[
              { label: 'English', value: 65, color: '#3b82f6' },
              { label: 'Hindi', value: 20, color: '#f59e0b' },
              { label: 'Tamil', value: 8, color: '#10b981' },
              { label: 'Other', value: 7, color: '#6366f1' },
            ].map((lang, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">{lang.label}</span>
                  <span className="text-slate-500 font-mono">{lang.value}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${lang.value}%`, backgroundColor: lang.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
