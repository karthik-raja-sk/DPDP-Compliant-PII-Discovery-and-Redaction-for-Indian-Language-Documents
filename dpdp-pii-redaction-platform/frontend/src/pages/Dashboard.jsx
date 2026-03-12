import React from 'react';
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
  ChevronRight
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const trendData = [
  { name: 'Mon', count: 420 },
  { name: 'Tue', count: 580 },
  { name: 'Wed', count: 490 },
  { name: 'Thu', count: 820 },
  { name: 'Fri', count: 710 },
  { name: 'Sat', count: 320 },
  { name: 'Sun', count: 450 },
];

const pieData = [
  { name: 'Aadhaar', value: 45, color: '#0ea5e9' },
  { name: 'PAN', value: 25, color: '#6366f1' },
  { name: 'Phone', value: 20, color: '#f59e0b' },
  { name: 'Other', value: 10, color: '#10b981' },
];

const stats = [
  { label: 'Files Analyzed', value: '2,482', change: '+12.5%', icon: FileText, color: 'text-primary-400', bg: 'bg-primary-500/10' },
  { label: 'Entities Found', value: '45.1k', change: '+8.2%', icon: Shield, color: 'text-accent-400', bg: 'bg-accent-500/10' },
  { label: 'Risk Alerts', value: '128', change: '-4.1%', icon: AlertCircle, color: 'text-danger-400', bg: 'bg-danger-500/10' },
  { label: 'Privacy Score', value: '98.2', change: '+0.4%', icon: CheckCircle, color: 'text-success-400', bg: 'bg-success-500/10' },
];

const recentActivity = [
  { id: 1, doc: 'customer_kyc_01.pdf', status: 'Completed', pii: 12, time: '2 mins ago' },
  { id: 2, doc: 'invoice_march_24.png', status: 'In Review', pii: 5, time: '15 mins ago' },
  { id: 3, doc: 'employee_record.xlsx', status: 'Completed', pii: 28, time: '1 hour ago' },
];

const Dashboard = () => {
  return (
    <div className="space-y-10 animate-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Intelligence Dashboard</h1>
          <p className="text-slate-500 mt-2 font-medium">Real-time DPDP compliance monitoring and risk discovery.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={Clock}>History</Button>
          <Button variant="primary" icon={Zap}>Run New Scan</Button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-success-500/10 text-success-400' : 'bg-danger-500/10 text-danger-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-white mt-1">{stat.value}</h3>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Card className="lg:col-span-2 p-8 overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Discovery Trends</h3>
              <p className="text-slate-500 text-sm mt-1">PII detection frequency across all documents.</p>
            </div>
            <select className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(5, 9, 20, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(12px)' }}
                  itemStyle={{ color: '#0ea5e9', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="count" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorTrend)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Entities Panel */}
        <Card className="p-8">
          <h3 className="text-xl font-bold text-white mb-2">Entity Distribution</h3>
          <p className="text-slate-500 text-sm mb-8">Breakdown by sensitive data types.</p>
          
          <div className="h-[220px] w-full relative mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-white">45%</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Aadhaar</span>
            </div>
          </div>

          <div className="space-y-4">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{item.name}</span>
                </div>
                <span className="text-xs font-black text-slate-500 font-mono">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="p-8 pb-4 flex items-center justify-between">
             <h3 className="text-xl font-bold text-white">Recent Activity</h3>
             <Button variant="ghost" size="sm" className="text-primary-500">View All</Button>
          </div>
          <div className="px-4 pb-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-4 px-4 text-[10px] uppercase tracking-widest text-slate-500 font-black">Document Name</th>
                  <th className="text-left py-4 px-4 text-[10px] uppercase tracking-widest text-slate-500 font-black">Status</th>
                  <th className="text-left py-4 px-4 text-[10px] uppercase tracking-widest text-slate-500 font-black">Entities</th>
                  <th className="text-right py-4 px-4 text-[10px] uppercase tracking-widest text-slate-500 font-black">Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentActivity.map((item) => (
                  <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-primary-400">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-slate-200 group-hover:text-primary-400 transition-colors uppercase tracking-tight">{item.doc}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full ${
                        item.status === 'Completed' ? 'bg-success-500/10 text-success-400' : 'bg-warning-500/10 text-warning-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-black text-slate-300">{item.pii} Items</td>
                    <td className="py-4 px-4 text-right text-xs font-bold text-slate-500">{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Action Card */}
        <Card className="bg-primary-600/5 border-primary-500/20 p-8 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-primary-500/20 blur-3xl rounded-full" />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-primary-500 flex items-center justify-center text-white shadow-xl shadow-primary-500/20 mb-6">
               <TrendingUp className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-white mb-3">Optimize Compliance</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Based on your recent scans, we recommend updating your redaction rules for Hindi scripts.
            </p>
          </div>
          <Button variant="primary" size="lg" className="w-full rounded-2xl py-4" icon={ChevronRight}>
            View Recommendations
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
