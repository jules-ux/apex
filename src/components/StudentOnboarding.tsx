import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, ChevronLeft, Building, User, HeartPulse, 
  Trophy, GraduationCap, CheckCircle2, Plus, X, Loader2,
  ArrowRight, School, Sparkles
} from 'lucide-react';
import { db, setDoc, doc, OperationType, handleFirestoreError } from '../firebase';
import { useAuth } from '../AuthContext';
import { useSchool } from '../SchoolContext';

interface StudentOnboardingProps {
  overrideSchoolId?: string;
  onComplete?: () => void;
}

export const StudentOnboarding = ({ overrideSchoolId, onComplete }: StudentOnboardingProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedSchool, schools } = useSchool();
  const [step, setStep] = useState(1);
  const [showMiddleName, setShowMiddleName] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const initialSchoolId = overrideSchoolId || selectedSchool.id;

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    schoolId: initialSchoolId,
    type: 'student',
    sport: '',
    class: '',
    wellness: 80,
    academicStatus: 'Good Standing',
    gpa: '3.5',
    tags: [] as string[]
  });

  useEffect(() => {
    if (!overrideSchoolId) {
      setFormData(prev => ({ ...prev, schoolId: selectedSchool.id }));
    }
  }, [selectedSchool.id, overrideSchoolId]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    // Determine role and redirect path immediately
    const isAdmin = user?.email === 'jules_stoop@icloud.com';
    const redirectPath = isAdmin ? '/students' : '/parent';
    
    // Start background save
    const memberId = crypto.randomUUID();
    const memberData = {
      ...formData,
      id: memberId,
      name: `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`.trim(),
      trend: 'stable',
      updatedAt: new Date().toISOString(),
      createdBy: user?.uid
    };
    
    // We don't await this to make it "instant" for the user
    setDoc(doc(db, 'members', memberId), memberData).catch(error => {
      console.error("Background save failed:", error);
    });

    // Instant redirect or callback
    if (onComplete) {
      onComplete();
    } else {
      navigate(redirectPath);
    }
  };

  const isSchoolLocked = !!overrideSchoolId;

  return (
    <div className={`${onComplete ? '' : 'min-h-screen bg-gray-50'} flex flex-col items-center justify-center p-4 md:p-8`}>
      {/* Progress Bar */}
      <div className="max-w-2xl w-full mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={`text-xs font-bold uppercase tracking-wider ${step >= s ? 'text-blue-600' : 'text-gray-400'}`}
            >
              Step {s}
            </div>
          ))}
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-blue-600"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <motion.div 
        layout
        className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
      >
        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    Welcome
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Let's start with the basics</h2>
                  <p className="text-gray-500">Please provide the student's legal name and school affiliation.</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">First Name</label>
                      <input 
                        type="text"
                        value={formData.firstName}
                        onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-lg"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Last Name</label>
                      <input 
                        type="text"
                        value={formData.lastName}
                        onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-lg"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  {showMiddleName ? (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-gray-700 ml-1">Middle Name</label>
                        <button onClick={() => setShowMiddleName(false)} className="text-xs text-gray-400 hover:text-red-500">Remove</button>
                      </div>
                      <input 
                        type="text"
                        value={formData.middleName}
                        onChange={e => setFormData(prev => ({ ...prev, middleName: e.target.value }))}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-lg"
                        placeholder="Quincy"
                      />
                    </motion.div>
                  ) : (
                    <button 
                      onClick={() => setShowMiddleName(true)}
                      className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add middle name
                    </button>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">School Affiliation</label>
                    <div className="grid grid-cols-1 gap-3">
                      {schools.map(school => (
                        <button
                          key={school.id}
                          disabled={isSchoolLocked}
                          onClick={() => setFormData(prev => ({ ...prev, schoolId: school.id }))}
                          className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${formData.schoolId === school.id ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200 bg-white'} ${isSchoolLocked && formData.schoolId !== school.id ? 'opacity-50 grayscale' : ''}`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.schoolId === school.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                            <School className="w-5 h-5" />
                          </div>
                          <span className={`font-bold ${formData.schoolId === school.id ? 'text-blue-700' : 'text-gray-700'}`}>{school.name}</span>
                          {isSchoolLocked && formData.schoolId === school.id && (
                            <div className="ml-auto px-2 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold rounded uppercase">Locked</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    <GraduationCap className="w-3 h-3" />
                    Academic & Athletic
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Academic & Athletic</h2>
                  <p className="text-gray-500">Help us categorize {formData.firstName} correctly.</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Primary Sport</label>
                      <select 
                        value={formData.sport}
                        onChange={e => setFormData(prev => ({ ...prev, sport: e.target.value }))}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-lg appearance-none"
                      >
                        <option value="">Select Sport</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Swimming">Swimming</option>
                        <option value="Track & Field">Track & Field</option>
                        <option value="Soccer">Soccer</option>
                        <option value="Tennis">Tennis</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Class / Grade</label>
                      <input 
                        type="text"
                        value={formData.class}
                        onChange={e => setFormData(prev => ({ ...prev, class: e.target.value }))}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-lg"
                        placeholder="e.g. 10B"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Academic Status</label>
                    <div className="flex flex-wrap gap-3">
                      {['Good Standing', 'Excellence', 'Warning', 'Probation'].map(status => (
                        <button
                          key={status}
                          onClick={() => setFormData(prev => ({ ...prev, academicStatus: status }))}
                          className={`px-6 py-3 rounded-full border-2 font-bold transition-all ${formData.academicStatus === status ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Current GPA</label>
                    <input 
                      type="text"
                      value={formData.gpa}
                      onChange={e => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-lg"
                      placeholder="3.5"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    <HeartPulse className="w-3 h-3" />
                    Wellness & Tags
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Final details</h2>
                  <p className="text-gray-500">Almost there! Just a few more details to wrap up.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-gray-700 ml-1">Initial Wellness Score</label>
                      <span className="text-2xl font-black text-blue-600">{formData.wellness}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0" max="100"
                      value={formData.wellness}
                      onChange={e => setFormData(prev => ({ ...prev, wellness: parseInt(e.target.value) }))}
                      className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Tags (Dorms, Groups, etc.)</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-bold">
                          {tag}
                          <button onClick={() => setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val && !formData.tags.includes(val)) {
                              setFormData(prev => ({ ...prev, tags: [...prev.tags, val] }));
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                        className="flex-1 px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Type and press Enter to add tags"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
            {step > 1 ? (
              <button 
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 text-gray-500 font-bold hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button 
                onClick={nextStep}
                disabled={!formData.firstName || !formData.lastName}
                className="flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                Complete Onboarding
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
