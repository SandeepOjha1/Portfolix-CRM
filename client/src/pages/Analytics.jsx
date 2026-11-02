import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Target,
  DollarSign,
  PieChart as PieIcon,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Users,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Activity,
  Zap,
  Sparkles,
  Filter,
  Clock,
  AlertTriangle,
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
import { Link } from 'react-router-dom';
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

  const {
    stats,
    statusDistribution,
    sourceDistribution,
    channelMetrics = [],
    monthlyTrends,
    conversionSplit,
  } = data;

  const total = stats.totalLeads || 0;
  const contactedStage = stats.contactedLeads + stats.qualifiedLeads + stats.convertedLeads;
  const qualifiedStage = stats.qualifiedLeads + stats.convertedLeads;
  const wonStage = stats.convertedLeads;

  // Funnel calculations with mathematically correct percentages and stage-over-stage retention
  const funnelStages = [
    {
      id: 'inquiries',
      stage: '1. Total Inquiries',
      subtext: 'Top of funnel client contacts',
      count: total,
      pctOfTotal: total > 0 ? 100 : 0,
      retentionRate: total > 0 ? 100 : 0,
      dropOffRate: 0,
      color: '#38BDF8',
      accentBg: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      id: 'contacted',
      stage: '2. Contacted & Engaged',
      subtext: 'Admin outreach completed',
      count: contactedStage,
      pctOfTotal: total > 0 ? Math.round((contactedStage / total) * 100) : 0,
      retentionRate: total > 0 ? Math.round((contactedStage / total) * 100) : 0,
      dropOffRate: total > 0 ? Math.max(0, 100 - Math.round((contactedStage / total) * 100)) : 0,
      color: '#F59E0B',
      accentBg: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'qualified',
      stage: '3. Qualified Pipeline',
      subtext: 'High purchase intent & budget verified',
      count: qualifiedStage,
      pctOfTotal: total > 0 ? Math.round((qualifiedStage / total) * 100) : 0,
      retentionRate: contactedStage > 0 ? Math.round((qualifiedStage / contactedStage) * 100) : 0,
      dropOffRate:
        contactedStage > 0 ? Math.max(0, 100 - Math.round((qualifiedStage / contactedStage) * 100)) : 0,
      color: '#8B5CF6',
      accentBg: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'converted',
      stage: '4. Closed Won Deals',
      subtext: 'Signed client contracts & won revenue',
      count: wonStage,
      pctOfTotal: total > 0 ? Math.round((wonStage / total) * 100) : 0,
      retentionRate: qualifiedStage > 0 ? Math.round((wonStage / qualifiedStage) * 100) : 0,
      dropOffRate:
        qualifiedStage > 0 ? Math.max(0, 100 - Math.round((wonStage / qualifiedStage) * 100)) : 0,
      color: '#10B981',
      accentBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  // Fallback channel performance if backend channelMetrics is empty
  const defaultSources = ['Website', 'Referral', 'Social Media', 'Advertisement', 'Other'];
  const channelData =
    channelMetrics.length > 0
      ? channelMetrics
      : defaultSources.map((src) => {
          const found = sourceDistribution.find((s) => s.name === src);
          return {
            source: src,
            total: found ? found.count : 0,
            contacted: 0,
            qualified: 0,
            converted: 0,
            lost: 0,
            revenue: 0,
            pipelineValue: 0,
            conversionRate: 0,
          };
        });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Executive Insights & Funnel
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live DB Analytics
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time pipeline health, stage-to-stage conversion efficiency, and channel attribution
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/leads"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all"
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>View All Leads</span>
          </Link>
          <Link
            to="/contact"
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl shadow-sm transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Contact Form</span>
          </Link>
        </div>
      </div>

      {/* 6 Executive KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Total Pipeline Value */}
        <div className="crm-card p-5 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Pipeline Value
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
            ${(stats.totalPipelineValue || 0).toLocaleString()}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
            <span>Estimated volume</span>
            <span className="text-blue-600 font-semibold">{total} leads</span>
          </div>
        </div>

        {/* Card 2: Closed Won Revenue */}
        <div className="crm-card p-5 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Closed Revenue
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2 font-mono">
            ${(stats.convertedPipelineValue || 0).toLocaleString()}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
            <span>Won contracts</span>
            <span className="text-emerald-600 font-semibold">{wonStage} won</span>
          </div>
        </div>

        {/* Card 3: Lead-to-Win Conversion Rate */}
        <div className="crm-card p-5 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Win Rate
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Target className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-indigo-600 mt-2 font-mono">
            {stats.conversionRate}%
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
            <span>Efficiency</span>
            <span className="text-indigo-600 font-semibold">
              {total > 0 ? `${wonStage}/${total}` : '0/0'}
            </span>
          </div>
        </div>

        {/* Card 4: Active In-Progress Leads */}
        <div className="crm-card p-5 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active Pipeline
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
            {stats.newLeads + stats.contactedLeads + stats.qualifiedLeads}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
            <span>Open deals</span>
            <span className="text-purple-600 font-semibold">{stats.newLeads} new</span>
          </div>
        </div>

        {/* Card 5: Average Deal Size */}
        <div className="crm-card p-5 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Avg Deal Size
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
            ${(stats.avgDealSize || 0).toLocaleString()}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
            <span>Per closed deal</span>
            <span className="text-amber-600 font-semibold">
              {stats.avgDealSize > 0 ? 'Verified' : 'N/A'}
            </span>
          </div>
        </div>

        {/* Card 6: Response & Outreach Health */}
        <div className="crm-card p-5 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Contact Rate
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 mt-2 font-mono">
            {stats.responseRate || 0}%
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
            <span>Outreach speed</span>
            <span className="text-rose-600 font-semibold">{contactedStage} touched</span>
          </div>
        </div>
      </div>

      {/* Modern Stepped Lead Conversion Funnel */}
      <div className="crm-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-6 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Lead Conversion Funnel & Stage Retention
            </h2>
            <p className="text-xs text-slate-500">
              Drop-off, retention rate, and deal volume progression from inquiry to won customer
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Inquiries
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Contacted
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Qualified
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Won
            </span>
          </div>
        </div>

        {total === 0 ? (
          /* Clean 0-State: Explains funnel dynamics gracefully without showing 100% false progress bar */
          <div className="py-10 px-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center max-w-xl mx-auto my-2">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Layers className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Pipeline Funnel is Ready (0 Leads Currently)
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
              When visitors submit the public contact form or when you manually create leads, stage-by-stage retention, drop-off rates, and deal values will dynamically render here in real-time.
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <Link
                to="/contact"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl shadow-sm transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Submit Test Lead via Form
              </Link>
            </div>
          </div>
        ) : (
          /* Dynamic Active Funnel with Stage Steppers and Drop-off pills */
          <div className="space-y-4 max-w-3xl mx-auto py-2">
            {funnelStages.map((stage, idx) => {
              const widthPct = Math.max(stage.pctOfTotal, 2); // Minimum 2% width so pill doesn't collapse
              return (
                <div
                  key={stage.id}
                  className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-slate-200 transition-all space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: stage.color }}
                      />
                      <span className="font-bold text-slate-900">{stage.stage}</span>
                      <span className="text-[11px] text-slate-400 hidden sm:inline">• {stage.subtext}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-900">
                        {stage.count} {stage.count === 1 ? 'lead' : 'leads'}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold"
                        style={{
                          backgroundColor: `${stage.color}15`,
                          color: stage.color,
                        }}
                      >
                        {stage.pctOfTotal}% of total
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        backgroundColor: stage.color,
                        width: `${widthPct}%`,
                      }}
                    />
                  </div>

                  {/* Stage Transition & Drop-off Context */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                    <span>
                      Stage retention:{' '}
                      <strong className="text-slate-800">{stage.retentionRate}%</strong>
                    </span>
                    {idx > 0 && stage.dropOffRate > 0 && (
                      <span className="text-rose-600 font-medium flex items-center gap-1">
                        <ArrowDownRight className="w-3 h-3" />
                        {stage.dropOffRate}% drop-off from previous step
                      </span>
                    )}
                    {idx === 0 && (
                      <span className="text-slate-400">Baseline inquiry intake (100%)</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Channel Attribution Matrix Table */}
      <div className="crm-card p-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              Channel Performance & Attribution Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Detailed breakdown of leads, progression, and revenue generated per acquisition source
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">
            {channelData.length} Channels Monitored
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pr-4 font-bold">Acquisition Channel</th>
                <th className="pb-3 px-4 font-bold text-center">Total Inquiries</th>
                <th className="pb-3 px-4 font-bold text-center">Contacted</th>
                <th className="pb-3 px-4 font-bold text-center">Qualified</th>
                <th className="pb-3 px-4 font-bold text-center">Won Deals</th>
                <th className="pb-3 px-4 font-bold text-center">Conversion Rate</th>
                <th className="pb-3 px-4 font-bold text-right">Revenue Generated</th>
                <th className="pb-3 pl-4 font-bold text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {channelData.map((ch, i) => {
                const colors = {
                  Website: '#6366F1',
                  Referral: '#F59E0B',
                  'Social Media': '#EC4899',
                  Advertisement: '#3B82F6',
                  Other: '#94A3B8',
                };
                const color = colors[ch.source] || '#64748B';

                return (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 pr-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span>{ch.source}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">
                      {ch.total}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-600">
                      {ch.contacted}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-600">
                      {ch.qualified}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600">
                      {ch.converted}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                          ch.conversionRate > 25
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : ch.conversionRate > 0
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {ch.conversionRate}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      ${(ch.revenue || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 pl-4 text-right">
                      {ch.converted > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <CheckCircle2 className="w-3 h-3" />
                          High ROI
                        </span>
                      ) : ch.total > 0 ? (
                        <span className="text-[11px] font-medium text-amber-600">Nurturing</span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-400">No Volume</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid of In-depth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Generation Bar Chart */}
        <div className="crm-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-slate-900">
                Monthly Performance Comparison
              </h2>
              <span className="text-xs text-slate-400">Past 6 Months</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Inquiry volume vs. closed client conversions across calendar months
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar
                  dataKey="total"
                  name="Inquiries Received"
                  fill="#0F172A"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="conversions"
                  name="Closed Conversions"
                  fill="#10B981"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Breakdown Pie */}
        <div className="crm-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-slate-900">Acquisition by Channel</h2>
              <span className="text-xs font-semibold text-slate-400">Channel Share</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">Volume breakdown by lead origin</p>

            {sourceDistribution.length > 0 && total > 0 ? (
              <>
                <div className="h-48 relative my-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="count"
                      >
                        {sourceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val, name, props) => [
                          `${val} leads (${props.payload.percentage}%)`,
                          name,
                        ]}
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

                  {/* Centered Total Indicator */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-900">{total}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Leads</span>
                  </div>
                </div>

                {/* Clean Channel Legend */}
                <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                  {sourceDistribution.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-semibold text-slate-800">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[11px] font-mono">
                          {item.count} lead{item.count !== 1 ? 's' : ''}
                        </span>
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-mono">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full border-4 border-dashed border-slate-200 flex flex-col items-center justify-center mb-2">
                  <span className="text-xl font-black text-slate-900">0</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Leads</span>
                </div>
                <p className="text-xs text-slate-400">No channel leads logged yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Origins (Website, Referral, Ads) will calculate here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Strategic Executive Takeaways / Recommendations */}
      <div className="crm-card p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold tracking-tight">Executive Pipeline Intelligence & Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-amber-400 font-bold block mb-1">Pipeline Velocity</span>
            <p className="leading-relaxed">
              {total === 0
                ? 'No inquiries currently registered. Share the public contact form link to collect visitor proposals and begin tracking velocity.'
                : contactedStage < total
                ? `You have ${total - contactedStage} uncontacted inquiry awaiting immediate outreach. Fast responses within 1 hour increase conversion rates by up to 390%.`
                : 'All incoming leads have been engaged by administrative outreach. Keep following up regularly.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-emerald-400 font-bold block mb-1">Conversion Health</span>
            <p className="leading-relaxed">
              {stats.conversionRate > 20
                ? `Strong closing rate of ${stats.conversionRate}% indicates excellent lead quality and compelling proposal pricing.`
                : stats.conversionRate > 0
                ? `Current conversion rate is ${stats.conversionRate}%. Qualifying budget early in discovery calls will optimize deal progression.`
                : 'Conversion rate currently stands at 0%. Advance leads through Contacted and Qualified stages to record contract wins.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-sky-400 font-bold block mb-1">Attribution Focus</span>
            <p className="leading-relaxed">
              {sourceDistribution.length > 0 && sourceDistribution[0]?.count > 0
                ? `${sourceDistribution[0].name} is your highest volume acquisition channel with ${sourceDistribution[0].percentage}% of total intake. Double down on this source.`
                : 'Attribution tracking is enabled for Website, Referral, Social Media, and Advertisement campaigns.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
