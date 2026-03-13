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
      if (err.response?.status === 422) {
        // Handle FastAPI validation error structure
        const details = err.response.data.detail;
        if (Array.isArray(details)) {
          setError(details.map(d => `${d.loc[d.loc.length - 1]}: ${d.msg}`).join(', '));
        } else {
          setError(details || 'Validation error');
        }
      } else {
        setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050914] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
      
      {/* Decorative Grid Line */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-[1100px] flex glass-card rounded-[32px] overflow-hidden shadow-2xl shadow-primary-500/10 min-h-[640px] z-10">
        {/* Left Side: Illustration & Branding */}
        <div className="hidden lg:flex lg:w-1/2 premium-gradient p-12 flex-col justify-between relative overflow-hidden">
          {/* Animated Background Decoration */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="absolute bg-white rounded-full"
                style={{
                  width: (Math.random() * 4) + 'px',
                  height: (Math.random() * 4) + 'px',
                  top: (Math.random() * 100) + '%',
                  left: (Math.random() * 100) + '%',
                  opacity: Math.random() * 0.5,
                  animation: `subtle-float ${Math.random() * 3 + 2}s infinite`
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 text-white mb-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center shadow-xl">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <span className="text-2xl font-bold tracking-tight">DPDP<span className="opacity-70">Shield</span></span>
            </div>
            
            <h2 className="text-5xl font-black text-white leading-tight mb-6">
              Empowering <br />
              <span className="opacity-60">Privacy at</span> <br />
              Scale.
            </h2>
            <p className="text-white/70 text-lg max-w-sm leading-relaxed">
              Automated PII discovery and redaction for modern Indian enterprises, fully compliant with the DPDP act.
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-[24px]">
            <p className="text-white/60 text-sm italic mb-4">
              "This platform significantly reduced our compliance risk while processing millions of documents daily."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30" />
              <div>
                <p className="text-white font-bold text-sm">John Doe</p>
                <p className="text-white/40 text-[10px] uppercase font-black">CTO, Enterprise Analytics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 p-12 lg:p-16 flex flex-col justify-center bg-slate-950/40 backdrop-blur-xl">
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-3xl font-black text-white mb-3">Welcome Back</h3>
            <p className="text-slate-500 font-medium">Please enter your details to sign in</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all font-light"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <a href="#" className="text-[10px] font-bold text-primary-500 hover:text-primary-400 uppercase tracking-wider">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all font-light"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-danger-500/10 border border-danger-500/20 text-danger-500 text-xs font-bold p-4 rounded-xl flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                <ShieldCheck className="w-4 h-4 rotate-180" />
                {error}
              </div>
            )}

            <Button 
              size="lg" 
              className="w-full rounded-[20px] py-5 mt-4" 
              loading={loading}
              icon={ArrowRight}
              type="submit"
            >
              Secure Login
            </Button>
          </form>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/5"></div>
            <p className="text-slate-600 text-[10px] uppercase font-black">Or continue with</p>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3 bg-slate-900/40 border border-white/5 rounded-2xl text-slate-300 hover:bg-slate-900 hover:text-white transition-all font-bold text-xs group">
              <Github className="w-4 h-4 group-hover:scale-110 transition-transform" /> GitHub
            </button>
            <button className="flex items-center justify-center gap-3 py-3 bg-slate-900/40 border border-white/5 rounded-2xl text-slate-300 hover:bg-slate-900 hover:text-white transition-all font-bold text-xs group">
              <Chrome className="w-4 h-4 group-hover:scale-110 transition-transform" /> Google
            </button>
          </div>

          <p className="mt-10 text-center text-slate-500 text-sm font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-500 hover:text-primary-400 font-bold hover:underline underline-offset-4 decoration-2">Create Enterprise ID</Link>
          </p>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-center w-full">
        <p className="text-slate-600 text-[10px] uppercase tracking-[0.3em] font-black">
          © 2026 DPDP-SHIELD SECURE SYSTEMS • GLOBAL PRIVACY COMPLIANCE
        </p>
      </div>
    </div>
  );
};

export default Login;
