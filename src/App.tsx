import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { TopSchoolSelector } from './components/TopSchoolSelector';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminStudents } from './components/AdminStudents';
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
          {activeTab === 'students' && <AdminStudents />}
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 z-50 pt-6 pl-4 md:pl-8 pr-4 md:pr-8 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
            <div id="top-left-portal" className="flex items-center gap-3 empty:hidden"></div>
            <TopSchoolSelector />
          </div>
          <div className="flex items-center gap-3 pointer-events-auto">
            <div id="top-right-portal" className="flex items-center gap-3 empty:hidden"></div>
          </div>
        </div>
        {renderContent()}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
