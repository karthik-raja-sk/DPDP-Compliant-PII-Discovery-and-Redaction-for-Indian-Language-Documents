import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User, ShieldCheck, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [search, setSearch] = React.useState('');
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const profileRef = React.useRef(null);
  const notificationsRef = React.useRef(null);

  React.useEffect(() => {
    const onDocMouseDown = (e) => {
      const target = e.target;
      if (profileRef.current && !profileRef.current.contains(target)) setProfileOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(target)) setNotificationsOpen(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);

  return (
    <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 md:px-10 sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <button 
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="relative w-full group hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for documents, PII entities, or audit logs..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-12 pr-10 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all font-medium"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-2">
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen(v => !v);
                setProfileOpen(false);
              }}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-500/30 transition-all"
              aria-haspopup="dialog"
              aria-expanded={notificationsOpen}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white animate-pulse"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 bg-white shadow-2xl z-[80] overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Notifications</p>
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(false)}
                    className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center"
                    aria-label="Close notifications"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900">System Analytics Ready</p>
                      <p className="text-xs text-slate-500 mt-1">Real-time DPDP compliance monitoring is active for your account.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate('/upload')}
            className="hidden sm:flex relative w-10 h-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-500/30 transition-all"
            aria-label="Quick scan"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>
        </div>

        <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setProfileOpen(v => !v);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-4 group"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
          >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">
              {user?.full_name || 'Administrator'}
            </p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.2em] font-bold">
              {user?.role || 'Premium'} Tier
            </p>
          </div>
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-indigo-600 p-[1px] shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-[calc(100%-2px)] h-[calc(100%-2px)] rounded-[15px] bg-white flex items-center justify-center text-indigo-600 font-bold text-sm">
              {user?.full_name?.split(' ').map(n => n[0]).join('') || 'AD'}
            </div>
          </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-slate-200 bg-white shadow-2xl z-[80] overflow-hidden">
              <div className="px-4 py-4 border-b border-slate-100 bg-slate-50/50">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Account</p>
                <p className="text-sm font-bold text-slate-900 truncate mt-1">{user?.email || 'admin@example.com'}</p>
              </div>
              <div className="p-2">
                <button
                  type="button"
                  onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left flex items-center gap-3 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-700">Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setProfileOpen(false); navigate('/audit-logs'); }}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left flex items-center gap-3 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-700">Audit Logs</span>
                </button>
                <div className="h-px bg-slate-100 my-2" />
                <button
                  type="button"
                  onClick={() => { setProfileOpen(false); logout(); navigate('/'); }}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-red-50 text-left flex items-center gap-3 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-bold text-red-600">Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
