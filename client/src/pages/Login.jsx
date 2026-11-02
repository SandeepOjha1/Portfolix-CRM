import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Loader2, Sparkles, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card3D from '../components/Card3D';
import Background3D from '../components/Background3D';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      addToast('Welcome back to your CRM!', 'success');
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
    <div className="min-h-screen bg-[#070A11] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none">
      {/* 3D Animated Background */}
      <Background3D />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform">
              P
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Portfolix<span className="text-rose-500">.</span>CRM
            </h1>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300 shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure Admin & User Portal</span>
          </div>
        </div>

        {/* 3D Perspective Card */}
        <Card3D maxTilt={8} glare={true} depth={20} className="w-full">
          <div className="bg-[#0F1424]/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-white tracking-tight">Sign In to Dashboard</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your administrative or personal credentials to manage leads.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="admin@crm.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm bg-slate-900/90 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">Password</label>
                  <span className="text-[11px] text-slate-500">Demo: admin123</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-10 pr-10 text-xs sm:text-sm bg-slate-900/90 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
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
            <div className="mt-5 pt-4 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Fill Demo Admin (admin@crm.com)</span>
              </button>
            </div>

            {/* Link to Signup */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                Don't have an account yet?{' '}
                <Link
                  to="/signup"
                  className="font-bold text-white hover:text-rose-400 underline underline-offset-4 transition-colors"
                >
                  Create one now →
                </Link>
              </p>
            </div>
          </div>
        </Card3D>

        {/* Footer Links */}
        <div className="mt-6 text-center flex items-center justify-center gap-4 text-xs text-slate-500">
          <Link to="/" className="hover:text-slate-300 transition-colors">
            ← Home
          </Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-slate-300 transition-colors">
            Public Contact Form
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
