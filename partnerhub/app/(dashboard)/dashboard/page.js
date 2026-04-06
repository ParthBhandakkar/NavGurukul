'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { demoStore } from '@/lib/demo-data';
import { formatCurrency, formatRelativeDate, STAGE_LABELS, TYPE_LABELS, ACTIVITY_ICONS, getFollowupStatus } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PIE_COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706'];
const STAGE_COLORS = ['#9ca3af', '#2563eb', '#7c3aed', '#d97706', '#059669', '#dc2626'];
const STAGE_KEYS = ['lead', 'contacted', 'in_discussion', 'proposal_sent', 'active_partner', 'closed'];
const TYPE_KEYS = ['ngo', 'government', 'corporate', 'placement'];

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [followups, setFollowups] = useState([]);

  useEffect(() => {
    setStats(demoStore.getStats());
    setActivities(demoStore.getActivities().slice(0, 6));
    setFollowups(demoStore.getFollowups().filter(f => !f.is_completed).slice(0, 5));
  }, []);

  const toggleFollowup = (e, id) => {
    e.stopPropagation();
    demoStore.toggleFollowup(id);
    setFollowups(demoStore.getFollowups().filter(f => !f.is_completed).slice(0, 5));
    setStats(demoStore.getStats());
  };

  if (!stats) return null;

  const partners = demoStore.getPartners();

  const kpis = [
    { label: 'Total Partners', value: stats.totalPartners, subtext: 'Across all types', href: '/partners' },
    { label: 'Active Partners', value: stats.activePartners, subtext: 'Currently engaged', href: '/partners?stage=active_partner' },
    { label: 'Pipeline Value', value: formatCurrency(stats.totalPipelineValue), subtext: 'Total estimated value', href: '/partners' },
    { label: 'Due Follow-ups', value: stats.overdueFollowups + stats.followupsDueToday, subtext: 'Overdue + today', href: '/pipeline' },
  ];

  const stageData = stats.partnersByStage.map((s, i) => ({
    name: STAGE_LABELS[s.stage],
    value: s.count,
    stageKey: s.stage,
  }));

  const typeData = stats.partnersByType.map(t => ({
    name: TYPE_LABELS[t.type],
    value: t.count,
    typeKey: t.type,
  }));

  const handleBarClick = (data) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const stageKey = data.activePayload[0].payload.stageKey;
      router.push(`/partners?stage=${stageKey}`);
    }
  };

  const handlePieClick = (data, index) => {
    const typeKey = TYPE_KEYS[index];
    router.push(`/partners?type=${typeKey}`);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Dashboard</h2>
          <p>Partnership pipeline overview</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => router.push('/partners/new')}>
            + New Partner
          </button>
        </div>
      </div>

      <div className="page-content">
        {/* KPI Cards — All clickable */}
        <div className="kpi-grid" style={{ marginBottom: 'var(--space-2xl)' }}>
          {kpis.map((kpi, i) => (
            <div
              key={i}
              className="card card-interactive kpi-card animate-in"
              onClick={() => router.push(kpi.href)}
            >
              <span className="kpi-arrow">→</span>
              <div className="kpi-label">{kpi.label}</div>
              <div className="kpi-value">{kpi.value}</div>
              <div className="kpi-subtext">{kpi.subtext}</div>
            </div>
          ))}
        </div>

        {/* Charts + Breakdowns — Interactive */}
        <div className="content-grid content-grid-2" style={{ marginBottom: 'var(--space-2xl)' }}>
          {/* Bar Chart — Click bars to filter */}
          <div className="card chart-card animate-in">
            <div className="section-header">
              <div className="section-title">Partners by Stage</div>
              <button className="btn btn-ghost btn-sm" onClick={() => router.push('/pipeline')}>
                View Pipeline →
              </button>
            </div>
            <div className="chart-container" style={{ cursor: 'pointer' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageData} barSize={28} onClick={handleBarClick}>
                  <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 6, color: '#111', fontSize: 13, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    formatter={(value, name) => [value, 'Partners']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} style={{ cursor: 'pointer' }}>
                    {stageData.map((entry, index) => (
                      <Cell key={index} fill={STAGE_COLORS[index % STAGE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Type Breakdown — Clickable rows */}
          <div className="card animate-in" style={{ padding: 'var(--space-xl)' }}>
            <div className="section-header">
              <div className="section-title">Partners by Type</div>
              <button className="btn btn-ghost btn-sm" onClick={() => router.push('/partners')}>
                View All →
              </button>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-xl)', alignItems: 'center' }}>
              <div style={{ width: 180, height: 180, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData} cx="50%" cy="50%"
                      innerRadius={50} outerRadius={80}
                      paddingAngle={3} dataKey="value" stroke="none"
                      style={{ cursor: 'pointer' }}
                      onClick={handlePieClick}
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1 }}>
                {typeData.map((entry, index) => (
                  <div
                    key={entry.name}
                    className="stat-link-row"
                    onClick={() => router.push(`/partners?type=${TYPE_KEYS[index]}`)}
                  >
                    <div className="stat-label">
                      <div className="stat-dot" style={{ background: PIE_COLORS[index] }} />
                      {entry.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="stat-value">{entry.value}</span>
                      <span className="stat-arrow">→</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage breakdown — clickable */}
            <div style={{ marginTop: 'var(--space-xl)', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--border-primary)' }}>
              <div className="section-title" style={{ marginBottom: 'var(--space-md)' }}>By Stage</div>
              {stageData.map((entry, index) => (
                <div
                  key={entry.name}
                  className="stat-link-row"
                  onClick={() => router.push(`/partners?stage=${STAGE_KEYS[index]}`)}
                >
                  <div className="stat-label">
                    <div className="stat-dot" style={{ background: STAGE_COLORS[index] }} />
                    {entry.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="stat-value">{entry.value}</span>
                    <span className="stat-arrow">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity + Follow-ups */}
        <div className="content-grid content-grid-3">
          <div className="card animate-in" style={{ padding: 'var(--space-xl)' }}>
            <div className="section-header">
              <div className="section-title">Recent Activity</div>
            </div>
            <div className="timeline">
              {activities.map(act => {
                const partner = partners.find(p => p.id === act.partner_id);
                return (
                  <div
                    key={act.id}
                    className="timeline-item"
                    onClick={() => partner && router.push(`/partners/${partner.id}`)}
                  >
                    <div className={`timeline-icon ${act.type}`}>
                      {ACTIVITY_ICONS[act.type] || '📌'}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-title">{act.title}</div>
                      <div className="timeline-desc">
                        {partner && (
                          <span style={{ fontWeight: 600 }}>{partner.name}</span>
                        )}
                        {partner && ' — '}{act.description}
                      </div>
                      <div className="timeline-time">{formatRelativeDate(act.created_at)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card animate-in" style={{ padding: 'var(--space-xl)' }}>
            <div className="section-header">
              <div className="section-title">Follow-ups</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {followups.map(fu => {
                const partner = partners.find(p => p.id === fu.partner_id);
                const status = getFollowupStatus(fu.due_date);
                return (
                  <div
                    key={fu.id}
                    className="followup-item"
                    onClick={() => partner && router.push(`/partners/${partner.id}`)}
                  >
                    <button
                      className={`followup-checkbox ${fu.is_completed ? 'checked' : ''}`}
                      onClick={(e) => toggleFollowup(e, fu.id)}
                    >
                      {fu.is_completed ? '✓' : ''}
                    </button>
                    <div className="followup-info">
                      <div className={`followup-title ${fu.is_completed ? 'completed' : ''}`}>
                        {fu.title}
                      </div>
                      <div className="followup-meta">
                        <span className={`followup-date ${status}`}>
                          {status === 'overdue' ? 'Overdue' : status === 'today' ? 'Today' : fu.due_date}
                        </span>
                        {partner && (
                          <>
                            <span>·</span>
                            <span style={{ fontWeight: 500 }}>{partner.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {followups.length === 0 && (
                <div className="empty-state" style={{ padding: 'var(--space-2xl)' }}>
                  <h3>All caught up</h3>
                  <p style={{ fontSize: '0.82rem' }}>No pending follow-ups</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
