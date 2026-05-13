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
  let retryCount = 0;
  const maxRetries = 5;

  while (retryCount < maxRetries) {
    try {
      if (!isSupabaseConfigured) {
        addLocalLead(leadData, []);
        return { success: true, mocked: true };
      }

      const { data, error } = await supabase
        .from('leads')
        .insert([payload])
        .select();
      
      if (error) throw error;
      return { success: true, data };

    } catch (err: any) {
      console.error(`Lead submission attempt ${retryCount + 1} failed:`, err);
      
      // Check if error is "Column not found"
      const isMissingColumn = err.code === 'PGRST204' || 
                              err.message?.toLowerCase().includes('could not find') || 
                              err.message?.toLowerCase().includes('column') ||
                              err.code === '42703';

      if (isMissingColumn && retryCount < maxRetries - 1) {
        // More robust regex to find the missing column name
        const match = err.message?.match(/column ['"]?(.+?)['"]? (of|in|does)/i);
        const missingColumn = match ? match[1] : null;

        if (missingColumn && payload[missingColumn] !== undefined) {
          console.warn(`Auto-Fix: Moving missing column '${missingColumn}' to notes.`);
          const value = payload[missingColumn];
          payload.notes = `${payload.notes || ''}\n[Auto-Field: ${missingColumn}]: ${value}`.trim();
          delete payload[missingColumn];
          retryCount++;
          continue;
        } else {
          // Absolute fallback: move ALL non-essential fields to notes
          console.warn('Auto-Fix: Aggressive schema fallback triggered.');
          const essential = ['name', 'phone', 'email', 'created_at', 'notes'];
          Object.keys(payload).forEach(key => {
            if (!essential.includes(key)) {
              payload.notes = `${payload.notes || ''}\n[Field: ${key}]: ${payload[key]}`.trim();
              delete payload[key];
            }
          });
          retryCount++;
          continue;
        }
      }

      console.error('Final Lead submission failure:', err.message);
      addLocalLead(leadData, []);
      return { success: false, error: err.message || 'Database sync failed. Saved locally.' };
    }
  }
  return { success: false, error: 'Maximum retries exceeded.' };
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
