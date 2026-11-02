import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Settings,
  Sparkles,
  User,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ onOpenSidebar, onSearch, searchValue = '' }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    } else if (searchValue.trim()) {
      navigate(`/leads?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 sm:px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      {/* Left: Mobile hamburger & search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onOpenSidebar}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-xl lg:hidden hover:bg-slate-100"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar (matching Image 1) */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search leads, companies, or emails..."
              value={searchValue}
              onChange={(e) => onSearch && onSearch(e.target.value)}
              className="w-full h-11 pl-11 pr-10 text-sm bg-slate-100/80 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all text-slate-800 placeholder-slate-400"
            />
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <div className="absolute right-3 top-3 hidden md:flex items-center">
              <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
        </form>
      </div>

      {/* Right: Badges, Actions, and Profile */}
      <div className="flex items-center gap-3">
        {/* Best Performer Capsule (from Image 1!) */}
        <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-[#0F172A] text-white rounded-2xl shadow-sm border border-slate-800">
          <img
            src={
              admin?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            }
            alt="Performer"
            className="w-6 h-6 rounded-lg object-cover ring-1 ring-slate-700"
          />
          <div className="text-left">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
                Best performer
              </span>
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            </div>
            <p className="text-xs font-semibold leading-none text-slate-200">
              {admin?.name || 'Ryan Ellis'}
            </p>
          </div>
        </div>

        {/* Public Form Quick Link */}
        <button
          onClick={() => window.open('/contact', '_blank')}
          title="Open Public Lead Form"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <span>Live Form</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200 rounded-2xl transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 p-3 bg-white rounded-2xl shadow-xl border border-slate-100 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Notifications
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-rose-100 text-rose-700 font-semibold rounded-full">
                  2 New
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                  <p className="font-semibold text-slate-800">New Website Lead</p>
                  <p className="text-slate-500 text-[11px]">Acme Corp submitted a demo inquiry.</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                  <p className="font-semibold text-slate-800">Follow-up Reminder</p>
                  <p className="text-slate-500 text-[11px]">Meeting with Jake Williams is due today.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings button */}
        <button
          onClick={() => navigate('/profile')}
          title="Settings"
          className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200 rounded-2xl transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Avatar with Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdown(!profileDropdown)}
            className="flex items-center gap-2 p-1 rounded-2xl hover:ring-2 hover:ring-slate-300 transition-all"
          >
            <img
              src={
                admin?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt="Admin"
              className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
            />
          </button>

          {profileDropdown && (
            <div className="absolute right-0 mt-2 w-48 p-1.5 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-800 truncate">{admin?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{admin?.email}</p>
              </div>
              <button
                onClick={() => {
                  setProfileDropdown(false);
                  navigate('/profile');
                }}
                className="flex items-center w-full gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                Profile Settings
              </button>
              <button
                onClick={() => {
                  setProfileDropdown(false);
                  logout();
                  navigate('/login');
                }}
                className="flex items-center w-full gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

