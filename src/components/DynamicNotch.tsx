import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Activity } from 'lucide-react';

export const DynamicNotch = ({ activeTab }: { activeTab?: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const expandedWidth = Math.min(480, windowWidth - 32);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard - Overview';
      case 'roster': return 'Roster - 0';
      case 'logistics': return 'Logistics - 12';
      case 'medical': return 'Medical - 3';
      case 'settings': return 'Settings - 0';
      default: return 'System Active';
    }
  };

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] flex justify-center">
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsHovered(!isHovered)}
        initial={false}
        animate={{
          width: isHovered ? expandedWidth : 160,
          height: isHovered ? 140 : 32,
          borderBottomLeftRadius: isHovered ? 24 : 16,
          borderBottomRightRadius: isHovered ? 24 : 16,
        }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
        className="bg-black text-white shadow-2xl overflow-hidden relative cursor-pointer"
      >
        {/* Collapsed State */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 0 : 1, scale: isHovered ? 0.8 : 1 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center gap-2"
          style={{ pointerEvents: isHovered ? 'none' : 'auto' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
          <span className="text-xs font-medium text-gray-200 whitespace-nowrap">{getTabTitle()}</span>
        </motion.div>

        {/* Expanded State */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.95 }}
          transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 p-3 sm:p-4 flex gap-3 sm:gap-4"
          style={{ 
            pointerEvents: isHovered ? 'auto' : 'none',
            width: expandedWidth,
            height: 140
          }}
        >
          {/* Left Section: Messages */}
          <div className="flex-1 bg-white/10 border border-white/5 rounded-2xl p-3 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <Activity className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-300 truncate">Medical Alert</span>
            </div>
            <div>
              <div className="text-sm font-medium text-white leading-tight line-clamp-2">"3 athletes reported high fatigue today."</div>
              <div className="text-[10px] text-gray-400 mt-1">Requires review</div>
            </div>
          </div>

          {/* Right Section: Date & Next Event */}
          <div className="w-32 sm:w-40 flex flex-col justify-between shrink-0">
            <div className="flex items-center justify-between px-1">
              <div className="text-xl sm:text-2xl font-bold tracking-tight">Apr <span className="text-blue-400">14</span></div>
              <MessageCircle className="w-4 h-4 text-blue-400" />
            </div>
            <div className="bg-white/10 border border-white/5 rounded-xl p-2 mt-auto">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Pending</div>
              <div className="text-xs font-medium text-white truncate">12 Leave Requests</div>
              <div className="text-[10px] text-gray-400 truncate">Awaiting approval</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
