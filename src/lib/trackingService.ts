export interface VisitorSession {
  id: string;
  name?: string;
  email?: string;
  lastVisit: string;
  pageViews: number;
  visitedProperties: {
    id: string;
    title: string;
    timestamp: string;
  }[];
  browser: string;
}

const ANALYTICS_KEY = 'igo.analytics.visitors';

export const trackVisit = (property?: { id: string; title: string }) => {
  if (typeof window === 'undefined') return;

  const sessionId = localStorage.getItem('igo.analytics.sessionId') || Math.random().toString(36).substring(7);
  localStorage.setItem('igo.analytics.sessionId', sessionId);

  const visitors = getVisitors();
  let visitor = visitors.find(v => v.id === sessionId);

  if (!visitor) {
    visitor = {
      id: sessionId,
      lastVisit: new Date().toISOString(),
      pageViews: 0,
      visitedProperties: [],
      browser: navigator.userAgent
    };
    visitors.push(visitor);
  }

  visitor.pageViews += 1;
  visitor.lastVisit = new Date().toISOString();

  if (property) {
    // Avoid duplicates in the same session for the same property within a short time
    const alreadyVisited = visitor.visitedProperties.find(p => p.id === property.id);
    if (!alreadyVisited || (Date.now() - new Date(alreadyVisited.timestamp).getTime() > 3600000)) {
      visitor.visitedProperties.unshift({
        ...property,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Keep only last 50 visitors for localStorage limits
  const trimmedVisitors = visitors.sort((a, b) => 
    new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
  ).slice(0, 50);

  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(trimmedVisitors));
};

export const getVisitors = (): VisitorSession[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(ANALYTICS_KEY);
  return raw ? JSON.parse(raw) : [];
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
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(visitors));
  }
};
