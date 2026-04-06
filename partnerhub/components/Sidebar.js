'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { demoStore } from '@/lib/demo-data';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: '◻', href: '/dashboard' },
  { label: 'Pipeline', icon: '▤', href: '/pipeline' },
  { label: 'Partners', icon: '◈', href: '/partners' },
  { label: 'Contacts', icon: '◉', href: '/contacts' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [overdueCount, setOverdueCount] = useState(0);

  useEffect(() => {
    const stats = demoStore.getStats();
    setOverdueCount(stats.overdueFollowups);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('partnerhub_user');
    router.push('/');
  };

  return (
    <>
      <button className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'fixed', top: 16, left: 16, zIndex: 200 }}>
        {isOpen ? '✕' : '☰'}
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">PH</div>
            <div className="sidebar-logo-text">
              <h1>PartnerHub</h1>
              <span>NavGurukul CRM</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Navigation</div>
          {NAV_ITEMS.map(item => (
            <button
              key={item.href}
              className={`sidebar-link ${pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}`}
              onClick={() => { router.push(item.href); setIsOpen(false); }}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
              {item.href === '/dashboard' && overdueCount > 0 && (
                <span className="badge">{overdueCount}</span>
              )}
            </button>
          ))}

          <div className="sidebar-section-label">Actions</div>
          <button className="sidebar-link"
            onClick={() => { router.push('/partners/new'); setIsOpen(false); }}>
            <span className="icon">+</span>
            Add Partner
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={handleLogout} title="Sign out">
            <div className="sidebar-avatar">AG</div>
            <div className="sidebar-user-info">
              <div className="name">Abhishek Gupta</div>
              <div className="role">Admin</div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>↗</span>
          </div>
        </div>
      </aside>
    </>
  );
}
