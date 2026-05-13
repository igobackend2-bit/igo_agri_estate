import { isSupabaseConfigured, supabase } from './supabaseClient';
import { addLocalLead, getLocalLeads, saveLocalLeads } from './localSync';

export interface LeadData {
  id?: string;
  created_at?: string;
  name: string;
  phone: string;
  email?: string;
  type: 'visit' | 'offer' | 'callback' | 'requirement' | 'contact';
  property_id?: string;
  property_title?: string;
  offer_amount?: number;
  preferred_date?: string;
  preferred_time?: string;
  asset_category?: string;
  preferred_state?: string;
  investment_size?: string;
  location?: string;
  budget?: string;
  size?: string;
  intent?: string;
  notes?: string;
  landType?: string;
  waterSource?: string;
  powerAccess?: string;
  estateCategory?: string;
}

const demoLeads: LeadData[] = [
  { id: '1', created_at: new Date(Date.now() - 3600000).toISOString(), name: 'Arjun Mehta', phone: '+91 98400 11234', email: 'arjun.mehta@gmail.com', type: 'visit', property_title: 'Mahabalipuram Premium Teak Estate', asset_category: 'Plantation', preferred_state: 'Tamil Nadu', investment_size: '2.8' },
  { id: '2', created_at: new Date(Date.now() - 86400000).toISOString(), name: 'Priya Krishnamurthy', phone: '+91 97890 55321', email: 'priya.k@yahoo.com', type: 'callback', property_title: 'Polyhouse Protected Farm', asset_category: 'Protected', preferred_state: 'Karnataka', investment_size: '1.2' },
  { id: '3', created_at: new Date(Date.now() - 172800000).toISOString(), name: 'Rajesh Iyer', phone: '+91 99001 77865', type: 'offer', property_title: 'Chennai Hi-Tech Vertical Farm', asset_category: 'Urban Farm', offer_amount: 4500000, preferred_state: 'Tamil Nadu' },
  { id: '4', created_at: new Date(Date.now() - 259200000).toISOString(), name: 'Sunita Verma', phone: '+91 98765 43210', email: 'sunita.verma@corp.in', type: 'requirement', asset_category: 'Horticulture', preferred_state: 'Maharashtra', investment_size: '5.5' },
  { id: '5', created_at: new Date(Date.now() - 345600000).toISOString(), name: 'Karthik Balasubramaniam', phone: '+91 94440 12345', type: 'contact', property_title: 'Maduranthagam Mango Orchard', asset_category: 'Horticulture', preferred_state: 'Tamil Nadu', investment_size: '3.2' },
  { id: '6', created_at: new Date(Date.now() - 432000000).toISOString(), name: 'Meena Shankar', phone: '+91 96000 98765', email: 'meena.s@nri.com', type: 'visit', property_title: 'Kanchipuram Polyhouse Estate', asset_category: 'Protected', preferred_state: 'Tamil Nadu', investment_size: '2.1' },
];

const demoLeadIds = new Set(demoLeads.map((lead) => lead.id));
const isDemoLead = (lead: LeadData) =>
  (!!lead.id && demoLeadIds.has(lead.id)) ||
  demoLeads.some((demo) => demo.name === lead.name && demo.phone === lead.phone);

export const submitLead = async (leadData: LeadData) => {
  try {
    if (!isSupabaseConfigured) {
      addLocalLead(leadData, []);
      return { success: true, mocked: true };
    }
    const { data, error } = await supabase
      .from('leads')
      .insert([{ ...leadData, created_at: new Date().toISOString() }])
      .select();
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.warn('Lead submission to Supabase failed, using fallback:', err.message);
    addLocalLead(leadData, []);
    return { success: true, mocked: true };
  }
};

export const fetchLeads = async (): Promise<LeadData[]> => {
  try {
    if (!isSupabaseConfigured) {
      const liveLeads = getLocalLeads([]).filter((lead) => !isDemoLead(lead));
      saveLocalLeads(liveLeads);
      return liveLeads;
    }
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return data || [];
  } catch (err: any) {
    console.warn('Leads fetch failed, using local live leads:', err.message);
    const liveLeads = getLocalLeads([]).filter((lead) => !isDemoLead(lead));
    saveLocalLeads(liveLeads);
    return liveLeads;
  }
};
