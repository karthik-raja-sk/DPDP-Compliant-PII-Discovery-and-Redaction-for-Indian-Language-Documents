import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ShieldCheck, Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({
        username: formData.email,
        password: formData.password
      });
      toast.success('Access Granted. Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.detail || 'Invalid credentials. Please try again.';
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl -mr-64 -mt-64 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -ml-64 -mb-64 animate-blob animation-delay-2000"></div>
      
      <div className="w-full max-w-[1000px] flex bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 min-h-[600px] z-10">
        {/* Left Side: Illustration & Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-white mb-10">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">DPDP<span className="opacity-70">Shield</span></span>
            </div>
            
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
              Modern Trust <br />
              <span className="text-indigo-200">Built on</span> <br />
              Data Privacy.
            </h2>
            <p className="text-indigo-100 text-base max-w-sm leading-relaxed font-medium">
              Join the elite Indian enterprises automating compliance with our AI-driven privacy infrastructure.
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
             <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-1 rounded-full bg-white/60" />)}
             </div>
             <p className="text-white text-sm font-medium mb-4 italic leading-relaxed">
              "DPDPShield transformed our manual redaction workflow into a 5-second automated process. Critical for our scale."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-400 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white">JD</div>
              <div>
                <p className="text-white font-bold text-xs">Aravind Sharma</p>
                <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider">Lead Architect, Finsecure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h3>
            <p className="text-slate-500 text-sm font-medium">Continue to your privacy workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Business Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-6 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                <button type="button" onClick={() => toast("Reset link sent if account exists.")} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">Reset?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-6 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all font-medium"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2 animate-in">
                {error}
              </div>
            )}

            <button 
              className="w-full bg-indigo-600 text-white rounded-xl py-3.5 font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none mt-4 flex items-center justify-center gap-2" 
              disabled={loading}
              type="submit"
            >
              {loading ? "Authenticating..." : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm font-medium">
            New to DPDPShield?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-bold">Create account</Link>
          </p>
        </div>
      </div>

      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] text-center w-full">
        Enterprise-Grade Privacy Compliance Platform
      </p>
    </div>
  );
};

export default Login;
