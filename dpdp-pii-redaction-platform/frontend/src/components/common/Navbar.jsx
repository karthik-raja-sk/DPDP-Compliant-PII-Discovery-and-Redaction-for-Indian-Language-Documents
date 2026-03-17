import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User, ShieldCheck, Menu, X } from 'lucide-react';
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
    <nav className="h-20 glass-panel border-b border-white/5 flex items-center justify-between px-6 md:px-10 sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <button 
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900/60 border border-white/5 text-slate-400 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="relative w-full group hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for documents, PII entities, or audit logs..."
            className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-3 pl-12 pr-10 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/30 transition-all font-light"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
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
              className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900/60 border border-white/5 text-slate-400 hover:text-primary-400 hover:border-primary-500/30 transition-all"
              aria-haspopup="dialog"
              aria-expanded={notificationsOpen}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-[#050914] animate-pulse"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/10 bg-slate-950/90 backdrop-blur-xl shadow-2xl shadow-black/50 z-[80] overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Notifications</p>
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(false)}
                    className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center"
                    aria-label="Close notifications"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white">System ready</p>
                      <p className="text-xs text-slate-500 mt-1">Your workspace is healthy. Upload a document to start scanning.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate('/upload')}
            className="hidden sm:flex relative w-10 h-10 items-center justify-center rounded-xl bg-slate-900/60 border border-white/5 text-slate-400 hover:text-primary-400 hover:border-primary-500/30 transition-all"
            aria-label="Quick scan"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>
        </div>

        <div className="h-8 w-px bg-white/5 hidden sm:block"></div>

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
            <p className="text-sm font-semibold text-slate-200 leading-none group-hover:text-primary-400 transition-colors">
              {user?.full_name || 'Administrator'}
            </p>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-[0.2em] font-bold">
              Premium Tier
            </p>
          </div>
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl premium-gradient p-[1px] shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-[15px] bg-[#050914] flex items-center justify-center text-primary-400 font-bold text-sm">
              {user?.full_name?.split(' ').map(n => n[0]).join('') || 'AD'}
            </div>
          </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-white/10 bg-slate-950/90 backdrop-blur-xl shadow-2xl shadow-black/50 z-[80] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Signed in as</p>
                <p className="text-sm font-bold text-white truncate mt-1">{user?.email || 'admin@example.com'}</p>
              </div>
              <div className="p-2">
                <button
                  type="button"
                  onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-white/[0.05] text-left flex items-center gap-3"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-semibold text-slate-200">Profile & Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setProfileOpen(false); navigate('/audit-logs'); }}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-white/[0.05] text-left flex items-center gap-3"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-semibold text-slate-200">Audit Logs</span>
                </button>
                <div className="h-px bg-white/5 my-2" />
                <button
                  type="button"
                  onClick={() => { setProfileOpen(false); logout(); navigate('/login'); }}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-danger-500/10 text-left flex items-center gap-3"
                >
                  <span className="w-4 h-4 rounded bg-danger-500/15 border border-danger-500/20" />
                  <span className="text-sm font-semibold text-danger-400">Sign out</span>
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
