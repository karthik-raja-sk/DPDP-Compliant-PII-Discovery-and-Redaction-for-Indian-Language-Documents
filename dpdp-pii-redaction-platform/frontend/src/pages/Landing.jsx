import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, CheckCircle, ArrowRight, Zap, Globe, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg shadow-indigo-200 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-700">
                DPDPShield
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it Works</a>
              <a href="#compliance" className="hover:text-indigo-600 transition-colors">Compliance</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center relative"
          >
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
            
            <motion.span variants={itemVariants} className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full border border-indigo-100">
              Enterprise Data Security & DPDP Compliance
            </motion.span>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              AI-Powered <span className="text-indigo-600">Privacy Intelligence</span> <br />
              for Indian Enterprises
            </motion.h1>
            
            <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg text-slate-600 mb-10 leading-relaxed text-balance">
              Automate strict mandate compliance with integrated zero-shot NLP discovery, dynamic risk-scoring telemetry, and high-fidelity algorithmic redaction. Maintain data sovereignty and protect your institutional reputation.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl hover:bg-slate-800 hover:-translate-y-1 transition-all group">
                Try Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#how-it-works" className="flex items-center justify-center gap-2 bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all">
                Book Demo
              </a>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-20 relative px-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
               <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex gap-4">
                    <div className="px-3 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-400">
                      dpdp-platform.enterprise.io/dashboard
                    </div>
                  </div>
                  <Zap className="w-5 h-5 text-indigo-500 fill-indigo-100" />
               </div>
               <div className="p-2 md:p-4 bg-slate-100/50">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=600" alt="Dashboard Preview" className="rounded-xl shadow-lg border border-slate-200 grayscale-[0.2] hover:grayscale-0 transition-all duration-700" />
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Enterprise Compliance Telemetry</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Modern cloud infrastructure demands intelligence beyond Regex. Our hybrid architecture seamlessly bridges deterministic parsing, heuristic validations, and stochastic NLP extraction.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300">
              <div className="bg-indigo-100 p-3 rounded-2xl w-fit mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Indian Context Ready</h3>
              <p className="text-slate-600 leading-relaxed">Built-in recognition for Aadhaar, PAN, Voter ID, UPI, and major Indian banking formats.</p>
            </div>

            <div className="group p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-purple-100 hover:bg-white hover:shadow-2xl hover:shadow-purple-100 transition-all duration-300">
              <div className="bg-purple-100 p-3 rounded-2xl w-fit mb-6 text-purple-600 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Privacy Risk Scoring</h3>
              <p className="text-slate-600 leading-relaxed">Quantify risk with 0-100 scores based on PII density, sensitivity, and combination risk factors.</p>
            </div>

            <div className="group p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-emerald-100 hover:bg-white hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-300">
              <div className="bg-emerald-100 p-3 rounded-2xl w-fit mb-6 text-emerald-600 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Cryptographic & Visual Redaction</h3>
              <p className="text-slate-600 leading-relaxed">Dynamic policy orchestration providing structural masking, partial character cryptographic hashing, or categorical entity aliasing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Quote / Stats */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <p className="text-indigo-400 font-bold mb-4">DRIVING COMPLIANCE AT SCALE</p>
           <blockquote className="text-3xl md:text-5xl font-extrabold italic mb-12 px-4 leading-tight">
             "Data privacy is not just a regulatory hurdle; it's the foundation of customer trust in the modern digital age."
           </blockquote>
           <div className="flex flex-wrap justify-center gap-12 text-center">
              <div>
                <p className="text-4xl font-bold mb-1">99%</p>
                <p className="text-slate-400 text-sm">Detection Accuracy</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-1">&lt; 3s</p>
                <p className="text-slate-400 text-sm">Average Scan Time</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-1">100%</p>
                <p className="text-slate-400 text-sm">DPDP Compliant</p>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <span className="text-slate-900 font-bold tracking-tight">DPDPShield Enterprise</span>
          </div>
          <p className="text-slate-500 text-sm ml-auto">
            &copy; {new Date().getFullYear()} AI Privacy Labs Inc. Built for MNC-quality demonstrations.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-600"><Lock className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-slate-600"><FileText className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
