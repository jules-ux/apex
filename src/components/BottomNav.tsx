import { LayoutDashboard, Users, CalendarDays, Activity, Settings } from 'lucide-react';

export const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'students', icon: Users, label: 'Groups' },
    { id: 'logistics', icon: CalendarDays, label: 'Logistics' },
    { id: 'medical', icon: Activity, label: 'Medical' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="md:hidden flex bg-white border-t border-gray-200 pb-safe pt-2 px-2 justify-between z-50 relative">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center w-full py-1 ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-900'}`}
          >
            <Icon className="w-6 h-6 mb-1" strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
