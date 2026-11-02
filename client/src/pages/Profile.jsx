import React, { useState } from 'react';
import {
  UserCheck,
  Shield,
  Key,
  Mail,
  User,
  Clock,
  Save,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const { admin, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(admin?.name || '');
  const [email, setEmail] = useState(admin?.email || '');
  const [avatar, setAvatar] = useState(admin?.avatar || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ name, email, avatar });
      addToast('Profile updated successfully', 'success');
    } catch (err) {
      console.error('Update profile failed:', err);
      addToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
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

    setLoading(true);
    try {
      await updateProfile({ currentPassword, newPassword });
      addToast('Password changed successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Password change failed:', err);
      addToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Admin Profile & Security
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your administrative profile and authentication credentials
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 crm-card p-6 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <img
              src={
                avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt="Admin"
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-slate-100 shadow-md"
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>

          <h3 className="text-lg font-extrabold text-slate-900">{admin?.name || 'Ryan Ellis'}</h3>
          <p className="text-xs text-slate-400 font-mono mb-3">{admin?.email}</p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold mb-6">
            <Shield className="w-3.5 h-3.5 text-rose-500" />
            <span>Super Administrator</span>
          </div>

          <div className="w-full pt-4 border-t border-slate-100 space-y-2 text-left text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Status</span>
              <span className="font-bold text-emerald-600">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Access Level</span>
              <span className="font-semibold text-slate-800">Full System Access</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Last Login</span>
              <span className="font-mono text-slate-700">
                {admin?.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Active session'}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* General Information */}
          <div className="crm-card p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">Personal Details</h3>
            <p className="text-xs text-slate-500 mb-4">Update your display information and avatar</p>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="crm-card p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">Change Password</h3>
            <p className="text-xs text-slate-500 mb-4">Ensure your account is protected with a strong password</p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
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
