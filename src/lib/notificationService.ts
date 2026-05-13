export interface Notification {
  id: string;
  title: string;
  sender: string;
  date: string;
  preview: string;
  read: boolean;
  type: 'update' | 'alert' | 'system';
}

const NOTIFICATIONS_KEY = 'igo.notifications';

export const getNotifications = (): Notification[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(NOTIFICATIONS_KEY);
  return raw ? JSON.parse(raw) : [
    { 
      id: 'welcome', 
      title: 'Welcome to IGO Agriestates', 
      sender: 'IGO Team', 
      date: new Date().toLocaleDateString(), 
      preview: 'Welcome to the premium agricultural estate network. Your account is now active.', 
      read: false,
      type: 'system'
    }
  ];
};

export const addNotification = (title: string, sender: string, preview: string, type: Notification['type'] = 'update') => {
  if (typeof window === 'undefined') return;
  const notifications = getNotifications();
  const newNotification: Notification = {
    id: `notif-${Date.now()}`,
    title,
    sender,
    date: new Date().toLocaleDateString(),
    preview,
    read: false,
    type
  };
  notifications.unshift(newNotification);
  // Keep last 20 notifications
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications.slice(0, 20)));
  
  // Trigger event for real-time updates in open tabs
  window.dispatchEvent(new Event('igo.notifications_updated'));
};

export const markAsRead = (id: string) => {
  const notifications = getNotifications();
  const index = notifications.findIndex(n => n.id === id);
  if (index !== -1) {
    notifications[index].read = true;
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    window.dispatchEvent(new Event('igo.notifications_updated'));
  }
};

export const markAllAsRead = () => {
  const notifications = getNotifications().map(n => ({ ...n, read: true }));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  window.dispatchEvent(new Event('igo.notifications_updated'));
};
