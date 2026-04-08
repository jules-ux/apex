import React from 'react';
import { motion } from 'motion/react';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../AuthContext';

export const ParentPortal = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8"
      >
        <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-blue-200">
          <LayoutDashboard className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-6xl font-black text-gray-900 tracking-tighter italic">
          PARENT PORTAL
        </h1>
        
        <p className="text-gray-500 max-w-md mx-auto">
          Welcome to the APEX Parent Portal. This area is currently under development. 
          Check back soon for academic reports and athletic schedules.
        </p>

        <button 
          onClick={logout}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-bold shadow-sm mx-auto"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </motion.div>
    </div>
  );
};
