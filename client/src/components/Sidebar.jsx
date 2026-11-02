import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  BarChart3,
  UserCheck,
  Send,
  LogOut,
  LifeBuoy,
  X,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Analytics', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: Users },
    { name: 'Follow-ups', path: '/followups', icon: CalendarClock },
    { name: 'Insights', path: '/analytics', icon: BarChart3 },
    { name: 'My Profile', path: '/profile', icon: UserCheck },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#0B0F19] text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800/60`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
              P
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">Portfolix</span>
              <span className="text-rose-500 font-extrabold text-xl">.</span>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block -mt-1">
                CRM
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Label */}
        <div className="px-6 pt-6 pb-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Menu
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-black text-white shadow-md shadow-black/40 border border-slate-800'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-rose-500' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span className="flex-1">{item.name}</span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 pb-2 px-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              External
            </p>
          </div>

          {/* Public Home Link */}
          <NavLink
            to="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3.5">
              <ExternalLink className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <span>Public Website</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
          </NavLink>

          {/* Public Contact Form Link */}
          <NavLink
            to="/contact"
            target="_blank"
            className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3.5">
              <Send className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <span>Contact Page</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
          </NavLink>
        </nav>

        {/* Support & Admin Footer */}
        <div className="p-4 border-t border-slate-800/60 bg-[#080C14]">
          <div className="flex items-center justify-between mb-3 px-2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer">
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-3.5 h-3.5 text-slate-400" />
              <span>Support & Docs</span>
            </div>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </div>

          {/* User profile capsule */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={
                  admin?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt={admin?.name || 'Admin'}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-800"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {admin?.name || 'Ryan Ellis'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate">
                  ID: #AD322
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

