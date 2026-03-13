import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  ShieldAlert, 
  History, 
  Settings, 
  LogOut,
  ShieldCheck,
  Zap,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Upload, label: 'Secure Upload', path: '/upload' },
    { icon: ShieldAlert, label: 'Scan Results', path: '/scan-results' },
    { icon: History, label: 'Audit Records', path: '/audit-logs' },
    { icon: Settings, label: 'Compliance', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close sidebar on mobile when navigating
  React.useEffect(() => {
    if (onClose) onClose();
  }, [location.pathname]);

  return (
    <aside className="w-72 bg-[#050914] border-r border-white/5 h-screen flex flex-col relative z-20">
      <div className="p-8 lg:p-10 flex items-center justify-between">
        <NavLink to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-none group-hover:text-primary-400 transition-colors">
              DPDP<span className="text-primary-500">Shield</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Enterprise Core</p>
          </div>
        </NavLink>
        
        <button 
          onClick={onClose}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-6 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? 'bg-primary-600/10 text-primary-400 border border-primary-500/20 shadow-lg shadow-primary-500/5'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="font-semibold text-sm">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 shadow-sm shadow-primary-500/50" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
        <div className="rounded-3xl bg-slate-900/40 border border-white/5 p-5 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-accent-400" />
            </div>
            <p className="text-xs font-bold text-slate-300">Quick Scan</p>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed mb-4">
            New Indian regulations require immediate redaction of sensitive data.
          </p>
          <button 
            onClick={() => navigate('/settings')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-white text-[10px] font-bold rounded-xl transition-colors"
          >
            View Compliance Docs
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-4 w-full text-slate-500 hover:text-danger-500 hover:bg-danger-500/5 rounded-2xl transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span className="font-bold text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
