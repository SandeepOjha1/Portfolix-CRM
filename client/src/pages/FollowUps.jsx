import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarClock,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  Building2,
  Check,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const FollowUps = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    overdue: [],
    today: [],
    upcoming: [],
    completed: [],
    counts: { overdue: 0, today: 0, upcoming: 0, completed: 0 },
  });

  const [activeTab, setActiveTab] = useState('all');

  const fetchFollowUps = useCallback(async () => {
    try {
      const res = await api.get('/followups');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load follow-ups:', err);
      addToast('Failed to load follow-ups', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchFollowUps();
  }, [fetchFollowUps]);

  const handleUpdateStatus = async (leadId, followUpStatus) => {
    try {
      await api.patch(`/followups/${leadId}`, { followUpStatus });
      addToast(`Follow-up marked as ${followUpStatus}`, 'success');
      fetchFollowUps();
    } catch (err) {
      console.error('Failed to update status:', err);
      addToast('Failed to update status', 'error');
    }
  };

  const handleReschedule = async (leadId, newDate) => {
    if (!newDate) return;
    try {
      await api.patch(`/followups/${leadId}`, { followUpDate: newDate });
      addToast('Follow-up rescheduled', 'success');
      fetchFollowUps();
    } catch (err) {
      console.error('Failed to reschedule:', err);
      addToast('Failed to reschedule follow-up', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500 mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading follow-up schedule...</p>
      </div>
    );
  }

  const { overdue, today, upcoming, completed, counts } = data;

  const renderSection = (title, items, badgeColor, icon) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${badgeColor}`}>
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 text-center text-xs text-slate-400">
          No follow-ups in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((lead) => (
            <div
              key={lead._id}
              className="crm-card p-5 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4
                      onClick={() => navigate(`/leads/${lead._id}`)}
                      className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      {lead.name}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>{lead.company || 'Individual Client'}</span>
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {lead.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 my-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {lead.subject || lead.message || 'Scheduled check-in with client.'}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : 'N/A'}
                  </span>
                  <span className="font-semibold text-slate-700">{lead.assignedTo}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100">
                {lead.followUpStatus === 'Completed' ? (
                  <button
                    onClick={() => handleUpdateStatus(lead._id, 'Scheduled')}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Re-open</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(lead._id, 'Completed')}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Done</span>
                  </button>
                )}

                <button
                  onClick={() => navigate(`/leads/${lead._id}`)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Follow-up Reminders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Never miss a prospect touchpoint or scheduled client conversation
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm self-start sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Scheduled ({counts.overdue + counts.today + counts.upcoming})
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overdue' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-600 hover:bg-rose-50'
            }`}
          >
            Overdue ({counts.overdue})
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'today' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-600 hover:bg-amber-50'
            }`}
          >
            Today ({counts.today})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'upcoming' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            Upcoming ({counts.upcoming})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'completed' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            Completed ({counts.completed})
          </button>
        </div>
      </div>

      {/* Content Rendering based on Tab */}
      {counts.overdue + counts.today + counts.upcoming + counts.completed === 0 ? (
        <div className="crm-card p-12 text-center max-w-xl mx-auto my-6">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CalendarClock className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            All Follow-ups Up To Date (0 Scheduled)
          </h2>
          <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            There are currently no overdue, today's, or upcoming client touchpoints scheduled. You can assign follow-up dates when creating leads or inside any lead details page.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => navigate('/leads')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl shadow-md transition-all"
            >
              <User className="w-3.5 h-3.5 text-rose-400" />
              <span>Browse All Leads</span>
            </button>
            <a
              href="/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all"
            >
              Open Contact Form
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {(activeTab === 'all' || activeTab === 'overdue') && overdue.length > 0 && (
            renderSection(
              'Overdue Follow-ups',
              overdue,
              'bg-rose-100 text-rose-700',
              <AlertCircle className="w-4 h-4 text-rose-500" />
            )
          )}

          {activeTab === 'overdue' && overdue.length === 0 && (
            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 text-center max-w-md mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-900">Zero Overdue Follow-ups</h4>
              <p className="text-xs text-slate-500 mt-1">
                Outstanding! All client communications are currently on track.
              </p>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'today') && today.length > 0 && (
            renderSection(
              "Today's Follow-ups",
              today,
              'bg-amber-100 text-amber-700',
              <Clock className="w-4 h-4 text-amber-500" />
            )
          )}

          {activeTab === 'today' && today.length === 0 && (
            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 text-center max-w-md mx-auto">
              <Calendar className="w-10 h-10 text-amber-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-900">No Follow-ups Scheduled for Today</h4>
              <p className="text-xs text-slate-500 mt-1">
                You're all clear for today. Check upcoming tasks or view your lead pipeline.
              </p>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'upcoming') && upcoming.length > 0 && (
            renderSection(
              'Upcoming Follow-ups',
              upcoming,
              'bg-blue-100 text-blue-700',
              <Calendar className="w-4 h-4 text-blue-500" />
            )
          )}

          {activeTab === 'upcoming' && upcoming.length === 0 && (
            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 text-center max-w-md mx-auto">
              <Calendar className="w-10 h-10 text-blue-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-900">No Upcoming Follow-ups</h4>
              <p className="text-xs text-slate-500 mt-1">
                Schedule future calls or check-ins with prospects from the leads page.
              </p>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'completed') && completed.length > 0 && (
            renderSection(
              'Recently Completed',
              completed,
              'bg-emerald-100 text-emerald-700',
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            )
          )}

          {activeTab === 'completed' && completed.length === 0 && (
            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 text-center max-w-md mx-auto">
              <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-900">No Completed Follow-ups Yet</h4>
              <p className="text-xs text-slate-500 mt-1">
                When you click "Mark Done" on a scheduled follow-up, it will show up here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FollowUps;

