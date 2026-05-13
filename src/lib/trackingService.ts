import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface VisitorSession {
  id: string;
  name?: string;
  email?: string;
  lastVisit: string;
  sessionStart: string;
  durationMinutes: number;
  pageViews: number;
  visitedProperties: {
    id: string;
    title: string;
    timestamp: string;
    duration?: number; // duration in seconds
  }[];
  interests: string[];
  browser: string;
}

const ANALYTICS_KEY = 'igo.analytics.visitors';
let lastWriteTime = 0;
const WRITE_DEBOUNCE = 2000;

const persistVisitors = async (visitors: VisitorSession[]) => {
  const now = Date.now();
  
  // Local persistence for fallback
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(visitors));
  
  if (!isSupabaseConfigured) return;

  // Global persistence in Supabase
  if (now - lastWriteTime < WRITE_DEBOUNCE) return;
  lastWriteTime = now;

  const currentSession = visitors[0]; // Most recent is usually first due to trackVisit sort
  if (!currentSession) return;

  try {
    const { error } = await supabase
      .from('visitors')
      .upsert([{
        id: currentSession.id,
        name: currentSession.name,
        email: currentSession.email,
        last_visit: currentSession.lastVisit,
        session_start: currentSession.sessionStart,
        duration_minutes: currentSession.durationMinutes,
        page_views: currentSession.pageViews,
        visited_properties: currentSession.visitedProperties,
        interests: currentSession.interests,
        browser: currentSession.browser,
        updated_at: new Date().toISOString()
      }], { onConflict: 'id' });
      
    if (error) console.warn('Supabase analytics sync failed:', error.message);
  } catch (err) {
    console.warn('Analytics sync error:', err);
  }
};

export const trackVisit = (property?: { id: string; title: string }) => {
  if (typeof window === 'undefined') return;

  const sessionId = localStorage.getItem('igo.analytics.sessionId') || Math.random().toString(36).substring(7);
  localStorage.setItem('igo.analytics.sessionId', sessionId);

  const visitors = getVisitors();
  let visitor = visitors.find(v => v.id === sessionId);

  if (!visitor) {
    const now = new Date().toISOString();
    visitor = {
       id: sessionId,
       lastVisit: now,
       sessionStart: now,
       durationMinutes: 0,
       pageViews: 0,
       visitedProperties: [],
       interests: [],
       browser: navigator.userAgent
     };
    visitors.push(visitor);
  }

  visitor.pageViews += 1;
  visitor.lastVisit = new Date().toISOString();
  
  const start = new Date(visitor.sessionStart).getTime();
  const now = new Date().getTime();
  visitor.durationMinutes = Math.round((now - start) / 60000);

  if (property) {
    if (!visitor.visitedProperties) visitor.visitedProperties = [];
    const alreadyVisited = visitor.visitedProperties.find(p => p.id === property.id);
    if (!alreadyVisited || (Date.now() - new Date(alreadyVisited.timestamp).getTime() > 3600000)) {
      visitor.visitedProperties.unshift({
        ...property,
        timestamp: new Date().toISOString(),
        duration: 0
      });
    }
  }

  const trimmedVisitors = visitors.sort((a, b) => 
    new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
  ).slice(0, 50);

  persistVisitors(trimmedVisitors);
};

export const getVisitors = (): VisitorSession[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    
    return parsed.map(v => ({
      ...v,
      visitedProperties: Array.isArray(v.visitedProperties) ? v.visitedProperties : [],
      interests: Array.isArray(v.interests) ? v.interests : []
    }));
  } catch (e) {
    return [];
  }
};

export const fetchAllVisitors = async (): Promise<VisitorSession[]> => {
  if (!isSupabaseConfigured) return getVisitors();

  try {
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .order('last_visit', { ascending: false })
      .limit(100);

    if (error) throw error;
    
    return (data || []).map(v => ({
      id: v.id,
      name: v.name,
      email: v.email,
      lastVisit: v.last_visit,
      sessionStart: v.session_start,
      durationMinutes: v.duration_minutes,
      pageViews: v.page_views,
      visitedProperties: v.visited_properties || [],
      interests: v.interests || [],
      browser: v.browser
    }));
  } catch (err) {
    console.warn('Failed to fetch global visitors:', err);
    return getVisitors();
  }
};

export const updateVisitDuration = (propertyId: string, durationInSeconds: number) => {
  if (typeof window === 'undefined') return;
  const sessionId = localStorage.getItem('igo.analytics.sessionId');
  if (!sessionId) return;

  const visitors = getVisitors();
  const visitor = visitors.find(v => v.id === sessionId);
  if (visitor) {
    const prop = visitor.visitedProperties.find(p => p.id === propertyId);
    if (prop) {
      prop.duration = (prop.duration || 0) + durationInSeconds;
      persistVisitors(visitors);
    }
  }
};

export const addInterest = (interest: string) => {
   if (typeof window === 'undefined') return;
   const sessionId = localStorage.getItem('igo.analytics.sessionId');
   if (!sessionId) return;

   const visitors = getVisitors();
   const visitor = visitors.find(v => v.id === sessionId);
    if (visitor) {
      if (!visitor.interests) visitor.interests = [];
      if (!visitor.interests.includes(interest)) {
       visitor.interests.push(interest);
     }
     persistVisitors(visitors);
   }
 };

 export const identifyVisitor = (name: string, email: string) => {
  if (typeof window === 'undefined') return;
  const sessionId = localStorage.getItem('igo.analytics.sessionId');
  if (!sessionId) return;

  const visitors = getVisitors();
  const visitor = visitors.find(v => v.id === sessionId);
  if (visitor) {
    visitor.name = name;
    visitor.email = email;
    persistVisitors(visitors);
  }
};
