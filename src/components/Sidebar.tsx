import { LayoutDashboard, Users, CalendarDays, Activity, Settings } from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700 shrink-0">
            SJ
          </div>
          <div className="text-left overflow-hidden">
            <div className="text-sm font-medium truncate">Sarah Jenkins</div>
            <div className="text-xs text-gray-500 truncate">Athletic Director</div>
          </div>
        </div>
      </div>
    </div>
  );
};
