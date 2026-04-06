// Demo data store - used when Supabase is not configured
// This provides a fully functional demo with realistic NavGurukul partner data

const STAGES = ['lead', 'contacted', 'in_discussion', 'proposal_sent', 'active_partner', 'closed'];
const TYPES = ['ngo', 'government', 'corporate', 'placement'];

let partners = [
  { id: '1', name: 'Educate Girls', type: 'ngo', stage: 'active_partner', pipeline_value: 500000, website: 'https://www.educategirls.ngo', description: 'NGO focused on advancing girls education in rural India. Long-term admission partner mobilizing students from Rajasthan.', assigned_to: '1', next_followup: '2026-04-15', created_at: '2025-06-10T10:00:00Z', updated_at: '2026-03-20T14:30:00Z' },
  { id: '2', name: 'Pratham Education Foundation', type: 'ngo', stage: 'active_partner', pipeline_value: 750000, website: 'https://www.pratham.org', description: 'One of the largest education NGOs in India. Helps identify and mobilize underprivileged students for NavGurukul programs.', assigned_to: '1', next_followup: '2026-04-20', created_at: '2025-03-15T09:00:00Z', updated_at: '2026-03-15T11:00:00Z' },
  { id: '3', name: 'Amazon India', type: 'corporate', stage: 'active_partner', pipeline_value: 5000000, website: 'https://www.amazon.in', description: 'Major CSR partner providing funding and internship opportunities. 70% internship success rate with NavGurukul students.', assigned_to: '1', next_followup: '2026-04-10', created_at: '2024-11-01T10:00:00Z', updated_at: '2026-02-28T16:00:00Z' },
  { id: '4', name: 'Accenture', type: 'corporate', stage: 'proposal_sent', pipeline_value: 3000000, website: 'https://www.accenture.com', description: 'Exploring CSR partnership for digital skills training. Proposal sent for funding residential campus expansion.', assigned_to: '2', next_followup: '2026-04-08', created_at: '2026-01-15T10:00:00Z', updated_at: '2026-03-25T10:00:00Z' },
  { id: '5', name: 'KPMG India', type: 'corporate', stage: 'in_discussion', pipeline_value: 2500000, website: 'https://kpmg.com/in', description: 'In discussion for CSR partnership focused on women in tech initiatives via Zuvy platform.', assigned_to: '2', next_followup: '2026-04-12', created_at: '2026-02-01T10:00:00Z', updated_at: '2026-03-28T14:00:00Z' },
  { id: '6', name: 'Microsoft Philanthropies', type: 'corporate', stage: 'active_partner', pipeline_value: 4000000, website: 'https://www.microsoft.com/en-us/philanthropies', description: 'Providing technology grants, Azure credits, and placement opportunities for NavGurukul graduates.', assigned_to: '1', next_followup: '2026-04-25', created_at: '2025-01-10T10:00:00Z', updated_at: '2026-03-10T09:00:00Z' },
  { id: '7', name: 'Salesforce.org', type: 'corporate', stage: 'contacted', pipeline_value: 1500000, website: 'https://www.salesforce.org', description: 'Initial conversation about Salesforce training integration and CSR funding for AI Learning Labs.', assigned_to: '2', next_followup: '2026-04-09', created_at: '2026-03-01T10:00:00Z', updated_at: '2026-03-30T11:00:00Z' },
  { id: '8', name: 'Magic Bus India', type: 'ngo', stage: 'contacted', pipeline_value: 300000, website: 'https://www.magicbus.org', description: 'Youth mentoring NGO. Discussing student mobilization partnership for residential programs.', assigned_to: '1', next_followup: '2026-04-11', created_at: '2026-03-10T10:00:00Z', updated_at: '2026-03-30T15:00:00Z' },
  { id: '9', name: 'Rajasthan Education Department', type: 'government', stage: 'in_discussion', pipeline_value: 2000000, website: 'https://education.rajasthan.gov.in', description: 'State govt partnership for digital literacy curriculum in ITI institutions. Covers 5 districts.', assigned_to: '1', next_followup: '2026-04-14', created_at: '2026-01-20T10:00:00Z', updated_at: '2026-03-22T10:00:00Z' },
  { id: '10', name: 'Chhattisgarh Skill Development Authority', type: 'government', stage: 'active_partner', pipeline_value: 3500000, website: 'https://www.cgsda.in', description: 'Active partnership for School of Second Chances. Training women survivors in Raipur district.', assigned_to: '2', next_followup: '2026-04-18', created_at: '2025-08-01T10:00:00Z', updated_at: '2026-03-15T10:00:00Z' },
  { id: '11', name: 'The Nudge Foundation', type: 'ngo', stage: 'lead', pipeline_value: 400000, website: 'https://www.thenudge.org', description: 'Potential admission partner. Researching collaboration on skilling programs for underserved youth.', assigned_to: '2', next_followup: '2026-04-16', created_at: '2026-03-25T10:00:00Z', updated_at: '2026-03-25T10:00:00Z' },
  { id: '12', name: 'TCS Foundation', type: 'corporate', stage: 'lead', pipeline_value: 6000000, website: 'https://www.tcs.com', description: 'Exploring large-scale CSR partnership for Sama laptop refurbishment program expansion.', assigned_to: '1', next_followup: '2026-04-07', created_at: '2026-03-28T10:00:00Z', updated_at: '2026-03-28T10:00:00Z' },
  { id: '13', name: 'Wipro Foundation', type: 'placement', stage: 'proposal_sent', pipeline_value: 1800000, website: 'https://www.wipro.com', description: 'Proposal for inclusive hiring pathway. 20 placement slots for NavGurukul graduates in FY27.', assigned_to: '2', next_followup: '2026-04-13', created_at: '2026-02-10T10:00:00Z', updated_at: '2026-03-20T10:00:00Z' },
  { id: '14', name: 'Infosys BPM', type: 'placement', stage: 'active_partner', pipeline_value: 1200000, website: 'https://www.infosysbpm.com', description: 'Active placement partner. 15 graduates placed in FY26. Discussing expansion to 30 slots.', assigned_to: '1', next_followup: '2026-04-22', created_at: '2025-05-01T10:00:00Z', updated_at: '2026-03-18T10:00:00Z' },
  { id: '15', name: 'Bihar Education Project Council', type: 'government', stage: 'lead', pipeline_value: 1500000, website: 'https://bepc.bihar.gov.in', description: 'Initial outreach for NAVigo AI career guidance tool deployment in Bihar government schools.', assigned_to: '1', next_followup: '2026-04-19', created_at: '2026-03-30T10:00:00Z', updated_at: '2026-03-30T10:00:00Z' },
  { id: '16', name: 'Sinch', type: 'corporate', stage: 'closed', pipeline_value: 800000, website: 'https://www.sinch.com', description: 'Previous CSR partner. Partnership concluded after successful funding cycle for Zuvy platform.', assigned_to: '2', next_followup: null, created_at: '2024-06-01T10:00:00Z', updated_at: '2025-12-31T10:00:00Z' },
];

