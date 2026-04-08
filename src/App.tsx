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
import { LoginPage } from './components/LoginPage';
import { ParentPortal } from './components/ParentPortal';

import { AuthProvider, useAuth } from './AuthContext';
import { SchoolProvider } from './SchoolContext';

const AppContent = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.email === 'jules_stoop@icloud.com';
  const [activeTab, setActiveTab] = useState(isAdmin ? 'dashboard' : 'parent');

  // Sync tab with URL
  useEffect(() => {
    const path = location.pathname.substring(1);
    if (['dashboard', 'students', 'logistics', 'medical', 'settings', 'parent'].includes(path)) {
      setActiveTab(path);
    }
  }, [location]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  // Global loading state for fast initial load experience
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // If not logged in and not on login page, redirect to login
  if (!user && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  // Protect admin routes
  const adminRoutes = ['/dashboard', '/students', '/logistics', '/medical'];
  if (user && !isAdmin && adminRoutes.includes(location.pathname)) {
    return <Navigate to="/parent" replace />;
  }

  const isOnboarding = location.pathname === '/onboarding';

  if (isOnboarding) {
    return <StudentOnboarding />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={
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
                  <Route path="/" element={<Navigate to={isAdmin ? "/dashboard" : "/parent"} replace />} />
                  <Route path="/dashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to="/parent" replace />} />
                  <Route path="/students" element={isAdmin ? <AdminStudents /> : <Navigate to="/parent" replace />} />
                  <Route path="/logistics" element={isAdmin ? <AdminLogistics /> : <Navigate to="/parent" replace />} />
                  <Route path="/medical" element={isAdmin ? <AdminMedical /> : <Navigate to="/parent" replace />} />
                  <Route path="/settings" element={<AdminSettings />} />
                  <Route path="/parent" element={<ParentPortal />} />
                  <Route path="/onboarding" element={<Navigate to="/onboarding" replace />} />
                  <Route path="*" element={<Navigate to={isAdmin ? "/dashboard" : "/parent"} replace />} />
                </Routes>
              </motion.div>
            </AnimatePresence>

            <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
          </div>
        </div>
      } />
    </Routes>
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
