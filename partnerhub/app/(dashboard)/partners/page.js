'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { demoStore } from '@/lib/demo-data';
import { formatCurrency, formatDate, STAGE_LABELS, TYPE_LABELS, getTypeColor, getInitials } from '@/lib/utils';

export default function PartnersPageWrapper() {
  return (
    <Suspense fallback={<div style={{ padding: 32 }}>Loading...</div>}>
      <PartnersPage />
    </Suspense>
  );
}

function PartnersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [partners, setPartners] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [sortBy, setSortBy] = useState('updated_at');

  useEffect(() => {
    setPartners(demoStore.getPartners());
    // Read URL params from dashboard clicks
    const typeParam = searchParams.get('type');
    const stageParam = searchParams.get('stage');
    if (typeParam) setFilterType(typeParam);
    if (stageParam) setFilterStage(stageParam);
  }, [searchParams]);

  let filtered = [...partners];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    );
  }
  if (filterType !== 'all') filtered = filtered.filter(p => p.type === filterType);
  if (filterStage !== 'all') filtered = filtered.filter(p => p.stage === filterStage);

  filtered.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'pipeline_value') return (b.pipeline_value || 0) - (a.pipeline_value || 0);
    return new Date(b.updated_at) - new Date(a.updated_at);
  });

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this partner?')) {
      demoStore.deletePartner(id);
      setPartners(demoStore.getPartners());
    }
  };

  const clearFilters = () => {
    setFilterType('all');
    setFilterStage('all');
    setSearch('');
    router.replace('/partners');
  };

  const hasFilters = filterType !== 'all' || filterStage !== 'all' || search;

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Partners</h2>
          <p>
            {filtered.length} partner{filtered.length !== 1 ? 's' : ''}
            {hasFilters && ' (filtered)'}
          </p>
        </div>
        <div className="page-header-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input type="text" className="form-input" placeholder="Search partners..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => router.push('/partners/new')}>
            + New Partner
          </button>
        </div>
      </div>

      <div className="page-content">
        {/* Filters */}
        <div style={{ display: 'flex', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="filter-pills">
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Type</span>
            {['all', 'ngo', 'government', 'corporate', 'placement'].map(type => (
              <button key={type} className={`filter-pill ${filterType === type ? 'active' : ''}`}
                onClick={() => setFilterType(type)}>
                {type === 'all' ? 'All' : TYPE_LABELS[type] || type}
              </button>
            ))}
          </div>

          <div style={{ width: 1, height: 20, background: 'var(--border-primary)' }} />

          <div className="filter-pills">
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Stage</span>
            {['all', 'lead', 'contacted', 'in_discussion', 'proposal_sent', 'active_partner', 'closed'].map(stage => (
              <button key={stage} className={`filter-pill ${filterStage === stage ? 'active' : ''}`}
                onClick={() => setFilterStage(stage)}>
                {stage === 'all' ? 'All' : STAGE_LABELS[stage] || stage}
              </button>
            ))}
          </div>

          {hasFilters && (
            <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ fontSize: '0.75rem' }}>
              ✕ Clear filters
            </button>
          )}

          <div style={{ marginLeft: 'auto' }}>
            <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              style={{ width: 'auto', fontSize: '0.75rem', padding: '5px 30px 5px 10px' }}>
              <option value="updated_at">Last Updated</option>
              <option value="name">Name</option>
              <option value="pipeline_value">Value</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Partner</th>
                  <th>Type</th>
                  <th>Stage</th>
                  <th>Pipeline Value</th>
                  <th>Next Follow-up</th>
                  <th>Last Updated</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(partner => (
                  <tr key={partner.id} onClick={() => router.push(`/partners/${partner.id}`)}>
                    <td>
                      <div className="partner-name-cell">
                        <div className="partner-avatar" style={{ background: getTypeColor(partner.type) }}>
                          {getInitials(partner.name)}
                        </div>
                        <span className="partner-name-text">{partner.name}</span>
                      </div>
                    </td>
                    <td><span className={`badge badge-${partner.type}`}>{TYPE_LABELS[partner.type]}</span></td>
                    <td><span className={`badge badge-${partner.stage}`}>{STAGE_LABELS[partner.stage]}</span></td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(partner.pipeline_value)}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{partner.next_followup || '—'}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>{formatDate(partner.updated_at)}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm btn-icon"
                        onClick={(e) => handleDelete(e, partner.id)} title="Delete">🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="empty-state">
              <div className="icon">🔍</div>
              <h3>No partners found</h3>
              <p style={{ fontSize: '0.82rem' }}>Try adjusting your filters</p>
              {hasFilters && (
                <button className="btn btn-secondary btn-sm" onClick={clearFilters} style={{ marginTop: 'var(--space-lg)' }}>
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