let contacts = [
  { id: '1', partner_id: '1', name: 'Safeena Husain', email: 'safeena@educategirls.ngo', phone: '+91-98765-43210', designation: 'Founder & CEO', is_primary: true, created_at: '2025-06-10T10:00:00Z' },
  { id: '2', partner_id: '2', name: 'Rukmini Banerji', email: 'rukmini@pratham.org', phone: '+91-98765-43211', designation: 'CEO', is_primary: true, created_at: '2025-03-15T09:00:00Z' },
  { id: '3', partner_id: '3', name: 'Priya Sharma', email: 'priya.sharma@amazon.com', phone: '+91-98765-43212', designation: 'CSR Head - India', is_primary: true, created_at: '2024-11-01T10:00:00Z' },
  { id: '4', partner_id: '3', name: 'Amit Verma', email: 'amit.verma@amazon.com', phone: '+91-98765-43213', designation: 'Program Manager', is_primary: false, created_at: '2025-01-15T10:00:00Z' },
  { id: '5', partner_id: '4', name: 'Deepa Krishnan', email: 'deepa.k@accenture.com', phone: '+91-98765-43214', designation: 'CSR Director', is_primary: true, created_at: '2026-01-15T10:00:00Z' },
  { id: '6', partner_id: '5', name: 'Rajeev Menon', email: 'rajeev.menon@kpmg.com', phone: '+91-98765-43215', designation: 'Partner - CSR', is_primary: true, created_at: '2026-02-01T10:00:00Z' },
  { id: '7', partner_id: '6', name: 'Ananya Birla', email: 'ananya@microsoft.com', phone: '+91-98765-43216', designation: 'Philanthropies Lead', is_primary: true, created_at: '2025-01-10T10:00:00Z' },
  { id: '8', partner_id: '9', name: 'Dr. Suresh Kumar', email: 'suresh.k@rajasthan.gov.in', phone: '+91-98765-43217', designation: 'Director of Education', is_primary: true, created_at: '2026-01-20T10:00:00Z' },
  { id: '9', partner_id: '10', name: 'Neha Patel', email: 'neha.patel@cgsda.in', phone: '+91-98765-43218', designation: 'Program Coordinator', is_primary: true, created_at: '2025-08-01T10:00:00Z' },
  { id: '10', partner_id: '14', name: 'Vikram Singh', email: 'vikram.s@infosysbpm.com', phone: '+91-98765-43219', designation: 'Talent Acquisition Lead', is_primary: true, created_at: '2025-05-01T10:00:00Z' },
];

