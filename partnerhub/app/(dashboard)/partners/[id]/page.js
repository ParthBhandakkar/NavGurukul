'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { demoStore } from '@/lib/demo-data';
import { formatCurrency, formatDate, formatRelativeDate, STAGE_LABELS, TYPE_LABELS, ACTIVITY_ICONS, getTypeColor, getInitials, getFollowupStatus } from '@/lib/utils';

export default function PartnerDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [partner, setPartner] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [activeTab, setActiveTab] = useState('timeline');
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Activity form
  const [actType, setActType] = useState('note');
  const [actTitle, setActTitle] = useState('');
  const [actDesc, setActDesc] = useState('');

  // Followup form
  const [fuTitle, setFuTitle] = useState('');
  const [fuDate, setFuDate] = useState('');
  const [fuDesc, setFuDesc] = useState('');

  // Contact form
  const [ctName, setCtName] = useState('');
  const [ctEmail, setCtEmail] = useState('');
  const [ctPhone, setCtPhone] = useState('');
  const [ctDesignation, setCtDesignation] = useState('');

  // Edit form
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = () => {
    const p = demoStore.getPartner(id);
    if (!p) { router.push('/partners'); return; }
    setPartner(p);
    setContacts(demoStore.getContactsByPartner(id));
    setActivities(demoStore.getActivitiesByPartner(id));
    setFollowups(demoStore.getFollowupsByPartner(id));
    setEditData({ ...p });
  };

  const addActivity = () => {
    if (!actTitle.trim()) return;
    demoStore.createActivity({
      partner_id: id,
      user_id: '1',
      type: actType,
      title: actTitle,
      description: actDesc,
    });
    setActTitle(''); setActDesc(''); setActType('note');
    setShowActivityModal(false);
    loadData();
  };

  const addFollowup = () => {
    if (!fuTitle.trim() || !fuDate) return;
    demoStore.createFollowup({
      partner_id: id,
      user_id: '1',
      title: fuTitle,
      due_date: fuDate,
      description: fuDesc,
    });
    demoStore.updatePartner(id, { next_followup: fuDate });
    setFuTitle(''); setFuDate(''); setFuDesc('');
    setShowFollowupModal(false);
    loadData();
  };

  const addContact = () => {
    if (!ctName.trim()) return;
    demoStore.createContact({
      partner_id: id,
      name: ctName,
      email: ctEmail,
      phone: ctPhone,
      designation: ctDesignation,
      is_primary: contacts.length === 0,
    });
    setCtName(''); setCtEmail(''); setCtPhone(''); setCtDesignation('');
    setShowContactModal(false);
    loadData();
  };

  const saveEdit = () => {
    demoStore.updatePartner(id, editData);
    setShowEditModal(false);
    loadData();
  };

  const toggleFollowup = (fuId) => {
    demoStore.toggleFollowup(fuId);
    loadData();
  };

  const changeStage = (newStage) => {
    demoStore.updatePartner(id, { stage: newStage });
    demoStore.createActivity({
      partner_id: id,
      user_id: '1',
      type: 'stage_change',
      title: `Moved to ${STAGE_LABELS[newStage]}`,
      description: `Partnership stage changed to ${STAGE_LABELS[newStage]}.`,
    });
    loadData();
  };

  if (!partner) return null;

  return (
    <>
      {/* Header */}
      <div className="detail-header">
        <button className="btn btn-ghost" onClick={() => router.push('/partners')} style={{ position: 'absolute', top: 20, left: 20 }}>
          ← Back
        </button>
        <div
          className="detail-avatar"
          style={{ background: getTypeColor(partner.type) }}
        >
          {getInitials(partner.name)}
        </div>
        <div className="detail-info">
          <h2>{partner.name}</h2>
          <div className="detail-info-row">
            <span className={`badge badge-${partner.type}`}>{TYPE_LABELS[partner.type]}</span>
            <span className={`badge badge-${partner.stage}`}>{STAGE_LABELS[partner.stage]}</span>
            <span className="detail-info-item">💰 {formatCurrency(partner.pipeline_value)}</span>
            {partner.website && (
              <a href={partner.website} target="_blank" rel="noopener noreferrer" className="detail-info-item" style={{ color: 'var(--accent-primary)' }}>
                🔗 Website
              </a>
            )}
          </div>
        </div>
        <div className="detail-actions">
          <button className="btn btn-secondary" onClick={() => setShowEditModal(true)}>✏️ Edit</button>
          <button className="btn btn-primary" onClick={() => setShowActivityModal(true)}>➕ Log Activity</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 var(--space-2xl)', background: 'var(--bg-secondary)' }}>
        <div className="tabs">
          {['timeline', 'contacts', 'followups'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'timeline' ? `⚡ Timeline (${activities.length})` :
               tab === 'contacts' ? `👥 Contacts (${contacts.length})` :
               `📅 Follow-ups (${followups.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="detail-body">
        <div>
          {activeTab === 'timeline' && (
            <div className="card" style={{ padding: 'var(--space-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                <div className="section-title" style={{ marginBottom: 0 }}>Activity Timeline</div>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowActivityModal(true)}>➕ Add</button>
              </div>
              {activities.length > 0 ? (
                <div className="timeline">
                  {activities.map(act => (
                    <div key={act.id} className="timeline-item">
                      <div className={`timeline-icon ${act.type}`}>
                        {ACTIVITY_ICONS[act.type] || '📌'}
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-title">{act.title}</div>
                        <div className="timeline-desc">{act.description}</div>
                        <div className="timeline-time">{formatRelativeDate(act.created_at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="icon">📝</div>
                  <h3>No activities yet</h3>
                  <p>Log your first interaction with this partner</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="card" style={{ padding: 'var(--space-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                <div className="section-title" style={{ marginBottom: 0 }}>Contact Persons</div>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowContactModal(true)}>➕ Add Contact</button>
              </div>
              {contacts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {contacts.map(c => (
                    <div key={c.id} className="card" style={{ padding: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 'var(--radius-full)',
                        background: 'var(--accent-primary-bg)', color: 'var(--accent-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 600, fontSize: '0.85rem', flexShrink: 0
                      }}>
                        {getInitials(c.name)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                          {c.name}
                          {c.is_primary && <span style={{ color: 'var(--accent-primary)', fontSize: '0.72rem', marginLeft: 8 }}>PRIMARY</span>}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{c.designation}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-lg)', fontSize: '0.82rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                        {c.email && <span>✉️ {c.email}</span>}
                        {c.phone && <span>📞 {c.phone}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="icon">👥</div>
                  <h3>No contacts yet</h3>
                  <p>Add a contact person for this partner</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'followups' && (
            <div className="card" style={{ padding: 'var(--space-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                <div className="section-title" style={{ marginBottom: 0 }}>Follow-ups</div>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowFollowupModal(true)}>➕ Add Follow-up</button>
              </div>
              {followups.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {followups.map(fu => {
                    const status = getFollowupStatus(fu.due_date);
                    return (
                      <div key={fu.id} className="followup-item">
                        <button
                          className={`followup-checkbox ${fu.is_completed ? 'checked' : ''}`}
                          onClick={() => toggleFollowup(fu.id)}
                        >
                          {fu.is_completed ? '✓' : ''}
                        </button>
                        <div className="followup-info">
                          <div className={`followup-title ${fu.is_completed ? 'completed' : ''}`}>{fu.title}</div>
                          <div className="followup-meta">
                            <span className={`followup-date ${status}`}>
                              {status === 'overdue' ? '⚠️ Overdue · ' : status === 'today' ? '🔥 Today · ' : ''}{fu.due_date}
                            </span>
                          </div>
                          {fu.description && <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: 4 }}>{fu.description}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="icon">📅</div>
                  <h3>No follow-ups</h3>
                  <p>Schedule a follow-up for this partner</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="card detail-sidebar-card">
            <div className="section-title">📋 Details</div>
            <div className="detail-field">
              <span className="detail-field-label">Stage</span>
              <span className="detail-field-value">
                <select
                  className="form-select"
                  value={partner.stage}
                  onChange={(e) => changeStage(e.target.value)}
                  style={{ fontSize: '0.78rem', padding: '4px 28px 4px 8px', background: 'var(--bg-tertiary)' }}
                >
                  {Object.entries(STAGE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </span>
            </div>
            <div className="detail-field">
              <span className="detail-field-label">Type</span>
              <span className="detail-field-value"><span className={`badge badge-${partner.type}`}>{TYPE_LABELS[partner.type]}</span></span>
            </div>
            <div className="detail-field">
              <span className="detail-field-label">Value</span>
              <span className="detail-field-value">{formatCurrency(partner.pipeline_value)}</span>
            </div>
            <div className="detail-field">
              <span className="detail-field-label">Next Follow-up</span>
              <span className="detail-field-value">{partner.next_followup || '—'}</span>
            </div>
            <div className="detail-field">
              <span className="detail-field-label">Created</span>
              <span className="detail-field-value">{formatDate(partner.created_at)}</span>
            </div>
            <div className="detail-field">
              <span className="detail-field-label">Last Updated</span>
              <span className="detail-field-value">{formatDate(partner.updated_at)}</span>
            </div>
          </div>

          {partner.description && (
            <div className="card detail-sidebar-card">
              <div className="section-title">📝 Description</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{partner.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Activity Modal */}
      {showActivityModal && (
        <div className="modal-overlay" onClick={() => setShowActivityModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Log Activity</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setShowActivityModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-select" value={actType} onChange={(e) => setActType(e.target.value)}>
                  <option value="note">📝 Note</option>
                  <option value="call">📞 Call</option>
                  <option value="email">✉️ Email</option>
                  <option value="meeting">🤝 Meeting</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" placeholder="e.g., Quarterly review call" value={actTitle} onChange={(e) => setActTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" placeholder="What happened?" value={actDesc} onChange={(e) => setActDesc(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowActivityModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addActivity}>Log Activity</button>
            </div>
          </div>
        </div>
      )}

      {/* Follow-up Modal */}
      {showFollowupModal && (
        <div className="modal-overlay" onClick={() => setShowFollowupModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Schedule Follow-up</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setShowFollowupModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" placeholder="e.g., Check proposal status" value={fuTitle} onChange={(e) => setFuTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input className="form-input" type="date" value={fuDate} onChange={(e) => setFuDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Description (optional)</label>
                <textarea className="form-textarea" placeholder="Details..." value={fuDesc} onChange={(e) => setFuDesc(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowFollowupModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addFollowup}>Schedule</button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Contact</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setShowContactModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input className="form-input" placeholder="Full name" value={ctName} onChange={(e) => setCtName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Designation</label>
                  <input className="form-input" placeholder="e.g., CSR Director" value={ctDesignation} onChange={(e) => setCtDesignation(e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" placeholder="email@company.com" value={ctEmail} onChange={(e) => setCtEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" type="tel" placeholder="+91-98765-43210" value={ctPhone} onChange={(e) => setCtPhone(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowContactModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addContact}>Add Contact</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Partner</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" value={editData.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={editData.type || 'ngo'} onChange={(e) => setEditData({ ...editData, type: e.target.value })}>
                    <option value="ngo">NGO</option>
                    <option value="government">Government</option>
                    <option value="corporate">Corporate</option>
                    <option value="placement">Placement</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Pipeline Value (₹)</label>
                  <input className="form-input" type="number" value={editData.pipeline_value || ''} onChange={(e) => setEditData({ ...editData, pipeline_value: Number(e.target.value) })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Website</label>
                <input className="form-input" value={editData.website || ''} onChange={(e) => setEditData({ ...editData, website: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={editData.description || ''} onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
