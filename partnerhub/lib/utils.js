// Utility helpers for formatting

export const STAGE_LABELS = {
  lead: 'Lead',
  contacted: 'Contacted',
  in_discussion: 'In Discussion',
  proposal_sent: 'Proposal Sent',
  active_partner: 'Active Partner',
  closed: 'Closed',
};

export const TYPE_LABELS = {
  ngo: 'NGO',
  government: 'Government',
  corporate: 'Corporate',
  placement: 'Placement',
};

export const ACTIVITY_ICONS = {
  note: '📝',
  call: '📞',
  email: '✉️',
  meeting: '🤝',
  stage_change: '🔄',
  followup: '⏰',
};

export function formatCurrency(value) {
  if (!value) return '₹0';
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatRelativeDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

export function getFollowupStatus(dueDateStr) {
  if (!dueDateStr) return 'none';
  const today = new Date().toISOString().split('T')[0];
  if (dueDateStr < today) return 'overdue';
  if (dueDateStr === today) return 'today';
  return 'upcoming';
}

export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export function getTypeColor(type) {
  const colors = {
    ngo: '#2563eb',
    government: '#7c3aed',
    corporate: '#059669',
    placement: '#d97706',
  };
  return colors[type] || '#111111';
}
