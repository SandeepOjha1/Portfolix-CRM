import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Building2,
  Mail,
  Phone,
  Calendar,
  Clock,
  User,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  MessageSquare,
  Send,
  MoreVertical,
  DollarSign,
  Briefcase,
  AlertCircle,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import ActivityLogModal from '../components/ActivityLogModal';
import LeadModal from '../components/LeadModal';
import DeleteModal from '../components/DeleteModal';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // New Note state
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');

  const fetchLeadData = useCallback(async () => {
    try {
      const res = await api.get(`/leads/${id}`);
      if (res.data.success) {
        setLead(res.data.lead);
        setActivities(res.data.activities || []);
      }
    } catch (err) {
      console.error('Error loading lead details:', err);
      addToast('Failed to load lead details', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, addToast]);

  useEffect(() => {
    fetchLeadData();
  }, [fetchLeadData]);

  // Update Status directly
  const handleQuickStatusChange = async (newStatus) => {
    try {
      const res = await api.put(`/leads/${id}`, { status: newStatus });
      if (res.data.success) {
        setLead(res.data.lead);
        addToast(`Lead status updated to "${newStatus}"`, 'success');
        fetchLeadData(); // Refresh activity log
      }
    } catch (err) {
      console.error('Failed to change status:', err);
      addToast('Could not update status', 'error');
    }
  };

  // Add Note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmittingNote(true);
    try {
      const res = await api.post(`/leads/${id}/notes`, { content: newNote.trim() });
      if (res.data.success) {
        setLead((prev) => ({ ...prev, notes: res.data.notes }));
        setNewNote('');
        addToast('Internal note saved', 'success');
        fetchLeadData(); // Refresh activities
      }
    } catch (err) {
      console.error('Failed to add note:', err);
      addToast('Failed to save note', 'error');
    } finally {
      setSubmittingNote(false);
    }
  };

  // Delete Note
  const handleDeleteNote = async (noteId) => {
    try {
      const res = await api.delete(`/leads/${id}/notes/${noteId}`);
      if (res.data.success) {
        setLead((prev) => ({ ...prev, notes: res.data.notes }));
        addToast('Note deleted', 'success');
        fetchLeadData();
      }
    } catch (err) {
      console.error('Failed to delete note:', err);
      addToast('Failed to delete note', 'error');
    }
  };

  // Edit Note
  const handleSaveEditNote = async (noteId) => {
    if (!editingNoteContent.trim()) return;
    try {
      const res = await api.put(`/leads/${id}/notes/${noteId}`, { content: editingNoteContent.trim() });
      if (res.data.success) {
        setLead((prev) => ({ ...prev, notes: res.data.notes }));
        setEditingNoteId(null);
        addToast('Note updated', 'success');
      }
    } catch (err) {
      console.error('Failed to update note:', err);
      addToast('Failed to update note', 'error');
    }
  };

  // Delete Lead
  const handleDeleteLead = async () => {
    try {
      await api.delete(`/leads/${id}`);
      addToast('Lead deleted successfully', 'success');
      navigate('/leads');
    } catch (err) {
      console.error('Failed to delete lead:', err);
      addToast('Failed to delete lead', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500 mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading lead profile...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-bold text-slate-800">Lead Not Found</h2>
        <p className="text-xs text-slate-500 mb-4">The requested lead could not be located.</p>
        <button
          onClick={() => navigate('/leads')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
        >
          Back to Leads
        </button>
      </div>
    );
  }

  const initials = lead.company
    ? lead.company.slice(0, 2).toUpperCase()
    : lead.name.slice(0, 2).toUpperCase();

  const getActivityIcon = (type) => {
    switch (type) {
      case 'call':
        return <Phone className="w-4 h-4 text-emerald-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-amber-600" />;
      case 'followup':
        return <Clock className="w-4 h-4 text-rose-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
    }
  };

  const getActivityNodeColor = (type) => {
    switch (type) {
      case 'call':
        return 'bg-emerald-50 border-emerald-200 text-emerald-600';
      case 'email':
        return 'bg-blue-50 border-blue-200 text-blue-600';
      case 'meeting':
        return 'bg-amber-50 border-amber-200 text-amber-600';
      case 'followup':
        return 'bg-rose-50 border-rose-200 text-rose-600';
      default:
        return 'bg-purple-50 border-purple-200 text-purple-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/leads" className="hover:text-slate-900 flex items-center gap-1 font-semibold">
            <ChevronLeft className="w-4 h-4" />
            <span>All Leads</span>
          </Link>
          <span>/</span>
          <span className="font-bold text-slate-900">{lead.name}</span>
          <span className="text-slate-400">({lead.company || 'Individual'})</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-sm"
          >
            <Edit className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Info</span>
          </button>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Column (Activity Timeline & Notes) + Right Column (Lead Overview Card) (Matching Image 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Activity Timeline & Notes */}
        <div className="lg:col-span-7 space-y-6">
          {/* Activity Timeline Card (Matching Image 3) */}
          <div className="crm-card p-6">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Activity Timeline
                </h2>
                <p className="text-xs text-slate-500">
                  Track client engagement, touchpoints, and scheduled meetings
                </p>
              </div>

              {/* Log Activity Button (Matching Image 3) */}
              <button
                onClick={() => setLogModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Log Activity</span>
              </button>
            </div>

            {/* Timeline Stream */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200/80">
              {activities.length > 0 ? (
                activities.map((act) => (
                  <div key={act._id} className="relative group">
                    {/* Circle Node Icon */}
                    <div
                      className={`absolute -left-6 top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white shadow-sm ring-4 ring-[#F6F8FA] ${getActivityNodeColor(
                        act.type
                      )}`}
                    >
                      {getActivityIcon(act.type)}
                    </div>

                    {/* Timeline Content Box (Styled like Image 3) */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{act.action}</span>
                          {act.metadata?.completed && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700">
                              Completed
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {new Date(act.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          · {new Date(act.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{act.description}</p>

                      {/* Meeting / Call Metadata if present */}
                      {(act.metadata?.duration || act.metadata?.participants) && (
                        <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                          {act.metadata.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{act.metadata.duration}</span>
                            </div>
                          )}
                          {act.metadata.participants && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-400" />
                              <span>{act.metadata.participants}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-400">
                  No logged activities yet. Click "+ Log Activity" to record a call or meeting.
                </div>
              )}
            </div>
          </div>

          {/* Internal Notes Card */}
          <div className="crm-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Internal Team Notes</h3>
                <p className="text-xs text-slate-500">Private admin observations & updates</p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                {lead.notes?.length || 0}
              </span>
            </div>

            {/* Add note textarea */}
            <form onSubmit={handleAddNote} className="mb-5">
              <div className="relative">
                <textarea
                  rows={2}
                  required
                  placeholder="Write a note about this lead..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                />
                <button
                  type="submit"
                  disabled={submittingNote || !newNote.trim()}
                  className="absolute right-2.5 bottom-3 px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow-sm transition-all disabled:opacity-40"
                >
                  {submittingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Post Note'}
                </button>
              </div>
            </form>

            {/* Notes List */}
            <div className="space-y-3">
              {lead.notes && lead.notes.length > 0 ? (
                lead.notes.map((note) => (
                  <div
                    key={note._id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                  >
                    {editingNoteId === note._id ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={editingNoteContent}
                          onChange={(e) => setEditingNoteContent(e.target.value)}
                          className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingNoteId(null)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-200 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEditNote(note._id)}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-slate-900 rounded-lg"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">
                              {note.createdBy || 'Admin'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(note.createdAt).toLocaleDateString()} at{' '}
                              {new Date(note.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingNoteId(note._id);
                                setEditingNoteContent(note.content);
                              }}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note._id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {note.content}
                        </p>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-xs text-slate-400">
                  No internal notes recorded yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Lead Overview Card (Matching Image 3 exact card layout!) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="crm-card p-6 shadow-lg border border-slate-200/80">
            {/* Header: Avatar, Company & Subtitle (Matching Image 3) */}
            <div className="flex items-start justify-between pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-500/20">
                  {initials}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    {lead.company || lead.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400">
                    {lead.company ? 'Enterprise Account' : 'Direct Client'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Status & Priority Toggles */}
            <div className="py-4 border-b border-slate-100 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Status
                </label>
                <select
                  value={lead.status}
                  onChange={(e) => handleQuickStatusChange(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Priority
                </label>
                <div className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800">
                  {lead.priority} Priority
                </div>
              </div>
            </div>

            {/* Lead Properties Grid (Matching Image 3 metadata fields) */}
            <div className="py-4 border-b border-slate-100 space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Lead Source</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                  {lead.source}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Account Owner</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                    RE
                  </span>
                  <span className="font-bold text-slate-800">{lead.assignedTo || 'Ryan Ellis'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Lifecycle Stage</span>
                <span className="font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                  {lead.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Follow-up Date</span>
                <span className="font-mono font-semibold text-slate-800">
                  {lead.followUpDate
                    ? new Date(lead.followUpDate).toLocaleDateString()
                    : 'Not scheduled'}
                </span>
              </div>

              {/* Deal Size & Probability Bar (Matching Image 3) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-400">Deal Size</span>
                  <span className="text-base font-black text-slate-900">
                    ${(lead.dealValue || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>Win Probability</span>
                  <span className="font-bold text-emerald-600">{lead.score || 75}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${lead.score || 75}%` }}
                  />
                </div>
              </div>
            </div>

            {/* About / Message Section (Matching Image 3) */}
            <div className="py-4 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                About & Client Message
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {lead.message || 'No additional message was provided with this lead.'}
              </p>
            </div>

            {/* Related Contact Card (Matching Image 3) */}
            <div className="pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Primary Contact
              </h4>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                    {lead.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{lead.name}</p>
                    <p className="text-[11px] text-slate-500">{lead.company || 'Contact Person'}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 space-y-1.5 text-xs">
                  <a
                    href={`mailto:${lead.email}`}
                    className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lead.email}</span>
                  </a>
                  {lead.phone && (
                    <a
                      href={`tel:${lead.phone}`}
                      className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lead.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log Modal */}
      <ActivityLogModal
        isOpen={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        leadId={id}
        onSuccess={fetchLeadData}
      />

      {/* Edit Lead Modal */}
      <LeadModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        lead={lead}
        onSuccess={fetchLeadData}
      />

      {/* Delete Lead Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        leadName={lead.name}
        onConfirm={handleDeleteLead}
      />
    </div>
  );
};

export default LeadDetails;

