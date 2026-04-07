import { supabase } from './supabase';

const handleResponse = ({ data, error }) => {
  if (error) {
    console.error('Supabase Error:', error);
    return null;
  }
  return data;
};

// API Wrapper to abstract Supabase queries and mimic previous demoStore behavior

export const api = {
  // Profiles
  getCurrentUser: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    return handleResponse(await supabase.from('profiles').select('*').eq('id', session.user.id).single());
  },
  
  getProfiles: async () => {
    return handleResponse(await supabase.from('profiles').select('*')) || [];
  },

  // Partners
  getPartners: async () => {
    return handleResponse(await supabase.from('partners').select('*').order('created_at', { ascending: false })) || [];
  },
  getPartner: async (id) => {
    return handleResponse(await supabase.from('partners').select('*').eq('id', id).single());
  },
  createPartner: async (data) => {
    return handleResponse(await supabase.from('partners').insert(data).select().single());
  },
  updatePartner: async (id, data) => {
    return handleResponse(await supabase.from('partners').update(data).eq('id', id).select().single());
  },
  deletePartner: async (id) => {
    return handleResponse(await supabase.from('partners').delete().eq('id', id));
  },

  // Contacts
  getContacts: async () => {
    return handleResponse(await supabase.from('contacts').select('*').order('created_at', { ascending: false })) || [];
  },
  getContactsByPartner: async (partnerId) => {
    return handleResponse(await supabase.from('contacts').select('*').eq('partner_id', partnerId)) || [];
  },
  createContact: async (data) => {
    return handleResponse(await supabase.from('contacts').insert(data).select().single());
  },

  // Activities
  getActivities: async () => {
    return handleResponse(await supabase.from('activities').select('*').order('created_at', { ascending: false })) || [];
  },
  getActivitiesByPartner: async (partnerId) => {
    return handleResponse(await supabase.from('activities').select('*').eq('partner_id', partnerId).order('created_at', { ascending: false })) || [];
  },
  createActivity: async (data) => {
    return handleResponse(await supabase.from('activities').insert(data).select().single());
  },

  // Follow-ups
  getFollowups: async () => {
    return handleResponse(await supabase.from('followups').select('*').order('due_date', { ascending: true })) || [];
  },
  getFollowupsByPartner: async (partnerId) => {
    return handleResponse(await supabase.from('followups').select('*').eq('partner_id', partnerId).order('due_date', { ascending: true })) || [];
  },
  toggleFollowup: async (id, is_completed) => {
    return handleResponse(await supabase.from('followups').update({ is_completed: !is_completed }).eq('id', id).select().single());
  },

  // Stats
  getStats: async () => {
    const partners = await api.getPartners() || [];
    const followups = await api.getFollowups() || [];
    
    const active = partners.filter(p => p.stage !== 'closed');
    const totalValue = active.reduce((sum, p) => sum + (Number(p.pipeline_value) || 0), 0);
    const today = new Date().toISOString().split('T')[0];
    
    const dueTodayCount = followups.filter(f => f.due_date === today && !f.is_completed).length;
    const overdueCount = followups.filter(f => f.due_date < today && !f.is_completed).length;
    
    // Constant Types/Stages arrays
    const TYPES = ['ngo', 'government', 'corporate', 'placement'];
    const STAGES = ['lead', 'contacted', 'in_discussion', 'proposal_sent', 'active_partner', 'closed'];

    return {
      totalPartners: partners.length,
      activePartners: partners.filter(p => p.stage === 'active_partner').length,
      totalPipelineValue: totalValue,
      followupsDueToday: dueTodayCount,
      overdueFollowups: overdueCount,
      partnersByType: TYPES.map(t => ({ type: t, count: partners.filter(p => p.type === t).length })),
      partnersByStage: STAGES.map(s => ({ stage: s, count: partners.filter(p => p.stage === s).length })),
    };
  }
};
