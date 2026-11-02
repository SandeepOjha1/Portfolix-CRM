import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  BarChart3,
  Users,
  CalendarClock,
  Send,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
  Layers,
  Star,
  Activity,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import Card3D from '../components/Card3D';
import Background3D from '../components/Background3D';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070A11] text-white selection:bg-rose-500 selection:text-white relative overflow-hidden font-sans">
      {/* 3D Animated Background */}
      <Background3D />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#070A11]/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform">
              P
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white">Portfolix</span>
              <span className="text-rose-500 font-extrabold text-xl">.</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block -mt-1">
                CRM
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#preview" className="hover:text-white transition-colors">
              Live Preview
            </a>
            <a href="#workflow" className="hover:text-white transition-colors">
              How It Works
            </a>
            <Link to="/contact" className="hover:text-white transition-colors flex items-center gap-1">
              <span>Public Contact Form</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 rounded-xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto z-10 text-center">
        {/* Badge Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300 mb-6 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span className="font-bold text-white">Portfolix CRM 2.0</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Production-Ready Lead Management</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1] mb-6">
          Turn Every Website Lead Into{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-indigo-400">
            Closed Revenue.
          </span>
        </h1>

        {/* Subhead */}
        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          A centralized, intelligent mini CRM engineered for high-growth businesses. Track client
          inquiries, qualify prospects, manage follow-ups, and visualize pipeline health in real time.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/signup"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 text-base font-bold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-2xl transition-all shadow-md hover:border-slate-600"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Try Admin Demo (admin@crm.com)</span>
          </Link>

          <Link
            to="/contact"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-slate-400 hover:text-white rounded-2xl hover:bg-white/5 transition-colors"
          >
            <Send className="w-4 h-4 text-sky-400" />
            <span>Open Contact Form</span>
          </Link>
        </div>

        {/* 3D Interactive Dashboard Preview (Tilt on mouse move!) */}
        <div id="preview" className="max-w-5xl mx-auto relative pt-4">
          {/* Floating 3D Chips */}
          <div className="absolute -top-6 -left-4 sm:left-4 z-20 hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white shadow-2xl backdrop-blur-xl float-slow">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold">🎉 Deal Won · Acme Corp ($75,000)</span>
          </div>

          <div className="absolute -top-2 right-2 sm:right-6 z-20 hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white shadow-2xl backdrop-blur-xl float-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-bold">⏰ Follow-up Today · Lincoln Donin</span>
          </div>

          <div className="absolute -bottom-6 left-1/3 z-20 hidden md:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white shadow-2xl backdrop-blur-xl float-fast">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold">+13% Conversion Growth</span>
          </div>

          {/* 3D Dashboard Card */}
          <Card3D maxTilt={6} glare={true} depth={25} className="w-full">
            <div className="rounded-3xl bg-[#0D121F]/90 border border-slate-800/90 p-4 sm:p-6 shadow-[0_0_60px_-15px_rgba(99,102,241,0.25)] text-left backdrop-blur-xl">
              {/* Fake Window bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-500 hidden sm:inline">
                    portfolix-crm.internal/dashboard
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>MongoDB Live Sync</span>
                </div>
              </div>

              {/* Mini dashboard replica matching Image 1 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <p className="text-[11px] font-bold uppercase text-slate-400">Month Target</p>
                  <p className="text-xl sm:text-2xl font-black text-white mt-1">45 / 60</p>
                  <p className="text-[10px] text-rose-400 font-semibold mt-0.5">34 Avg conversions</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <p className="text-[11px] font-bold uppercase text-slate-400">Total Leads</p>
                  <p className="text-xl sm:text-2xl font-black text-white mt-1">200</p>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">+18% this month</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <p className="text-[11px] font-bold uppercase text-slate-400">Active Deals</p>
                  <p className="text-xl sm:text-2xl font-black text-white mt-1">$380,000</p>
                  <p className="text-[10px] text-indigo-400 font-semibold mt-0.5">Pipeline volume</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <p className="text-[11px] font-bold uppercase text-slate-400">Win Rate</p>
                  <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">25.0%</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Qualified leads</p>
                </div>
              </div>

              {/* Conversion split snippet & mini lead table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-300 block">Conversion Split</span>
                  <div className="space-y-1.5">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>UI UX design</span>
                        <span className="font-bold text-white">30 of 60</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1">
                        <div className="bg-rose-500 h-full rounded-full w-[70%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Flutter Development</span>
                        <span className="font-bold text-white">18 of 60</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1">
                        <div className="bg-rose-400 h-full rounded-full w-[45%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="font-bold text-slate-300 block mb-2">Recent Captured Leads</span>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-800/40">
                      <span className="font-semibold text-white">Jake Williams (Acme Corp)</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[10px]">
                        Qualified
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-800/40">
                      <span className="font-semibold text-white">Gretchen Herwitz (The North Face)</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                        Converted
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card3D>
        </div>
      </section>

      {/* Feature Cards Grid (Interactive 3D Cards) */}
      <section id="features" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400 mb-3">
            <Layers className="w-3.5 h-3.5 text-rose-500" />
            <span>Built For Precision & Speed</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Everything you need to scale client conversions.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            Designed to replace clunky, outdated software with high-performance modern tooling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card3D maxTilt={10} glare={true} depth={20}>
            <div className="h-full p-6 rounded-3xl bg-[#0D121F]/90 border border-slate-800/90 shadow-xl backdrop-blur-xl flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">CRM Table & Lead Filters</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Interactive table with avatars, qualification scores (`4.5/5`), instant search,
                  status pill dropdowns, and RFC 4180 CSV export for reports.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-rose-400 font-bold">
                <span>Explore Table View</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card3D>

          {/* Card 2 */}
          <Card3D maxTilt={10} glare={true} depth={20}>
            <div className="h-full p-6 rounded-3xl bg-[#0D121F]/90 border border-slate-800/90 shadow-xl backdrop-blur-xl flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Activity Timeline & Notes</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Log phone calls, discovery meetings with attendee pills, internal private notes,
                  and follow-up reminders in a chronological visual feed.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-bold">
                <span>Inspect Timeline</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card3D>

          {/* Card 3 */}
          <Card3D maxTilt={10} glare={true} depth={20}>
            <div className="h-full p-6 rounded-3xl bg-[#0D121F]/90 border border-slate-800/90 shadow-xl backdrop-blur-xl flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Live Website Contact Form</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Separate public contact portal protected with rate limiting and automated MongoDB
                  ingestion. Every submission appears in real time.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-bold">
                <span>View Public Form</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card3D>
        </div>
      </section>

      {/* How it Works / Workflow section */}
      <section id="workflow" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How Portfolix CRM Works</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            From customer inquiry to closed contract in 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-rose-400 font-mono font-bold flex items-center justify-center mb-4">
              01
            </div>
            <h4 className="text-base font-bold text-white mb-2">Visitor Inquiry</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Potential client fills out the public website contact form with project requirements.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-purple-400 font-mono font-bold flex items-center justify-center mb-4">
              02
            </div>
            <h4 className="text-base font-bold text-white mb-2">Automated Ingestion</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inquiry is validated, sanitized, rate-limited, and saved into MongoDB as a "New" lead.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-indigo-400 font-mono font-bold flex items-center justify-center mb-4">
              03
            </div>
            <h4 className="text-base font-bold text-white mb-2">Qualification & Touch</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Admin schedules follow-ups, changes status to "Contacted", and logs phone calls.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 font-mono font-bold flex items-center justify-center mb-4">
              04
            </div>
            <h4 className="text-base font-bold text-white mb-2">Conversion Won</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deal is marked "Converted", updating your monthly revenue & analytics charts.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto z-10 relative text-center">
        <Card3D maxTilt={6} glare={true} depth={15}>
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-indigo-950/40 border border-indigo-500/30 shadow-2xl backdrop-blur-xl">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Ready to supercharge your lead conversion?
            </h2>
            <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
              Create your admin account in seconds or try our pre-seeded live demo environment.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shadow-xl transition-all hover:scale-105"
              >
                Sign Up With Your Credentials
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm transition-all"
              >
                Log In To Existing Account
              </Link>
            </div>
          </div>
        </Card3D>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 sm:px-8 text-center text-xs text-slate-500 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Portfolix CRM. Production-Quality Client Lead Management System.</p>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-slate-300">
              Public Contact Portal
            </Link>
            <Link to="/login" className="hover:text-slate-300">
              Admin Login
            </Link>
            <Link to="/signup" className="hover:text-slate-300">
              Create Account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
