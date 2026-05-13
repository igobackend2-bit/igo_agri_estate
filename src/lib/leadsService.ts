import { isSupabaseConfigured, supabase, directPostgREST } from './supabaseClient';
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
  customTime?: string;
}

const demoLeads: LeadData[] = [
   {
     id: '1',
     created_at: new Date(Date.now() - 3600000).toISOString(),
     name: 'Arjun Mehta',
     phone: '+91 98400 11234',
     email: 'arjun.mehta@gmail.com',
     type: 'visit',
     property_title: 'Mahabalipuram Premium Teak Estate',
     property_id: 'mahabalipuram-teak-estate',
     asset_category: 'Plantation',
     preferred_state: 'Tamil Nadu',
     investment_size: '2.8',
     notes: 'Interested in 5-acre teak plantation. Wants site visit next week.'
   },
   {
     id: '2',
     created_at: new Date(Date.now() - 86400000).toISOString(),
     name: 'Priya Krishnamurthy',
     phone: '+91 97890 55321',
     email: 'priya.k@yahoo.com',
     type: 'callback',
     property_title: 'Polyhouse Protected Farm',
     property_id: 'mahabalipuram-polyhouse',
     asset_category: 'Protected',
     preferred_state: 'Karnataka',
     investment_size: '1.2',
     preferred_date: '2026-05-20',
     preferred_time: 'Morning (9AM - 12PM)',
     notes: 'Callback requested after initial inquiry about polyhouse options.'
   },
   {
     id: '3',
     created_at: new Date(Date.now() - 172800000).toISOString(),
     name: 'Rajesh Iyer',
     phone: '+91 99001 77865',
     email: 'rajesh.iyer@mail.com',
     type: 'offer',
     property_title: 'Chennai Hi-Tech Vertical Farm',
     property_id: 'chennai-vertical-farm',
     asset_category: 'Urban Farm',
     offer_amount: 4500000,
     preferred_state: 'Tamil Nadu',
     notes: 'Submitted offer of ₹45L for vertical farm unit.'
   },
   {
     id: '4',
     created_at: new Date(Date.now() - 259200000).toISOString(),
     name: 'Sunita Verma',
     phone: '+91 98765 43210',
     email: 'sunita.verma@corp.in',
     type: 'requirement',
     asset_category: 'Horticulture',
     preferred_state: 'Maharashtra',
     investment_size: '5.5',
     notes: 'Looking for 5+ acre horticulture farm in Maharashtra with drip irrigation.'
   },
   {
     id: '5',
     created_at: new Date(Date.now() - 345600000).toISOString(),
     name: 'Karthik Balasubramaniam',
     phone: '+91 94440 12345',
     email: 'karthik.b@investor.in',
     type: 'contact',
     property_title: 'Maduranthagam Mango Orchard',
     property_id: 'mahabalipuram-mango-orchard',
     asset_category: 'Horticulture',
     preferred_state: 'Tamil Nadu',
     investment_size: '3.2',
     notes: 'General inquiry about mango orchard returns and maintenance.'
   },
   {
     id: '6',
     created_at: new Date(Date.now() - 432000000).toISOString(),
     name: 'Meena Shankar',
     phone: '+91 96000 98765',
     email: 'meena.s@nri.com',
     type: 'visit',
     property_title: 'Kanchipuram Polyhouse Estate',
     property_id: 'kanchipuram-silk-silk-cotton',
     asset_category: 'Protected',
     preferred_state: 'Tamil Nadu',
     investment_size: '2.1',
     preferred_date: '2026-05-25',
     preferred_time: 'Custom',
     customTime: '10:00 AM',
     notes: 'NRI investor interested in visiting protected cultivation estate.'
   }
 ];

const demoLeadIds = new Set(demoLeads.map((lead) => lead.id));
const isDemoLead = (lead: LeadData) =>
  (!!lead.id && demoLeadIds.has(lead.id)) ||
  demoLeads.some((demo) => demo.name === lead.name && demo.phone === lead.phone);

export const submitLead = async (leadData: LeadData) => {
  const payload: any = { ...leadData, created_at: new Date().toISOString() };
  
  if (!isSupabaseConfigured) {
    addLocalLead(leadData, []);
    return { success: true, mocked: true };
  }

  // Try direct insert via REST for speed and reliability
  const { data, error } = await directPostgREST('leads', 'POST', payload);

  if (error) {
    console.warn('Direct lead submission failed, trying fallback:', error.message);
    
    // If it's a schema mismatch (missing column), try moving everything to notes
    const isSchemaError = error.message?.toLowerCase().includes('column') || 
                          error.message?.toLowerCase().includes('find') ||
                          error.message?.toLowerCase().includes('timeout');

    if (isSchemaError) {
      const simplifiedPayload: any = {
        name: leadData.name,
        phone: leadData.phone,
        email: leadData.email,
        created_at: new Date().toISOString(),
        notes: `${leadData.notes || ''}\n[RECOVERY-DATA]: ${JSON.stringify(leadData)}`.trim()
      };
      
      const retry = await directPostgREST('leads', 'POST', simplifiedPayload);
      if (!retry.error) return { success: true, data: retry.data };
    }

    addLocalLead(leadData, []);
    return { success: false, error: error.message || 'Saved locally (Cloud Timeout)' };
  }

  return { success: true, data };
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
