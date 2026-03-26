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
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Upload, label: 'Data Discovery', path: '/upload' },
    { icon: ShieldAlert, label: 'Scan Results', path: '/scan-results' },
    { icon: History, label: 'Audit Logs', path: '/audit-logs' },
    { icon: Settings, label: 'Compliance', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close sidebar on mobile when navigating
  React.useEffect(() => {
    if (onClose) onClose();
  }, [location.pathname]);

  return (
    <aside className="w-72 bg-white border-r border-slate-200 h-screen flex flex-col relative z-20">
      <div className="p-8 lg:p-10 flex items-center justify-between">
        <NavLink to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
              DPDP<span className="text-indigo-600">Shield</span>
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">Enterprise</p>
          </div>
        </NavLink>
        
        <button 
          onClick={onClose}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-6 space-y-1.5 overflow-y-auto">
        <p className="px-5 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Platform</p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="font-bold text-sm">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1 h-4 rounded-full bg-indigo-600" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Zap className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-xs font-bold text-slate-700">Quick Resource</p>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed mb-4 font-medium">
            Learn how to handle Aadhaar and PAN redaction under DPDP Act.
          </p>
          <button 
            onClick={() => navigate('/settings')}
            className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold rounded-xl transition-colors shadow-sm"
          >
            Documentation
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-3.5 w-full text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span className="font-bold text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
