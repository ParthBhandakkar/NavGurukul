'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { demoStore } from '@/lib/demo-data';
import { formatCurrency, STAGE_LABELS, getFollowupStatus, getTypeColor } from '@/lib/utils';

const STAGES = ['lead', 'contacted', 'in_discussion', 'proposal_sent', 'active_partner', 'closed'];
const STAGE_DOT_COLORS = {
  lead: '#6b7280',
  contacted: '#3b82f6',
  in_discussion: '#a855f7',
  proposal_sent: '#f59e0b',
  active_partner: '#10b981',
  closed: '#ef4444',
};

export default function PipelinePage() {
  const router = useRouter();
  const [partners, setPartners] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    setPartners(demoStore.getPartners());
  }, []);

  const filteredPartners = filterType === 'all'
    ? partners
    : partners.filter(p => p.type === filterType);

  const handleDragStart = (e, partnerId) => {
    setDraggedId(partnerId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, stage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e, newStage) => {
    e.preventDefault();
    setDragOverStage(null);
    if (draggedId) {
      demoStore.updatePartner(draggedId, { stage: newStage });
      demoStore.createActivity({
        partner_id: draggedId,
        user_id: '1',
        type: 'stage_change',
        title: `Moved to ${STAGE_LABELS[newStage]}`,
        description: `Partnership stage changed to ${STAGE_LABELS[newStage]}.`,
      });
      setPartners(demoStore.getPartners());
    }
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverStage(null);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Pipeline</h2>
          <p>Drag partners between stages to update their status</p>
        </div>
        <div className="page-header-actions">
          <div className="filter-pills">
            {['all', 'ngo', 'government', 'corporate', 'placement'].map(type => (
              <button
                key={type}
                className={`filter-pill ${filterType === type ? 'active' : ''}`}
                onClick={() => setFilterType(type)}
              >
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => router.push('/partners/new')}>
            ➕ Add
          </button>
        </div>
      </div>

      <div className="kanban-board">
        {STAGES.map(stage => {
          const stagePartners = filteredPartners.filter(p => p.stage === stage);
          return (
            <div key={stage} className="kanban-column">
              <div className="kanban-column-header">
                <div className="kanban-column-title">
                  <div className="kanban-column-dot" style={{ background: STAGE_DOT_COLORS[stage] }} />
                  {STAGE_LABELS[stage]}
                </div>
                <div className="kanban-column-count">{stagePartners.length}</div>
              </div>

              <div
                className={`kanban-cards ${dragOverStage === stage ? 'drag-over' : ''}`}
                onDragOver={(e) => handleDragOver(e, stage)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage)}
              >
                {stagePartners.map(partner => {
                  const fuStatus = getFollowupStatus(partner.next_followup);
                  return (
                    <div
                      key={partner.id}
                      className={`kanban-card ${draggedId === partner.id ? 'dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, partner.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => router.push(`/partners/${partner.id}`)}
                    >
                      <div className="kanban-card-header">
                        <div className="kanban-card-name">{partner.name}</div>
                        <span className={`badge badge-${partner.type}`}>{partner.type}</span>
                      </div>
                      <div className="kanban-card-value">
                        {formatCurrency(partner.pipeline_value)}
                      </div>
                      <div className="kanban-card-footer">
                        <div className={`kanban-card-followup ${fuStatus}`}>
                          {partner.next_followup ? (
                            <>
                              {fuStatus === 'overdue' ? '⚠️' : fuStatus === 'today' ? '🔥' : '📅'}
                              {' '}{partner.next_followup}
                            </>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>No follow-up</span>
                          )}
                        </div>
                        <div
                          style={{
                            width: 24, height: 24, borderRadius: 6,
                            background: getTypeColor(partner.type),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.65rem', fontWeight: 700, color: 'white'
                          }}
                        >
                          {partner.name.charAt(0)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {stagePartners.length === 0 && (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    No partners
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
