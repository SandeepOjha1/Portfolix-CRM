import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  ArrowUpDown,
  Building2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  X,
  FileSpreadsheet,
  Users,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import LeadModal from '../components/LeadModal';
import DeleteModal from '../components/DeleteModal';

const Leads = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Filters & Sorting
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals state
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  // Active filter tab
  const [activeTab, setActiveTab] = useState('All Leads');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        sortBy,
        sortOrder,
      };

      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'All') params.status = statusFilter;
      if (sourceFilter !== 'All') params.source = sourceFilter;
      if (priorityFilter !== 'All') params.priority = priorityFilter;

      const res = await api.get('/leads', { params });
      if (res.data.success) {
        setLeads(res.data.leads);
        setTotalLeads(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      addToast('Failed to fetch leads', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, statusFilter, sourceFilter, priorityFilter, sortBy, sortOrder, addToast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Synchronize URL search params
  const handleSearchChange = (val) => {
    setSearch(val);
    setCurrentPage(1);
    if (val) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  };

  // Quick Inline Status Update
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await api.put(`/leads/${leadId}`, { status: newStatus });
      addToast(`Status updated to "${newStatus}"`, 'success');
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      addToast('Failed to update lead status', 'error');
    }
  };

  // Delete Lead Handler
  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;
    try {
      await api.delete(`/leads/${leadToDelete._id}`);
      addToast('Lead deleted successfully', 'success');
      fetchLeads();
    } catch (err) {
      console.error('Failed to delete lead:', err);
      addToast('Failed to delete lead', 'error');
    }
  };

  // CSV Export
  const handleExportCSV = async () => {
    try {
      const response = await api.get('/leads/export/csv', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      addToast('Leads CSV exported successfully', 'success');
    } catch (err) {
      console.error('CSV export failed:', err);
      addToast('Failed to export leads', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-sky-50 text-sky-700 border-sky-200/80';
      case 'Contacted':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Qualified':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      case 'Converted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Lost':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const isFollowUpOverdue = (date, status) => {
    if (!date || status === 'Converted' || status === 'Lost') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) < today;
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-navigation (Matching Image 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              CRM Table
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white shadow-sm">
              Live DB
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage, qualify, and convert prospective client inquiries
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm self-start sm:self-auto">
          {['My Leads', 'All Leads', 'Converted'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'Converted') setStatusFilter('Converted');
                else setStatusFilter('All');
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Pills Toolbar & Action Row (Matching Image 2) */}
      <div className="crm-card p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Leads count badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-slate-900">
              Total leads ({totalLeads})
            </span>
            {(statusFilter !== 'All' || sourceFilter !== 'All' || priorityFilter !== 'All' || search) && (
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setSourceFilter('All');
                  setPriorityFilter('All');
                  setSearch('');
                  setCurrentPage(1);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full transition-colors"
              >
                <X className="w-3 h-3" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Action buttons: Export CSV & Add Lead */}
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200/60"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download CSV</span>
            </button>

            <button
              onClick={() => {
                setEditingLead(null);
                setLeadModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4 text-rose-500" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* Filter Pills Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100">
          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full h-9 pl-8 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Sort By Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer text-xs"
            >
              <option value="createdAt">Date Created</option>
              <option value="name">Lead Name</option>
              <option value="company">Company</option>
              <option value="priority">Priority</option>
              <option value="score">Score</option>
              <option value="dealValue">Deal Value</option>
            </select>
          </div>

          {/* Sort Direction Toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title="Toggle sort direction"
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent focus:outline-none cursor-pointer text-xs font-bold text-slate-800"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          {/* Source Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700">
            <span className="text-slate-400">Source:</span>
            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent focus:outline-none cursor-pointer text-xs font-bold text-slate-800"
            >
              <option value="All">All Sources</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Social Media">Social Media</option>
              <option value="Advertisement">Advertisement</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700">
            <span className="text-slate-400">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent focus:outline-none cursor-pointer text-xs font-bold text-slate-800"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* CRM Leads Table (Matching Image 2) */}
      <div className="crm-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-0" />
                </th>
                <th className="py-3.5 px-4">Name & Contact</th>
                <th className="py-3.5 px-4">Company</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Score</th>
                <th className="py-3.5 px-4">Follow-up</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-2" />
                      <span>Loading lead records...</span>
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                        <Users className="w-7 h-7 text-indigo-500" />
                      </div>
                      <h3 className="text-base font-bold text-slate-800 mb-1">
                        {search || statusFilter !== 'All' || sourceFilter !== 'All' || priorityFilter !== 'All'
                          ? 'No Matching Leads Found'
                          : 'No Leads in Pipeline Yet (0 Leads)'}
                      </h3>
                      <p className="text-xs text-slate-500 mb-5 max-w-sm leading-relaxed">
                        {search || statusFilter !== 'All' || sourceFilter !== 'All' || priorityFilter !== 'All'
                          ? 'No clients match your filter criteria. Try resetting your search or filter values.'
                          : 'Get started by creating your first client lead manually or submitting an inquiry via the website contact form.'}
                      </p>
                      {search || statusFilter !== 'All' || sourceFilter !== 'All' || priorityFilter !== 'All' ? (
                        <button
                          onClick={() => {
                            setSearch('');
                            setStatusFilter('All');
                            setSourceFilter('All');
                            setPriorityFilter('All');
                            setCurrentPage(1);
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-md hover:bg-black transition-all"
                        >
                          Reset All Filters
                        </button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setEditingLead(null);
                              setLeadModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl shadow-md transition-all"
                          >
                            <Plus className="w-4 h-4 text-rose-500" />
                            <span>Add First Lead</span>
                          </button>
                          <a
                            href="/contact"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all"
                          >
                            Open Contact Form
                          </a>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const overdue = isFollowUpOverdue(lead.followUpDate, lead.status);
                  const initials = lead.name
                    ? lead.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()
                    : 'CL';

                  return (
                    <tr
                      key={lead._id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={(e) => {
                        // Prevent navigation if clicking on select, button, or checkbox
                        if (['SELECT', 'BUTTON', 'INPUT', 'SVG', 'PATH'].includes(e.target.tagName)) {
                          return;
                        }
                        navigate(`/leads/${lead._id}`);
                      }}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded text-indigo-600 focus:ring-0" />
                      </td>

                      {/* Name & Title/Email (Matching Image 2 avatar styling) */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-1 ring-slate-200 shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                              {lead.name}
                            </p>
                            <p className="text-[11px] text-slate-400 font-normal">
                              {lead.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-semibold text-slate-800">
                            {lead.company || 'Individual'}
                          </span>
                        </div>
                      </td>

                      {/* Source */}
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {lead.source}
                        </span>
                      </td>

                      {/* Status Pill with interactive quick selector (Matching Image 2 dropdowns) */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full border text-[11px] font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${getStatusBadge(
                            lead.status
                          )}`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Converted">Converted</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </td>

                      {/* Qualification Score (Matching Image 2: 4.5/5) */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">
                            {((lead.score || 75) / 20).toFixed(1)}/5
                          </span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              (lead.score || 75) >= 80
                                ? 'bg-emerald-500'
                                : (lead.score || 75) >= 60
                                ? 'bg-amber-500'
                                : 'bg-slate-300'
                            }`}
                          />
                        </div>
                      </td>

                      {/* Follow-up Date */}
                      <td className="py-3 px-4">
                        {lead.followUpDate ? (
                          <div
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-semibold ${
                              overdue
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(lead.followUpDate).toLocaleDateString()}</span>
                            {overdue && <span className="text-[10px] font-extrabold uppercase text-rose-600">Overdue</span>}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">None</span>
                        )}
                      </td>

                      {/* Actions Column (Matching Image 2 action icons) */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/leads/${lead._id}`)}
                            title="Inspect Lead & Activity"
                            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setEditingLead(lead);
                              setLeadModalOpen(true);
                            }}
                            title="Edit Lead"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setLeadToDelete(lead);
                              setDeleteModalOpen(true);
                            }}
                            title="Delete Lead"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls (Matching Image 2) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900">{leads.length}</strong> leads of{' '}
            <strong className="text-slate-900">{totalLeads}</strong>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-8 h-8 rounded-xl font-bold text-xs transition-all ${
                  currentPage === pg
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors shadow-sm"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Lead Modal */}
      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        lead={editingLead}
        onSuccess={fetchLeads}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        leadName={leadToDelete?.name}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Leads;

