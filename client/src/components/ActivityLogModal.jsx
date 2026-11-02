import React, { useState } from 'react';
import { Phone, Mail, Calendar, MessageSquare, Plus, Loader2, X } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const ActivityLogModal = ({ isOpen, onClose, leadId, onSuccess }) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activityType, setActivityType] = useState('call');
  const [action, setAction] = useState('Phone Call');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [participants, setParticipants] = useState('');

  if (!isOpen) return null;

  const activityOptions = [
    { id: 'call', label: 'Phone Call', icon: Phone, color: 'text-emerald-500 bg-emerald-50' },
    { id: 'email', label: 'Email Sent', icon: Mail, color: 'text-blue-500 bg-blue-50' },
    { id: 'meeting', label: 'Meeting', icon: Calendar, color: 'text-amber-500 bg-amber-50' },
    { id: 'note', label: 'Internal Note', icon: MessageSquare, color: 'text-purple-500 bg-purple-50' },
  ];

  const handleTypeSelect = (opt) => {
    setActivityType(opt.id);
    setAction(opt.label);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      addToast('Please provide an activity description', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/leads/${leadId}/activities`, {
        action,
        description: description.trim(),
        type: activityType,
        metadata: {
          duration: duration || undefined,
          participants: participants || undefined,
        },
      });

      addToast('Activity logged successfully', 'success');
      setDescription('');
      setDuration('');
      setParticipants('');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error logging activity:', err);
      addToast('Failed to log activity', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Log Lead Activity</h3>
            <p className="text-xs text-slate-500">Record a touchpoint in this client's timeline</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Activity Type Selection Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {activityOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = activityType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleTypeSelect(opt)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all text-center ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-white/10 text-white' : opt.color
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold">{opt.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Activity Summary / Notes <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder={`Details about this ${action.toLowerCase()}...`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {activityType === 'call' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Call Duration (e.g. 15 mins)
              </label>
              <input
                type="text"
                placeholder="e.g. 25 minutes"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          )}

          {activityType === 'meeting' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Attendees / Participants
              </label>
              <input
                type="text"
                placeholder="e.g. Jake Williams, Sarah Chen + 2 others"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-rose-500" />
                  <span>Log Activity</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityLogModal;

