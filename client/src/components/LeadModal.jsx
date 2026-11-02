import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const LeadModal = ({ isOpen, onClose, lead = null, onSuccess }) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'Website',
    subject: 'General Inquiry',
    message: '',
    status: 'New',
    priority: 'Medium',
    dealValue: 0,
    score: 75,
    assignedTo: 'Ryan Ellis',
    followUpDate: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        source: lead.source || 'Website',
        subject: lead.subject || '',
        message: lead.message || '',
        status: lead.status || 'New',
        priority: lead.priority || 'Medium',
        dealValue: lead.dealValue || 0,
        score: lead.score || 75,
        assignedTo: lead.assignedTo || 'Ryan Ellis',
        followUpDate: lead.followUpDate
          ? new Date(lead.followUpDate).toISOString().split('T')[0]
          : '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        source: 'Website',
        subject: 'General Inquiry',
        message: '',
        status: 'New',
        priority: 'Medium',
        dealValue: 0,
        score: 75,
        assignedTo: 'Ryan Ellis',
        followUpDate: '',
      });
    }
    setErrors({});
  }, [lead, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (lead) {
        // Update existing lead
        await api.put(`/leads/${lead._id}`, formData);
        addToast('Lead updated successfully', 'success');
      } else {
        // Create new lead
        await api.post('/leads', formData);
        addToast('New lead added to database', 'success');
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving lead:', err);
      const msg = err.response?.data?.message || 'Failed to save lead';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-md">
              <UserPlus className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {lead ? 'Edit Lead Information' : 'Add New Client Lead'}
              </h3>
              <p className="text-xs text-slate-500">
                {lead ? 'Update contact and qualification data' : 'Create a new CRM record'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Jake Williams"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 rounded-xl border ${
                  errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                placeholder="e.g. jake@acmecorp.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 rounded-xl border ${
                  errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all`}
              />
              {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="e.g. +1 (555) 234-5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                placeholder="e.g. Acme Corporation"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Lead Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lead Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            {/* Lead Source */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lead Source
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Social Media">Social Media</option>
                <option value="Advertisement">Advertisement</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Deal Value */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Deal Value ($)
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 75000"
                value={formData.dealValue}
                onChange={(e) => setFormData({ ...formData, dealValue: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Follow-up Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Schedule Follow-up Date
              </label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Assigned Representative */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Rep
              </label>
              <input
                type="text"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject / Project Title
            </label>
            <input
              type="text"
              placeholder="e.g. UI UX design & Fullstack Platform"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Message / Requirement Details */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lead Notes / Client Message
            </label>
            <textarea
              rows={3}
              placeholder="Enter client background or inquiry message..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-black rounded-xl shadow-lg shadow-black/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-rose-500" />
                  <span>{lead ? 'Update Lead' : 'Create Lead'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