let activities = [
  { id: '1', partner_id: '3', user_id: '1', type: 'meeting', title: 'Quarterly review meeting', description: 'Discussed FY27 CSR budget allocation and internship program expansion. Amazon keen on increasing slots from 20 to 35.', created_at: '2026-03-28T10:00:00Z' },
  { id: '2', partner_id: '3', user_id: '1', type: 'email', title: 'Sent updated proposal', description: 'Shared revised proposal with expanded scope including AI Learning Labs partnership.', created_at: '2026-03-25T14:00:00Z' },
  { id: '3', partner_id: '4', user_id: '2', type: 'call', title: 'Follow-up call with Deepa', description: 'Deepa confirmed internal approvals are in progress. Expected decision by mid-April.', created_at: '2026-03-30T11:00:00Z' },
  { id: '4', partner_id: '5', user_id: '2', type: 'meeting', title: 'Initial presentation to KPMG CSR team', description: 'Presented Zuvy platform capabilities. Team showed strong interest in women-in-tech focus.', created_at: '2026-03-20T10:00:00Z' },
  { id: '5', partner_id: '9', user_id: '1', type: 'note', title: 'MOU draft prepared', description: 'Legal team has prepared the MOU draft. Awaiting review from Rajasthan education department.', created_at: '2026-03-22T10:00:00Z' },
  { id: '6', partner_id: '1', user_id: '1', type: 'stage_change', title: 'Moved to Active Partner', description: 'Partnership formalized after successful pilot. Educate Girls will mobilize 200+ students annually.', created_at: '2025-09-15T10:00:00Z' },
  { id: '7', partner_id: '7', user_id: '2', type: 'email', title: 'Introductory email sent', description: 'Sent introduction and NavGurukul impact deck to Salesforce.org India team.', created_at: '2026-03-01T10:00:00Z' },
  { id: '8', partner_id: '12', user_id: '1', type: 'note', title: 'Research complete', description: 'Identified TCS Foundation as high-potential CSR partner. They funded similar ed-tech programs. Preparing outreach.', created_at: '2026-03-28T10:00:00Z' },
  { id: '9', partner_id: '6', user_id: '1', type: 'meeting', title: 'Azure credits renewal discussion', description: 'Microsoft confirmed renewal of Azure credits for another year. Exploring GitHub Education integration.', created_at: '2026-03-10T09:00:00Z' },
  { id: '10', partner_id: '13', user_id: '2', type: 'email', title: 'Proposal submitted to Wipro', description: 'Submitted inclusive hiring proposal with graduate profiles and placement success stories.', created_at: '2026-03-15T10:00:00Z' },
  { id: '11', partner_id: '10', user_id: '2', type: 'followup', title: 'Quarterly impact report sent', description: 'Sent Q3 impact report showing 45 women trained and 28 placed in jobs through SOSC Raipur.', created_at: '2026-03-15T10:00:00Z' },
  { id: '12', partner_id: '14', user_id: '1', type: 'stage_change', title: 'Partnership renewed for FY27', description: 'Infosys BPM confirmed 30 placement slots for FY27, up from 15 in FY26.', created_at: '2026-03-18T10:00:00Z' },
];

let followups = [
  { id: '1', partner_id: '12', user_id: '1', due_date: '2026-04-07', title: 'Send intro email to TCS Foundation', description: 'Prepare and send introductory email with impact deck and Sama program details.', is_completed: false, created_at: '2026-03-28T10:00:00Z' },
  { id: '2', partner_id: '4', user_id: '2', due_date: '2026-04-08', title: 'Check Accenture proposal status', description: 'Follow up with Deepa on internal approval progress for CSR partnership.', is_completed: false, created_at: '2026-03-30T11:00:00Z' },
  { id: '3', partner_id: '7', user_id: '2', due_date: '2026-04-09', title: 'Schedule call with Salesforce.org', description: 'Set up discovery call to present AI Learning Labs and discuss potential partnership.', is_completed: false, created_at: '2026-03-30T15:00:00Z' },
  { id: '4', partner_id: '3', user_id: '1', due_date: '2026-04-10', title: 'Send Amazon revised proposal', description: 'Finalize and send the revised proposal with expanded AI Labs component.', is_completed: false, created_at: '2026-03-28T10:00:00Z' },
  { id: '5', partner_id: '8', user_id: '1', due_date: '2026-04-11', title: 'Follow up with Magic Bus', description: 'Check interest in student mobilization pilot for Bangalore campus.', is_completed: false, created_at: '2026-03-30T15:00:00Z' },
  { id: '6', partner_id: '5', user_id: '2', due_date: '2026-04-12', title: 'Send Zuvy demo to KPMG', description: 'Share Zuvy platform demo link and student success stories with KPMG team.', is_completed: false, created_at: '2026-03-28T14:00:00Z' },
  { id: '7', partner_id: '9', user_id: '1', due_date: '2026-04-14', title: 'Follow up on MOU review', description: 'Check with Rajasthan education dept on MOU draft review status.', is_completed: false, created_at: '2026-03-22T10:00:00Z' },
  { id: '8', partner_id: '1', user_id: '1', due_date: '2026-04-15', title: 'Quarterly sync with Educate Girls', description: 'Review student mobilization numbers for Q1 and plan Q2 targets.', is_completed: false, created_at: '2026-03-20T14:30:00Z' },
];

