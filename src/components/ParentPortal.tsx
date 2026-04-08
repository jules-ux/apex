import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, LayoutDashboard, Plus, Search, CheckCircle2, AlertCircle, ChevronRight, Activity, GraduationCap, HeartPulse } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { db, collection, query, where, onSnapshot, getDocs, limit } from '../firebase';
import { StudentOnboarding } from './StudentOnboarding';

export const ParentPortal = () => {
  const { user, logout } = useAuth();
  const [onboardingCode, setOnboardingCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [targetSchoolId, setTargetSchoolId] = useState<string | null>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'members'), where('createdBy', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const childrenList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChildren(childrenList);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [user]);

  const validateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardingCode.trim()) return;

    setIsValidating(true);
    setError(null);

    try {
      const q = query(
        collection(db, 'onboarding_codes'), 
        where('code', '==', onboardingCode.toUpperCase()),
        where('active', '==', true),
        limit(1)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError('Invalid or expired onboarding code. Please check with the school.');
      } else {
        const codeData = snapshot.docs[0].data();
        setTargetSchoolId(codeData.schoolId);
        setShowOnboarding(true);
      }
    } catch (err) {
      console.error("Error validating code:", err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  if (showOnboarding && targetSchoolId) {
    return (
      <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <button 
            onClick={() => setShowOnboarding(false)}
            className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Portal
          </button>
          <StudentOnboarding overrideSchoolId={targetSchoolId} onComplete={() => setShowOnboarding(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 pt-28 md:pt-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">
              Parent Portal
            </h1>
            <p className="text-sm text-gray-500">Manage your children's academic and athletic status.</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all text-sm font-bold shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Add Child Section */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Add Child</h2>
          </div>
          <div className="p-6">
            <form onSubmit={validateCode} className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <input 
                  type="text"
                  value={onboardingCode}
                  onChange={(e) => setOnboardingCode(e.target.value)}
                  placeholder="Enter onboarding code (e.g. AB12CD)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono uppercase tracking-wider"
                />
                {error && (
                  <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </div>
                )}
              </div>
              <button 
                type="submit"
                disabled={isValidating || !onboardingCode.trim()}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 disabled:shadow-none whitespace-nowrap"
              >
                {isValidating ? 'Validating...' : 'Link Account'}
              </button>
            </form>
          </div>
        </div>

        {/* Children List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 px-1">Linked Accounts</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : children.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">No children linked yet</h3>
                <p className="text-sm text-gray-500">Enter a code from your school to see your child's status.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {children.map(child => (
                <motion.div 
                  key={child.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
                        {child.firstName[0]}{child.lastName[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {child.firstName} {child.lastName}
                        </h3>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                          {child.class} • {child.sport}
                        </p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      child.wellness > 70 ? 'bg-green-50 text-green-600' : 
                      child.wellness > 40 ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {child.wellness}% Wellness
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <Activity className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Status</div>
                      <div className="text-xs font-bold text-gray-900">{child.trend === 'up' ? 'Improving' : child.trend === 'down' ? 'Declining' : 'Stable'}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <GraduationCap className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Academic</div>
                      <div className="text-xs font-bold text-gray-900">{child.academicStatus}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <HeartPulse className="w-4 h-4 text-red-500 mx-auto mb-1" />
                      <div className="text-[10px] text-gray-400 uppercase font-bold">GPA</div>
                      <div className="text-xs font-bold text-gray-900">{child.gpa}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
