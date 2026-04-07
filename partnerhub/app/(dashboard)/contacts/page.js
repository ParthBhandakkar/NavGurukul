'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getInitials } from '@/lib/utils';

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [_contacts, _partners] = await Promise.all([
        api.getContacts(),
        api.getPartners()
      ]);
      setContacts(_contacts || []);
      setPartners(_partners || []);
      setLoading(false);
    }
    loadData();
  }, []);

  let filtered = contacts;
  if (search) {
    const q = search.toLowerCase();
    filtered = contacts.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.designation?.toLowerCase().includes(q)
    );
  }

  if (loading) return <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--text-muted)' }}>Loading...</div>;

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Contacts</h2>
          <p>{filtered.length} contact{filtered.length !== 1 ? 's' : ''} across all partners</p>
        </div>
        <div className="page-header-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="form-input"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="card">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Organization</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(contact => {
                  const partner = partners.find(p => p.id === contact.partner_id);
                  return (
                    <tr key={contact.id} onClick={() => partner && router.push(`/partners/${partner.id}`)}>
                      <td>
                        <div className="partner-name-cell">
                          <div style={{
                            width: 34, height: 34, borderRadius: 'var(--radius-full)',
                            background: 'var(--accent-primary-bg)', color: 'var(--accent-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 600, fontSize: '0.78rem', flexShrink: 0
                          }}>
                            {getInitials(contact.name)}
                          </div>
                          <div>
                            <span className="partner-name-text">{contact.name}</span>
                            {contact.is_primary && (
                              <span style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', marginLeft: 8, fontWeight: 600 }}>PRIMARY</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{contact.designation || '—'}</td>
                      <td>
                        <span style={{ color: 'var(--accent-primary)', fontWeight: 500, fontSize: '0.85rem' }}>
                          {partner?.name || '—'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{contact.email || '—'}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{contact.phone || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <div className="icon">👥</div>
              <h3>No contacts found</h3>
              <p>Add contacts from partner detail pages</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
