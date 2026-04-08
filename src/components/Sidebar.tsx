import { LayoutDashboard, Users, CalendarDays, Activity, Settings, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../AuthContext';

export const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const { user, login, logout } = useAuth();
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'students', icon: Users, label: 'Groups' },
    { id: 'logistics', icon: CalendarDays, label: 'Logistics' },
    { id: 'medical', icon: Activity, label: 'Medical' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-full text-gray-900 shrink-0">
      <div className="p-6">
        <div className="text-2xl font-bold tracking-tight mb-8">APEX</div>
        <div className="space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-auto p-6 border-t border-gray-200">
        {user ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-10 h-10 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-sm font-bold text-blue-600 shrink-0">
                  {user.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
              )}
              <div className="text-left overflow-hidden">
                <div className="text-sm font-medium truncate text-gray-900">{user.displayName}</div>
                <div className="text-[10px] text-gray-500 truncate">{user.email}</div>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 text-xs text-gray-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={login}
            className="flex items-center gap-3 w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            <LogIn className="w-5 h-5" />
            <span className="text-sm font-medium">Sign In</span>
          </button>
        )}
      </div>
    </div>
  );
};
