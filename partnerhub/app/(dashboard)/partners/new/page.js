'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { demoStore } from '@/lib/demo-data';

export default function NewPartnerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    type: 'ngo',
    stage: 'lead',
    pipeline_value: '',
    website: '',
    description: '',
    next_followup: '',
  });
  const [saving, setSaving] = useState(false);

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    const partner = demoStore.createPartner({
      ...formData,
      pipeline_value: Number(formData.pipeline_value) || 0,
      assigned_to: '1',
    });

    demoStore.createActivity({
      partner_id: partner.id,
      user_id: '1',
      type: 'note',
      title: 'Partner created',
      description: `${formData.name} added as a new ${formData.type} partner.`,
    });

    setTimeout(() => router.push(`/partners/${partner.id}`), 300);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Add New Partner</h2>
          <p>Create a new partnership entry in the pipeline</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-ghost" onClick={() => router.back()}>Cancel</button>
        </div>
      </div>

      <div className="page-content" style={{ maxWidth: 720, margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="card" style={{ padding: 'var(--space-2xl)' }}>
            <div className="section-title" style={{ marginBottom: 'var(--space-xl)' }}>🏢 Partner Information</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
              <div className="form-group">
                <label className="form-label">Organization Name *</label>
                <input
                  className="form-input"
                  placeholder="e.g., Tata Foundation"
                  value={formData.name}
                  onChange={(e) => update('name', e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Partner Type *</label>
                  <select className="form-select" value={formData.type} onChange={(e) => update('type', e.target.value)}>
                    <option value="ngo">🏛️ NGO / Admission Partner</option>
                    <option value="government">🏢 Government</option>
                    <option value="corporate">💼 Corporate / CSR</option>
                    <option value="placement">🎯 Placement Partner</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Pipeline Stage</label>
                  <select className="form-select" value={formData.stage} onChange={(e) => update('stage', e.target.value)}>
                    <option value="lead">Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_discussion">In Discussion</option>
                    <option value="proposal_sent">Proposal Sent</option>
                    <option value="active_partner">Active Partner</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Estimated Pipeline Value (₹)</label>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="e.g., 500000"
                    value={formData.pipeline_value}
                    onChange={(e) => update('pipeline_value', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Next Follow-up Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={formData.next_followup}
                    onChange={(e) => update('next_followup', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Website</label>
                <input
                  className="form-input"
                  placeholder="https://..."
                  value={formData.website}
                  onChange={(e) => update('website', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Brief description of the partnership opportunity..."
                  value={formData.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)', marginTop: 'var(--space-xl)' }}>
            <button type="button" className="btn btn-secondary" onClick={() => router.back()}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving || !formData.name.trim()}>
              {saving ? '⏳ Creating...' : '✅ Create Partner'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