let profiles = [
  { id: '1', full_name: 'Abhishek Gupta', role: 'admin', avatar_url: null, created_at: '2024-01-01T10:00:00Z' },
  { id: '2', full_name: 'Rishabh Verma', role: 'member', avatar_url: null, created_at: '2024-06-01T10:00:00Z' },
];

// Demo data API
let nextId = 100;
const genId = () => String(++nextId);

export const demoStore = {
  // Partners
  getPartners: () => [...partners],
  getPartner: (id) => partners.find(p => p.id === id) || null,
  createPartner: (data) => {
    const partner = { id: genId(), ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    partners = [partner, ...partners];
    return partner;
  },
  updatePartner: (id, data) => {
    partners = partners.map(p => p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p);
    return partners.find(p => p.id === id);
  },
  deletePartner: (id) => {
    partners = partners.filter(p => p.id !== id);
    contacts = contacts.filter(c => c.partner_id !== id);
    activities = activities.filter(a => a.partner_id !== id);
    followups = followups.filter(f => f.partner_id !== id);
  },

  // Contacts
  getContacts: () => [...contacts],
  getContactsByPartner: (partnerId) => contacts.filter(c => c.partner_id === partnerId),
  createContact: (data) => {
    const contact = { id: genId(), ...data, created_at: new Date().toISOString() };
    contacts = [contact, ...contacts];
    return contact;
  },
  updateContact: (id, data) => {
    contacts = contacts.map(c => c.id === id ? { ...c, ...data } : c);
    return contacts.find(c => c.id === id);
  },
  deleteContact: (id) => {
    contacts = contacts.filter(c => c.id !== id);
  },

  // Activities
  getActivities: () => [...activities].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
  getActivitiesByPartner: (partnerId) => activities.filter(a => a.partner_id === partnerId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
  createActivity: (data) => {
    const activity = { id: genId(), ...data, created_at: new Date().toISOString() };
    activities = [activity, ...activities];
    return activity;
  },

  // Follow-ups
  getFollowups: () => [...followups].sort((a, b) => new Date(a.due_date) - new Date(b.due_date)),
  getFollowupsByPartner: (partnerId) => followups.filter(f => f.partner_id === partnerId).sort((a, b) => new Date(a.due_date) - new Date(b.due_date)),
  toggleFollowup: (id) => {
    followups = followups.map(f => f.id === id ? { ...f, is_completed: !f.is_completed } : f);
    return followups.find(f => f.id === id);
  },
  createFollowup: (data) => {
    const followup = { id: genId(), ...data, is_completed: false, created_at: new Date().toISOString() };
    followups = [followup, ...followups];
    return followup;
  },

  // Profiles
  getProfiles: () => [...profiles],
  getProfile: (id) => profiles.find(p => p.id === id) || profiles[0],
  getCurrentUser: () => profiles[0],

  // Stats
  getStats: () => {
    const active = partners.filter(p => p.stage !== 'closed');
    const totalValue = active.reduce((sum, p) => sum + (p.pipeline_value || 0), 0);
    const today = new Date().toISOString().split('T')[0];
    const dueTodayCount = followups.filter(f => f.due_date === today && !f.is_completed).length;
    const overdueCount = followups.filter(f => f.due_date < today && !f.is_completed).length;
    return {
      totalPartners: partners.length,
      activePartners: partners.filter(p => p.stage === 'active_partner').length,
      totalPipelineValue: totalValue,
      followupsDueToday: dueTodayCount,
      overdueFollowups: overdueCount,
      partnersByType: TYPES.map(t => ({ type: t, count: partners.filter(p => p.type === t).length })),
      partnersByStage: STAGES.map(s => ({ stage: s, count: partners.filter(p => p.stage === s).length })),
    };
  },

  STAGES,
  TYPES,
};
