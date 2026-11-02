import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      addToast('Welcome back, Admin!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      setError(
        err.response?.data?.message ||
        'Authentication failed. Please verify your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@crm.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0A0E17] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 mb-4 shadow-inner">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure Admin Portal</span>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/25">
              P
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Portfolix<span className="text-rose-500">.</span>CRM
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            Client Lead Management & Conversion Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#111625] border border-slate-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Sign In to Dashboard</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter your administrator credentials to access leads and analytics.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@crm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-sm bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-500">Default: admin123</span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-sm bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Fill Demo Credentials (admin@crm.com)</span>
            </button>
          </div>
        </div>

        {/* Public Contact Form Link */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Are you a website visitor?{' '}
            <Link
              to="/contact"
              className="text-slate-300 hover:text-white underline underline-offset-4 font-medium"
            >
              Open Website Contact Form
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
