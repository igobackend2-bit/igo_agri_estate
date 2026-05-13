import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Settings, 
  LogOut, 
  User, 
  ChevronRight,
  LandPlot
} from 'lucide-react';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { label: 'Add Estate', icon: <PlusCircle size={20} />, path: '/admin/new' },
    { label: 'User Profile', icon: <User size={20} />, path: '/admin/profile' },
    { label: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 pt-20">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-black/5 hidden md:flex flex-col fixed h-[calc(100vh-80px)] top-20">
        <div className="p-6 flex-grow">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                  location.pathname === item.path 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-text-muted hover:bg-black/5 hover:text-primary'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span className="font-semibold">{item.label}</span>
                </div>
                {location.pathname === item.path && <ChevronRight size={16} />}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-black/5">
          <div className="flex items-center space-x-3 mb-6 p-2">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.email}</p>
              <p className="text-xs text-text-muted capitalize">Administrator</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 p-4 rounded-2xl text-red-600 hover:bg-red-50 transition-colors font-semibold"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow md:ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
