import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Building } from 'lucide-react';
import { useSchool } from '../SchoolContext';

export const TopSchoolSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedSchool, setSelectedSchool, schools } = useSchool();

  return (
    <motion.div 
      layout
      className="bg-white border border-gray-200 shadow-sm rounded-full flex items-center h-10 px-1.5 overflow-hidden shrink-0"
    >
      <motion.div 
        layout 
        className="flex items-center gap-2 px-3 shrink-0 cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          <Building className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">{selectedSchool.name}</span>
      </motion.div>
      
      <motion.div layout className="w-px h-4 bg-gray-200 mx-1 shrink-0" />
      
      <motion.button 
        layout
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors shrink-0 mr-1"
      >
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex items-center overflow-hidden whitespace-nowrap"
          >
            <div className="flex items-center gap-1 pr-2">
              {schools.filter(s => s.id !== selectedSchool.id).map(school => (
                <button
                  key={school.id}
                  onClick={() => {
                    setSelectedSchool(school);
                    setIsOpen(false);
                  }}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {school.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
