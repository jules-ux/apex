import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { DynamicNotch } from './components/DynamicNotch';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminRoster } from './components/AdminRoster';
import { AdminLogistics } from './components/AdminLogistics';
import { AdminMedical } from './components/AdminMedical';
import { AdminSettings } from './components/AdminSettings';
import { CommandPalette } from './components/CommandPalette';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col overflow-hidden h-full"
        >
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'roster' && <AdminRoster />}
          {activeTab === 'logistics' && <AdminLogistics />}
          {activeTab === 'medical' && <AdminMedical />}
          {activeTab === 'settings' && <AdminSettings />}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="h-full w-full bg-gray-50 flex font-sans overflow-hidden relative">
      <CommandPalette setActiveTab={setActiveTab} />
      <DynamicNotch activeTab={activeTab} />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {renderContent()}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
