import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Target,
  DollarSign,
  PieChart as PieIcon,
  Layers,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import api from '../services/api';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500 mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading comprehensive insights...</p>
      </div>
    );
  }

  const { stats, statusDistribution, sourceDistribution, monthlyTrends, conversionSplit } = data;

  const funnelStages = [
    { stage: 'Total Inquiries', count: stats.totalLeads, color: '#38BDF8', pct: '100%' },
    { stage: 'Contacted', count: stats.contactedLeads + stats.qualifiedLeads + stats.convertedLeads, color: '#F59E0B', pct: stats.totalLeads ? `${Math.round(((stats.contactedLeads + stats.qualifiedLeads + stats.convertedLeads) / stats.totalLeads) * 100)}%` : '0%' },
    { stage: 'Qualified Pipeline', count: stats.qualifiedLeads + stats.convertedLeads, color: '#8B5CF6', pct: stats.totalLeads ? `${Math.round(((stats.qualifiedLeads + stats.convertedLeads) / stats.totalLeads) * 100)}%` : '0%' },
    { stage: 'Converted Wins', count: stats.convertedLeads, color: '#10B981', pct: `${stats.conversionRate}%` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Executive Insights & Funnel
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Detailed metrics and channel attribution for sales performance
        </p>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="crm-card p-5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Pipeline Value
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            ${(stats.totalPipelineValue || 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">Estimated contract volume</p>
        </div>

        <div className="crm-card p-5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Closed Revenue
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
            ${(stats.convertedPipelineValue || 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">From won opportunities</p>
        </div>

        <div className="crm-card p-5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Lead-to-Win Rate
          </span>
          <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">
            {stats.conversionRate}%
          </p>
          <p className="text-xs text-slate-500 mt-1">Overall conversion efficiency</p>
        </div>

        <div className="crm-card p-5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Pipeline Leads
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {stats.newLeads + stats.contactedLeads + stats.qualifiedLeads}
          </p>
          <p className="text-xs text-slate-500 mt-1">In progress deals</p>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="crm-card p-6">
        <h2 className="text-base font-bold text-slate-900 mb-1">Lead Conversion Funnel</h2>
        <p className="text-xs text-slate-500 mb-6">Drop-off and progression across deal stages</p>

        <div className="space-y-4 max-w-2xl mx-auto">
          {funnelStages.map((f, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">{f.stage}</span>
                <span className="font-mono font-semibold text-slate-600">
                  {f.count} leads ({f.pct})
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: f.color,
                    width: f.pct,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of In-depth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Generation Bar Chart */}
        <div className="crm-card p-6">
          <h2 className="text-base font-bold text-slate-900 mb-1">
            Monthly Performance Comparison
          </h2>
          <p className="text-xs text-slate-500 mb-4">Total inquiries vs. customer conversions</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Legend />
                <Bar dataKey="total" name="Total Inquiries" fill="#0F172A" radius={[6, 6, 0, 0]} />
                <Bar dataKey="conversions" name="Conversions" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Breakdown Pie */}
        <div className="crm-card p-6">
          <h2 className="text-base font-bold text-slate-900 mb-1">Acquisition by Channel</h2>
          <p className="text-xs text-slate-500 mb-4">Volume breakdown by lead origin</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {sourceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

