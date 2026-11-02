import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  Clock,
  UserCheck,
  ArrowUpRight,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ChevronRight,
  Loader2,
  Plus,
  Send,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import LeadModal from '../components/LeadModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [leadModalOpen, setLeadModalOpen] = useState(false);

  const [data, setData] = useState({
    stats: {
      totalLeads: 0,
      newLeads: 0,
      contactedLeads: 0,
      qualifiedLeads: 0,
      convertedLeads: 0,
      lostLeads: 0,
      conversionRate: 0,
      totalPipelineValue: 0,
      followUps: { overdue: 0, today: 0, upcoming: 0 },
    },
    statusDistribution: [],
    sourceDistribution: [],
    monthlyTrends: [],
    conversionSplit: [],
    recentLeads: [],
  });

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500 mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading live analytics...</p>
      </div>
    );
  }

  const { stats, statusDistribution, sourceDistribution, monthlyTrends, conversionSplit, recentLeads } = data;

  const statusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Contacted':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Qualified':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Converted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Lost':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Safe Gauge percentage calculation
  const targetDenominator = Math.max(stats.totalLeads, 10);
  const gaugePercent = stats.totalLeads > 0 ? (stats.convertedLeads / targetDenominator) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Analytics
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live DB
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time pipeline performance and lead acquisition overview
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Test Public Form link */}
          <button
            onClick={() => window.open('/contact', '_blank')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
          >
            <Send className="w-3.5 h-3.5 text-sky-500" />
            <span>Open Contact Form</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </button>

          {/* Add Lead Primary CTA */}
          <button
            onClick={() => setLeadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4 text-rose-500" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Row (100% Dynamic from actual MongoDB records) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Month Target / Gauge Card */}
        <div className="crm-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Target
            </span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                stats.totalLeads > 0
                  ? 'text-rose-500 bg-rose-50'
                  : 'text-slate-500 bg-slate-100'
              }`}
            >
              {stats.totalLeads > 0 ? 'Live' : '0 Leads'}
            </span>
          </div>

          <div className="my-3 text-center">
            {/* Semicircle Gauge representation */}
            <div className="relative w-28 h-14 mx-auto overflow-hidden">
              <div
                className={`w-28 h-28 border-[10px] rounded-full rotate-[-45deg] transition-all duration-700 ${
                  gaugePercent > 0
                    ? 'border-slate-100 border-t-rose-500 border-r-rose-400'
                    : 'border-slate-100'
                }`}
              />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {stats.convertedLeads} / {stats.totalLeads > 0 ? targetDenominator : 0}
            </p>
            <p className="text-[11px] font-semibold text-slate-400">Month conversions</p>
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-xs font-semibold text-slate-700">
              <span className="font-extrabold text-slate-900">{stats.conversionRate}%</span> Avg conversion rate
            </p>
          </div>
        </div>

        {/* Metric 2: Total Leads */}
        <div className="crm-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Leads
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                stats.totalLeads > 0
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-500 bg-slate-100'
              }`}
            >
              {stats.totalLeads > 0 ? (
                <>
                  <TrendingUp className="w-3 h-3" />
                  Live
                </>
              ) : (
                '0%'
              )}
            </span>
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-slate-900">{stats.totalLeads}</p>
            <p className="text-xs text-slate-500 mt-1">Total inquiries logged</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-slate-900 h-full rounded-full transition-all duration-500"
              style={{ width: stats.totalLeads > 0 ? '100%' : '0%' }}
            />
          </div>
        </div>

        {/* Metric 3: Conversions */}
        <div className="crm-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Conversions
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                stats.convertedLeads > 0
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-slate-500 bg-slate-100'
              }`}
            >
              {stats.convertedLeads > 0 ? `+${stats.conversionRate}%` : '0%'}
            </span>
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-slate-900">{stats.convertedLeads}</p>
            <p className="text-xs text-slate-500 mt-1">Won client contracts</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{
                width: stats.totalLeads > 0 ? `${(stats.convertedLeads / stats.totalLeads) * 100}%` : '0%',
              }}
            />
          </div>
        </div>

        {/* Metric 4: Qualified Leads */}
        <div className="crm-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Qualified Leads
            </span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                stats.qualifiedLeads > 0
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-slate-500 bg-slate-100'
              }`}
            >
              {stats.qualifiedLeads > 0 ? 'Pipeline' : '0'}
            </span>
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-slate-900">{stats.qualifiedLeads}</p>
            <p className="text-xs text-slate-500 mt-1">High purchase intent</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{
                width: stats.totalLeads > 0 ? `${(stats.qualifiedLeads / stats.totalLeads) * 100}%` : '0%',
              }}
            />
          </div>
        </div>

        {/* Metric 5: Not yet contacted / New */}
        <div className="crm-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Not Contacted
            </span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                stats.newLeads > 0
                  ? 'text-sky-600 bg-sky-50'
                  : 'text-slate-500 bg-slate-100'
              }`}
            >
              {stats.newLeads > 0 ? 'Needs Action' : '0'}
            </span>
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-slate-900">{stats.newLeads}</p>
            <p className="text-xs text-slate-500 mt-1">Awaiting admin reply</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{
                width: stats.totalLeads > 0 ? `${(stats.newLeads / stats.totalLeads) * 100}%` : '0%',
              }}
            />
          </div>
        </div>
      </div>

      {/* Middle Row: Conversion Split & Ad Source Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Conversion Split Progress Bars */}
        <div className="lg:col-span-2 crm-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Conversion split</h2>
              <p className="text-xs text-slate-500">Lead qualification across core project service sectors</p>
            </div>
            <Info className="w-4 h-4 text-slate-400" />
          </div>

          {conversionSplit.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {conversionSplit.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">{item.subject}</span>
                    <span className="text-xs font-mono font-semibold text-slate-500">
                      {item.converted} of {item.total}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        idx === 0
                          ? 'bg-rose-500'
                          : idx === 1
                          ? 'bg-rose-400'
                          : idx === 2
                          ? 'bg-rose-300'
                          : 'bg-slate-700'
                      }`}
                      style={{ width: `${Math.max(10, item.percentage)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400">
                    <span>Conversion</span>
                    <span className="font-semibold text-slate-700">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
              <p className="text-xs font-bold text-slate-700 mb-1">No Conversion Split Data Yet (0 Leads)</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                When you create leads or receive website contact submissions, their service categories and conversion ratios will automatically compute here.
              </p>
              <button
                onClick={() => setLeadModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-black transition-colors"
              >
                + Add First Lead
              </button>
            </div>
          )}

          {/* Area Chart for Monthly Growth Trend */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Lead Volume Trend (Past 6 Months)
              </span>
              <span className="text-xs text-slate-500">Total vs Conversions</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrends}>
                  <defs>
                    <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F172A" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0F172A" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    name="Total Leads"
                    stroke="#0F172A"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#leadGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="conversions"
                    name="Conversions"
                    stroke="#F43F5E"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#convGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Ad Source Distribution */}
        <div className="crm-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Ad Source Distribution</h2>
                <p className="text-xs text-slate-500">Customer acquisition channels</p>
              </div>
            </div>

            <div className="h-48 relative">
              {stats.totalLeads > 0 && sourceDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="count"
                    >
                      {sourceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name, props) => [`${val} leads (${props.payload.percentage}%)`, name]}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                        border: 'none',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-slate-900">0</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Leads</span>
                  </div>
                </div>
              )}

              {/* Centered Total Indicator when > 0 */}
              {stats.totalLeads > 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-slate-900">{stats.totalLeads}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Leads</span>
                </div>
              )}
            </div>

            {/* Source legend with percentages */}
            <div className="mt-4 space-y-2.5">
              {sourceDistribution.length > 0 ? (
                sourceDistribution.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-semibold text-slate-700">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px] font-mono">{item.count} leads</span>
                      <span className="font-bold text-slate-900 w-8 text-right">{item.percentage}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-xs text-slate-400 py-2">
                  No source channels recorded yet (0 leads)
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Primary channel:</span>
            <span className="font-bold text-indigo-600">
              {sourceDistribution[0]?.name
                ? `${sourceDistribution[0].name} (${sourceDistribution[0].percentage}%)`
                : 'None yet (0%)'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Monthly Sales Table & Customer Report */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Sales Table */}
        <div className="lg:col-span-2 crm-card p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Monthly sales table</h2>
              <p className="text-xs text-slate-500">Actual database records aggregated per month</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">Month</th>
                  <th className="py-3 px-3 text-right">Total leads</th>
                  <th className="py-3 px-3 text-right">Not contacted</th>
                  <th className="py-3 px-3 text-right">Conversions</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {monthlyTrends.map((m, idx) => {
                  const winRate = m.total > 0 ? Math.round((m.conversions / m.total) * 100) : 0;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900">{m.month}</td>
                      <td className="py-3 px-3 text-right font-mono">{m.total}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">
                        {Math.max(0, m.total - m.contacted)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {m.conversions}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {m.total > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {winRate}% Win
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-mono">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Customer Report Gauges */}
        <div className="crm-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Customer report</h2>
                <p className="text-xs text-slate-500">Lead distribution ratio</p>
              </div>
            </div>

            {/* 3 circular indicators: New, Contacted, Converted */}
            <div className="grid grid-cols-3 gap-2 text-center py-4">
              {/* New */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-xs text-slate-800 rotate-45 transition-colors ${
                    stats.newLeads > 0
                      ? 'border-slate-100 border-t-rose-500 border-r-rose-400'
                      : 'border-slate-100'
                  }`}
                >
                  <span className="-rotate-45">{stats.newLeads}</span>
                </div>
                <span className="text-[11px] font-bold text-slate-700 mt-2">New</span>
                <span className="text-[10px] text-slate-400">Awaiting</span>
              </div>

              {/* Contacted */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-xs text-slate-800 rotate-12 transition-colors ${
                    stats.contactedLeads > 0
                      ? 'border-slate-100 border-t-amber-500 border-r-amber-400'
                      : 'border-slate-100'
                  }`}
                >
                  <span className="-rotate-12">{stats.contactedLeads}</span>
                </div>
                <span className="text-[11px] font-bold text-slate-700 mt-2">Contacted</span>
                <span className="text-[10px] text-slate-400">In Touch</span>
              </div>

              {/* Converted */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-xs text-slate-800 rotate-90 transition-colors ${
                    stats.convertedLeads > 0
                      ? 'border-slate-100 border-t-emerald-500 border-r-emerald-400'
                      : 'border-slate-100'
                  }`}
                >
                  <span className="-rotate-90">{stats.convertedLeads}</span>
                </div>
                <span className="text-[11px] font-bold text-slate-700 mt-2">Converted</span>
                <span className="text-[10px] text-slate-400">Closed</span>
              </div>
            </div>
          </div>

          {/* Follow-up Alert Box */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-200">Scheduled Follow-ups</p>
              <p className="text-[11px] text-slate-400">
                {stats.followUps?.overdue > 0
                  ? `${stats.followUps.overdue} overdue follow-up(s)`
                  : stats.followUps?.today > 0
                  ? `${stats.followUps.today} scheduled today`
                  : 'No pending follow-ups'}
              </p>
            </div>
            <button
              onClick={() => navigate('/followups')}
              className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold transition-colors"
            >
              Manage
            </button>
          </div>
        </div>
      </div>

      {/* Recent Leads Quick Section */}
      <div className="crm-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Leads</h2>
            <p className="text-xs text-slate-500">Live database inquiries</p>
          </div>
          <button
            onClick={() => navigate('/leads')}
            className="text-xs font-bold text-slate-800 hover:text-rose-600 flex items-center gap-1"
          >
            <span>View CRM Table</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">Lead / Client</th>
                  <th className="py-3 px-3">Company</th>
                  <th className="py-3 px-3">Source</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      <div>
                        <p>{lead.name}</p>
                        <p className="text-[11px] text-slate-400 font-normal">{lead.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {lead.company || '—'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {lead.source}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${statusBadge(
                          lead.status
                        )}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[11px] font-semibold ${
                          lead.priority === 'High'
                            ? 'text-rose-600'
                            : lead.priority === 'Medium'
                            ? 'text-amber-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {lead.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => navigate(`/leads/${lead._id}`)}
                        className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
            <p className="text-xs font-bold text-slate-800 mb-1">
              Database is clean — 0 leads recorded
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Add your first lead using the button below or submit an inquiry via the website contact form to watch the metrics reflect in real time.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setLeadModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-black transition-colors"
              >
                + Add First Lead
              </button>
              <button
                onClick={() => window.open('/contact', '_blank')}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Open Contact Form ↗
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        onSuccess={fetchStats}
      />
    </div>
  );
};

export default Dashboard;
