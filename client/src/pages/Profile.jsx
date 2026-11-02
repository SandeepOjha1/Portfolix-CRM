import React, { useState, useEffect } from 'react';
import {
  Shield,
  Key,
  Mail,
  User,
  Clock,
  Save,
  Loader2,
  Building2,
  Briefcase,
  Phone,
  MapPin,
  Globe,
  Sparkles,
  CheckCircle2,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sandeep%20Ojha',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria',
];

const TIMEZONES = [
  'UTC+05:30 (India Standard Time - IST)',
  'UTC-08:00 (Pacific Time - PT)',
  'UTC-05:00 (Eastern Time - ET)',
  'UTC+00:00 (Greenwich Mean Time - GMT)',
  'UTC+01:00 (Central European Time - CET)',
  'UTC+08:00 (Singapore / Hong Kong - SGT)',
  'UTC+09:00 (Japan Standard Time - JST)',
  'UTC+10:00 (Australian Eastern - AEST)',
];

const Profile = () => {
  const { admin, updateProfile } = useAuth();
  const { addToast } = useToast();

  // Personal Info
  const [name, setName] = useState(admin?.name || '');
  const [email, setEmail] = useState(admin?.email || '');
  const [avatar, setAvatar] = useState(admin?.avatar || '');
  const [phone, setPhone] = useState(admin?.phone || '');
  const [bio, setBio] = useState(admin?.bio || '');

  // Company Info
  const [company, setCompany] = useState(admin?.company || '');
  const [title, setTitle] = useState(admin?.title || '');
  const [department, setDepartment] = useState(admin?.department || '');
  const [website, setWebsite] = useState(admin?.website || '');

  // Address & Location
  const [address, setAddress] = useState(admin?.address || '');
  const [city, setCity] = useState(admin?.city || '');
  const [state, setState] = useState(admin?.state || '');
  const [country, setCountry] = useState(admin?.country || '');
  const [postalCode, setPostalCode] = useState(admin?.postalCode || '');
  const [timezone, setTimezone] = useState(admin?.timezone || 'UTC+05:30 (India Standard Time - IST)');

  // Password Change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (admin) {
      setName(admin.name || '');
      setEmail(admin.email || '');
      setAvatar(admin.avatar || '');
      setPhone(admin.phone || '');
      setBio(admin.bio || '');
      setCompany(admin.company || '');
      setTitle(admin.title || '');
      setDepartment(admin.department || '');
      setWebsite(admin.website || '');
      setAddress(admin.address || '');
      setCity(admin.city || '');
      setState(admin.state || '');
      setCountry(admin.country || '');
      setPostalCode(admin.postalCode || '');
      if (admin.timezone) setTimezone(admin.timezone);
    }
  }, [admin]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({
        name,
        email,
        avatar,
        phone,
        bio,
        company,
        title,
        department,
        website,
        address,
        city,
        state,
        country,
        postalCode,
        timezone,
      });
      addToast('Profile & company details updated successfully!', 'success');
    } catch (err) {
      console.error('Update profile failed:', err);
      addToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }

    setSavingPassword(true);
    try {
      await updateProfile({ currentPassword, newPassword });
      addToast('Password updated successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Password change failed:', err);
      addToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Admin Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your personal identity, company details, contact information, and security credentials
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Profile Overview Card */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="crm-card p-6 flex flex-col items-center text-center">
            {/* Avatar with Status Pulse */}
            <div className="relative mb-4 group">
              <img
                src={
                  avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'Admin')}`
                }
                alt="Admin Avatar"
                className="w-28 h-28 rounded-3xl object-cover ring-4 ring-slate-100 shadow-lg bg-slate-50 transition-transform group-hover:scale-105"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full ring-2 ring-white flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white animate-ping opacity-75" />
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              {name || 'Administrator'}
            </h3>
            
            <p className="text-xs font-semibold text-rose-600 mt-0.5">
              {title || 'CRM Administrator'}
              {company ? ` • ${company}` : ''}
            </p>

            <p className="text-xs text-slate-400 font-mono mt-1 mb-3">{email}</p>

            {/* Role Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold mb-4 shadow-sm">
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span>{admin?.role === 'superadmin' ? 'Super Administrator' : 'System Administrator'}</span>
            </div>

            {/* Quick Contact & Location Badges */}
            <div className="w-full flex flex-col gap-2 py-3 border-y border-slate-100 text-xs text-slate-600">
              {phone && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium font-mono">{phone}</span>
                </div>
              )}
              {(city || country) && (
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium">
                    {[city, state, country].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
              {website && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a
                    href={website.startsWith('http') ? website : `https://${website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline truncate"
                  >
                    {website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>

            {/* Bio Snippet */}
            {bio && (
              <div className="w-full my-3 p-3 bg-slate-50 rounded-xl text-left border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">About</span>
                <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-3">
                  "{bio}"
                </p>
              </div>
            )}

            {/* System Details Metadata */}
            <div className="w-full space-y-2.5 text-left text-xs text-slate-600 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Account Status</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active & Verified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Access Level</span>
                <span className="font-semibold text-slate-800">Full System Access</span>
              </div>
              {department && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Department</span>
                  <span className="font-medium text-slate-800">{department}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Timezone</span>
                <span className="font-mono text-[11px] text-slate-700 truncate max-w-[170px]" title={timezone}>
                  {timezone.split(' ')[0]}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Last Login</span>
                <span className="font-mono text-slate-700">
                  {admin?.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Active session'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Preset Avatars Picker */}
          <div className="crm-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Quick Avatar Presets
              </span>
              <span className="text-[10px] text-slate-400">Click to preview</span>
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(preset)}
                  className={`relative p-1 rounded-2xl transition-all ${
                    avatar === preset
                      ? 'ring-2 ring-rose-500 bg-rose-50 scale-105'
                      : 'hover:bg-slate-100 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt={`Preset ${idx + 1}`} className="w-9 h-9 rounded-xl object-cover" />
                  {avatar === preset && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Editable Details Sections */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Section 1: Personal Details */}
            <div className="crm-card p-6">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
                    <p className="text-xs text-slate-500">Your public identity and contact details</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                  Step 1 of 3
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sandeep Ojha"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://api.dicebear.com/..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-600 font-mono text-[11px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Professional Bio / Summary
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Brief description of your role, responsibilities, or leadership background..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Company & Organization */}
            <div className="crm-card p-6">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Company & Organization</h3>
                    <p className="text-xs text-slate-500">Corporate affiliation and business title</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                  Step 2 of 3
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company / Organization Name
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Portfolix Global Inc."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Job Title / Designation
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. VP of Revenue Operations"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department / Division
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Sales & Executive Leadership"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Website
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://company.com"
                      className="w-full pl-8 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                    />
                    <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Address & Location */}
            <div className="crm-card p-6">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Address & Geographical Info</h3>
                    <p className="text-xs text-slate-500">Physical office or remote operational timezone</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                  Step 3 of 3
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 100 Innovation Boulevard, Suite 500"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. San Francisco"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. California"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. United States"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Postal / Zip Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 94107"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700"
                  >
                    {TIMEZONES.map((tz, i) => (
                      <option key={i} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Save Button for Profile Sections */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  All profile changes are persisted in MongoDB
                </span>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl shadow-md transition-all disabled:opacity-50 active:scale-95"
                >
                  {savingProfile ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save All Profile Changes</span>
                </button>
              </div>
            </div>
          </form>

          {/* Section 4: Security & Authentication */}
          <div className="crm-card p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Security & Authentication</h3>
                  <p className="text-xs text-slate-500">Update administrative password and verify session encryption</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <Shield className="w-3 h-3 text-emerald-500" />
                bcrypt 10 rounds
              </span>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Password (min 6 characters) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new strong password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm New Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3">
                <p className="text-[11px] text-slate-400">
                  Changing your password re-verifies your authentication token.
                </p>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all disabled:opacity-50 active:scale-95"
                >
                  {savingPassword ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Key className="w-3.5 h-3.5" />
                  )}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
