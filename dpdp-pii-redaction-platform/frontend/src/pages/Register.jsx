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
      console.error('Registration error:', err);
      const msg = err.response?.data?.detail || 'Registration failed. Please try again.';
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl -ml-64 -mt-64 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -mr-64 -mb-64 animate-blob animation-delay-2000"></div>
      
      <div className="w-full max-w-[1000px] flex bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 min-h-[650px] z-10">
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
              Empowering <br />
              <span className="text-indigo-200">The Modern</span> <br />
              Enterprise.
            </h2>
            <p className="text-indigo-100 text-base max-w-sm leading-relaxed font-medium">
              Join thousands of teams using our AI-driven privacy infrastructure to secure their data and stay compliant.
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
             <div className="flex -space-x-2 mb-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-indigo-400 flex items-center justify-center text-[10px] font-bold text-white">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
             </div>
             <p className="text-white text-xs font-bold uppercase tracking-[0.2em]">Trusted by Industry Leaders</p>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="w-full lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Initialize Account</h3>
            <p className="text-slate-500 text-sm font-medium">Set up your secure enterprise workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 px-0.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all font-medium"
                  placeholder="Aravind Sharma"
                />
              </div>
            </div>

            <div className="space-y-1.5 px-0.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Business Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all font-medium"
                  placeholder="aravind@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 px-0.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-1.5 px-0.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Confirm</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="password"
                    required
                    value={formData.confirm_password}
                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-3 rounded-xl animate-in">
                {error}
              </div>
            )}

            <button 
              className="w-full bg-indigo-600 text-white rounded-xl py-3.5 font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none mt-4 flex items-center justify-center gap-2" 
              disabled={loading}
              type="submit"
            >
              {loading ? "Creating Account..." : (
                <>Get Started <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold">Sign in</Link>
          </p>
        </div>
      </div>

      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] text-center w-full">
        Enterprise-Grade Privacy Compliance Platform
      </p>
    </div>
  );
};

export default Register;
