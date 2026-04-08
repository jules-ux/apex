import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { TopSchoolSelector } from './components/TopSchoolSelector';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminStudents } from './components/AdminStudents';
import { AdminLogistics } from './components/AdminLogistics';
import { AdminMedical } from './components/AdminMedical';
import { AdminSettings } from './components/AdminSettings';
import { StudentOnboarding } from './components/StudentOnboarding';
import { CommandPalette } from './components/CommandPalette';

import { AuthProvider } from './AuthContext';
import { SchoolProvider } from './SchoolContext';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sync tab with URL
  useEffect(() => {
    const path = location.pathname.substring(1);
    if (['dashboard', 'students', 'logistics', 'medical', 'settings'].includes(path)) {
      setActiveTab(path);
    }
  }, [location]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  const isOnboarding = location.pathname === '/onboarding';

  if (isOnboarding) {
    return <StudentOnboarding />;
  }

  return (
    <div className="h-full w-full bg-gray-50 flex font-sans overflow-hidden relative">
      <CommandPalette setActiveTab={handleTabChange} />
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
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
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col overflow-hidden h-full"
          >
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/students" element={<AdminStudents />} />
              <Route path="/logistics" element={<AdminLogistics />} />
              <Route path="/medical" element={<AdminMedical />} />
              <Route path="/settings" element={<AdminSettings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>

        <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SchoolProvider>
        <Router>
          <AppContent />
        </Router>
      </SchoolProvider>
    </AuthProvider>
  );
}
