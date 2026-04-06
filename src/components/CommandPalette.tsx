import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, LayoutDashboard, Users, CalendarDays, Activity, Settings, CheckCircle, MessageSquare, PlusCircle } from 'lucide-react';

interface CommandPaletteProps {
  setActiveTab: (tab: string) => void;
}

export const CommandPalette = ({ setActiveTab }: CommandPaletteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle palette on Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
    }
  }, [isOpen]);

  const commands = [
    { id: 'nav-dashboard', title: 'Go to Dashboard', icon: LayoutDashboard, category: 'Navigation', action: () => setActiveTab('dashboard') },
    { id: 'nav-roster', title: 'Go to Roster', icon: Users, category: 'Navigation', action: () => setActiveTab('roster') },
    { id: 'nav-logistics', title: 'Go to Logistics', icon: CalendarDays, category: 'Navigation', action: () => setActiveTab('logistics') },
    { id: 'nav-medical', title: 'Go to Medical', icon: Activity, category: 'Navigation', action: () => setActiveTab('medical') },
    { id: 'nav-settings', title: 'Go to Settings', icon: Settings, category: 'Navigation', action: () => setActiveTab('settings') },
    
    { id: 'act-approve', title: 'Approve all pending leave', icon: CheckCircle, category: 'Quick Actions', action: () => console.log('Approved all') },
    { id: 'act-message', title: 'Message all coaches', icon: MessageSquare, category: 'Quick Actions', action: () => console.log('Message coaches') },
    { id: 'act-injury', title: 'Log new injury report', icon: PlusCircle, category: 'Quick Actions', action: () => console.log('Log injury') },
  ];

  const filteredCommands = query === '' 
    ? commands 
    : commands.filter(cmd => cmd.title.toLowerCase().includes(query.toLowerCase()) || cmd.category.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
          />
          <div className="fixed inset-0 z-[201] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto border border-gray-100"
            >
              <div className="flex items-center px-4 border-b border-gray-100">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search..."
                  className="w-full px-4 py-4 text-gray-900 placeholder:text-gray-400 bg-transparent border-0 focus:ring-0 focus:outline-none text-lg"
                />
                <kbd className="hidden sm:inline-block px-2 py-1 bg-gray-100 rounded text-[10px] font-mono text-gray-500 font-medium shrink-0">ESC</kbd>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="py-12 text-center text-gray-500 text-sm">
                    No results found for "{query}"
                  </div>
                ) : (
                  <div className="space-y-1">
                    {/* Group by category */}
                    {Array.from(new Set(filteredCommands.map(c => c.category))).map(category => (
                      <div key={category} className="mb-4 last:mb-0">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {category}
                        </div>
                        {filteredCommands.filter(c => c.category === category).map((cmd) => {
                          const Icon = cmd.icon;
                          return (
                            <button
                              key={cmd.id}
                              onClick={() => handleSelect(cmd.action)}
                              className="w-full flex items-center gap-3 px-3 py-3 text-left rounded-xl hover:bg-blue-50 hover:text-blue-700 text-gray-700 transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center shrink-0 transition-colors">
                                <Icon className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                              </div>
                              <span className="font-medium text-sm">{cmd.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
