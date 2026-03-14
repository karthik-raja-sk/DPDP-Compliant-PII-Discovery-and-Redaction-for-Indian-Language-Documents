import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ShieldCheck, Mail, Lock, ArrowRight, User, Github, Chrome } from 'lucide-react';
import axios from 'axios';
import Button from '../components/ui/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axios.post('/api/v1/auth/register', {
        email: formData.email,
        full_name: formData.full_name,
        password: formData.password
      });
      toast.success('Account initialized! Please sign in.');
      navigate('/login');
    } catch (err) {
      let msg = 'Registration failed. Please try again.';
      if (err.response?.status === 422) {
        const details = err.response.data.detail;
        if (Array.isArray(details)) {
          msg = details.map(d => `${d.loc[d.loc.length - 1]}: ${d.msg}`).join(', ');
        } else {
          msg = details || 'Validation error';
        }
      } else {
        msg = err.response?.data?.detail || msg;
      }
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050914] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-[1100px] flex glass-card rounded-[32px] overflow-hidden shadow-2xl shadow-primary-500/10 min-h-[700px] z-10">
        {/* Left Side: Illustration & Branding */}
        <div className="hidden lg:flex lg:w-1/2 premium-gradient p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="absolute bg-white rounded-full"
                style={{
                  width: Math.random() * 4 + 'px',
                  height: Math.random() * 4 + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
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
              Modernize <br />
              <span className="opacity-60">Your Security</span> <br />
              Stack.
            </h2>
            <p className="text-white/70 text-lg max-w-sm leading-relaxed">
              Join the future of enterprise privacy management. Secure your data with AI-powered redaction.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4">
             <div className="flex -space-x-3">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-primary-600 bg-slate-800" />
               ))}
             </div>
             <p className="text-white text-xs font-bold uppercase tracking-wider">Trusted by 500+ Security Teams</p>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="w-full lg:w-1/2 p-12 lg:p-16 flex flex-col justify-center bg-slate-950/40 backdrop-blur-xl">
          <div className="mb-8 text-center lg:text-left">
            <h3 className="text-3xl font-black text-white mb-2">Create Account</h3>
            <p className="text-slate-500 font-medium text-sm">Sign up for your secure enterprise ID</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5 group">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-white text-sm placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all font-light"
                  placeholder="Alex Smith"
                />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-white text-sm placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all font-light"
                  placeholder="alex@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 group">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-white text-sm placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all font-light"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-1.5 group">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="password"
                    required
                    value={formData.confirm_password}
                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                    className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-white text-sm placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all font-light"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-danger-500/10 border border-danger-500/20 text-danger-500 text-[10px] font-black uppercase p-3 rounded-xl flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                <ShieldCheck className="w-3.5 h-3.5 rotate-180" />
                {error}
              </div>
            )}

            <Button 
              size="lg" 
              className="w-full rounded-[18px] py-4 mt-2" 
              loading={loading}
              icon={ArrowRight}
              type="submit"
            >
              Initialize Protection
            </Button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-400 font-bold hover:underline underline-offset-4 decoration-2">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
