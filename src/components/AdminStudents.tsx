import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MoreHorizontal, ArrowUpRight, ArrowDownRight, Minus, ChevronRight, Building, Users, Trophy, ArrowLeft, GraduationCap, Activity, ArrowRightLeft, ArrowRight, Save, AlertTriangle, Shield, Briefcase, HeartPulse, MessageSquare, X, Maximize2, Minimize2, Loader2, Plus } from 'lucide-react';
import { TopBarPortal } from './TopBarPortal';
import { TopRightPortal } from './TopRightPortal';
import { db, collection, onSnapshot, query, where, handleFirestoreError, OperationType, setDoc, doc } from '../firebase';
import { useAuth } from '../AuthContext';
import { useSchool } from '../SchoolContext';

export const athletesData = [
  { id: '1', schoolId: 'apex-high', firstName: 'Thomas', lastName: 'Vermeersch', type: 'student', sport: 'Swimming', location: 'Main Pool', wellness: 85, trend: 'up', academicStatus: 'Good Standing', gpa: '3.8', tags: ['1 A', 'Swimming', 'North Dorm'], groups: ['1 A', 'Swimming', 'North Dorm'] },
  { id: '2', schoolId: 'apex-high', firstName: 'Sarah', lastName: 'Jenkins', type: 'student', sport: 'Basketball', location: 'Class (B204)', wellness: 62, trend: 'down', academicStatus: 'Warning', gpa: '2.4', tags: ['3 BO', 'Basketball', 'South Dorm'], groups: ['3 BO', 'Basketball', 'South Dorm'] },
  { id: '3', schoolId: 'apex-high', firstName: 'Marcus', lastName: 'Johnson', type: 'student', sport: 'Track & Field', location: 'Physio', wellness: 45, trend: 'down', academicStatus: 'Good Standing', gpa: '3.2', tags: ['5 ADB', 'Track & Field', 'East Dorm'], groups: ['5 ADB', 'Track & Field', 'East Dorm'] },
  { id: '4', schoolId: 'apex-high', firstName: 'Emma', lastName: 'Wilson', type: 'student', sport: 'Gymnastics', location: 'Dormitory', wellness: 92, trend: 'stable', academicStatus: 'Excellence', gpa: '4.0', tags: ['2 A Eco', 'Gymnastics', 'West Dorm'], groups: ['2 A Eco', 'Gymnastics', 'West Dorm'] },
  { id: '5', schoolId: 'apex-high', firstName: 'David', lastName: 'Chen', type: 'student', sport: 'Swimming', location: 'Main Pool', wellness: 78, trend: 'up', academicStatus: 'Good Standing', gpa: '3.5', tags: ['4 ECO', 'Swimming', 'North Dorm'], groups: ['4 ECO', 'Swimming', 'North Dorm'] },
  { id: '6', schoolId: 'apex-high', firstName: 'Lucas', lastName: 'Peeters', type: 'student', sport: 'Basketball', location: 'Weight Room', wellness: 88, trend: 'stable', academicStatus: 'Good Standing', gpa: '3.1', tags: ['6 BI', 'Basketball', 'South Dorm'], groups: ['6 BI', 'Basketball', 'South Dorm'] },
  { id: '7', schoolId: 'apex-high', firstName: 'Mia', lastName: 'Rodriguez', type: 'student', sport: 'Track & Field', location: 'Class (A101)', wellness: 71, trend: 'down', academicStatus: 'Good Standing', gpa: '3.6', tags: ['1 Ba', 'Track & Field', 'East Dorm'], groups: ['1 Ba', 'Track & Field', 'East Dorm'] },
  { id: '8', schoolId: 'apex-high', firstName: 'Noah', lastName: 'Kim', type: 'student', sport: 'Gymnastics', location: 'Training Hall', wellness: 95, trend: 'up', academicStatus: 'Excellence', gpa: '3.9', tags: ['3 HT', 'Gymnastics', 'West Dorm'], groups: ['3 HT', 'Gymnastics', 'West Dorm'] },
  { id: '9', schoolId: 'apex-high', firstName: 'Liam', lastName: 'O\'Connor', type: 'student', sport: 'Soccer', location: 'Field 2', wellness: 82, trend: 'up', academicStatus: 'Good Standing', gpa: '3.4', tags: ['5 BZO', 'Soccer', 'North Dorm'], groups: ['5 BZO', 'Soccer', 'North Dorm'] },
  { id: '10', schoolId: 'apex-high', firstName: 'Chloe', lastName: 'Dubois', type: 'student', sport: 'Tennis', location: 'Court 4', wellness: 58, trend: 'down', academicStatus: 'Warning', gpa: '2.8', tags: ['2 A KT', 'Tennis', 'South Dorm'], groups: ['2 A KT', 'Tennis', 'South Dorm'] },
];

const getWellnessColor = (score: number) => {
  if (score >= 80) return 'text-green-600 bg-green-50';
  if (score >= 60) return 'text-amber-600 bg-amber-50';
  return 'text-red-600 bg-red-50';
};

const getTrendIcon = (trend: string) => {
  if (trend === 'up') return <ArrowUpRight className="w-3 h-3" />;
  if (trend === 'down') return <ArrowDownRight className="w-3 h-3" />;
  return <Minus className="w-3 h-3" />;
};

export const AdminStudents = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { selectedSchool } = useSchool();
  const [athletes, setAthletes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [specific, setSpecific] = useState<string | null>(null);

  const [expandedSubgroups, setExpandedSubgroups] = useState<boolean>(false);
  const [expandedGrades, setExpandedGrades] = useState<Record<string, boolean>>({});

  // Transfer Mode State
  const [isTransferMode, setIsTransferMode] = useState(false);
  const [leftSelected, setLeftSelected] = useState<string[]>([]);
  const [rightSelected, setRightSelected] = useState<string[]>([]);
  const [stagedAthletes, setStagedAthletes] = useState<string[]>([]);
  
  const [targetCategory, setTargetCategory] = useState<string>('Sports');
  const [targetSpecific, setTargetSpecific] = useState<string>('Basketball');

  const [searchQuery, setSearchQuery] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [showGlobalSearchResults, setShowGlobalSearchResults] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
  const [displayAthleteId, setDisplayAthleteId] = useState<string | null>(null);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    sport: '',
    location: '',
    wellness: 'All',
    academic: 'All'
  });

  // Confirmation Dialog State
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const getFullName = (athlete: any) => {
    if (athlete.name) return athlete.name;
    return `${athlete.firstName || ''} ${athlete.middleName ? athlete.middleName + ' ' : ''}${athlete.lastName || ''}`.trim();
  };

  const getInitials = (athlete: any) => {
    const name = getFullName(athlete);
    if (!name) return '?';
    return name.split(' ').filter(Boolean).map((n: string) => n[0]).join('').toUpperCase();
  };

  useEffect(() => {
    if (authLoading) return;
    
    // If not logged in, just use fallback data and stop loading
    if (!user) {
      setAthletes(athletesData);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'members'),
      where('schoolId', '==', selectedSchool.id)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const membersList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure groups exists for UI compatibility
          groups: data.tags || data.groups || []
        };
      });
      setAthletes(membersList.length > 0 ? membersList : athletesData.filter(a => a.schoolId === selectedSchool.id));
      setLoading(false);
    }, (error) => {
      if (!error.message.includes('permission')) {
        handleFirestoreError(error, OperationType.LIST, 'members');
      }
      setAthletes(athletesData.filter(a => a.schoolId === selectedSchool.id));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading, selectedSchool.id]);

  useEffect(() => {
    if (selectedAthleteId) {
      setDisplayAthleteId(selectedAthleteId);
    }
  }, [selectedAthleteId]);

  useEffect(() => {
    const handleOpenProfile = (e: CustomEvent) => {
      setCategory('All Users');
      setSpecific(null);
      setSelectedAthleteId(e.detail.id);
      setSearchQuery('');
      setFilters({ name: '', sport: '', location: '', wellness: 'All', academic: 'All' });
      setShowFilterPanel(false);
      setIsTransferMode(false);
      setIsProfileExpanded(false);
    };

    const handleOpenCategory = (e: CustomEvent) => {
      setCategory(e.detail.category);
      setSpecific(null);
      setSelectedAthleteId(null);
      setIsProfileExpanded(false);
      setSearchQuery('');
      setFilters({ name: '', sport: '', location: '', wellness: 'All', academic: 'All' });
      setShowFilterPanel(false);
      setIsTransferMode(false);
    };

    window.addEventListener('open-student-profile', handleOpenProfile as EventListener);
    window.addEventListener('open-category', handleOpenCategory as EventListener);
    
    // Check if there's a pending profile to open from a recent navigation
    if ((window as any).__pendingStudentProfile) {
      const pendingId = (window as any).__pendingStudentProfile;
      delete (window as any).__pendingStudentProfile;
      
      // Use setTimeout to ensure state updates happen after initial render
      setTimeout(() => {
        setCategory('All Users');
        setSpecific(null);
        setSelectedAthleteId(pendingId);
        setSearchQuery('');
        setFilters({ name: '', sport: '', location: '', wellness: 'All', academic: 'All' });
        setShowFilterPanel(false);
        setIsTransferMode(false);
        setIsProfileExpanded(false);
      }, 0);
    }

    // Check if there's a pending category to open from a recent navigation
    if ((window as any).__pendingCategory) {
      const pendingCat = (window as any).__pendingCategory;
      delete (window as any).__pendingCategory;
      
      setTimeout(() => {
        setCategory(pendingCat);
        setSpecific(null);
        setSelectedAthleteId(null);
        setIsProfileExpanded(false);
        setSearchQuery('');
        setFilters({ name: '', sport: '', location: '', wellness: 'All', academic: 'All' });
        setShowFilterPanel(false);
        setIsTransferMode(false);
      }, 0);
    }

    return () => {
      window.removeEventListener('open-student-profile', handleOpenProfile as EventListener);
      window.removeEventListener('open-category', handleOpenCategory as EventListener);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isTransferMode && stagedAthletes.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isTransferMode, stagedAthletes.length]);

  const handleNavigationAttempt = (action: () => void) => {
    if (isTransferMode && stagedAthletes.length > 0) {
      setPendingAction(() => action);
      setShowConfirmDialog(true);
    } else {
      action();
    }
  };

  const handleBack = () => {
    handleNavigationAttempt(() => {
      if (specific) setSpecific(null);
      else if (category) setCategory(null);
      setIsTransferMode(false);
      setLeftSelected([]);
      setRightSelected([]);
      setStagedAthletes([]);
      setExpandedSubgroups(false);
      setExpandedGrades({});
      setSearchQuery('');
      setFilters({ name: '', sport: '', location: '', wellness: 'All', academic: 'All' });
      setShowFilterPanel(false);
      setSelectedAthleteId(null);
    });
  };

  const toggleTransferMode = () => {
    handleNavigationAttempt(() => {
      setIsTransferMode(!isTransferMode);
      setLeftSelected([]);
      setRightSelected([]);
      setStagedAthletes([]);
    });
  };

  const moveRight = () => {
    setStagedAthletes(prev => [...prev, ...leftSelected]);
    setLeftSelected([]);
  };

  const moveLeft = () => {
    setStagedAthletes(prev => prev.filter(id => !rightSelected.includes(id)));
    setRightSelected([]);
  };

  const filteredAthletes = athletes.filter(a => {
    const fullName = getFullName(a);
    const matchesGlobalSearch = fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                (a.sport || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (a.location || '').toLowerCase().includes(searchQuery.toLowerCase());
                                
    const matchesName = fullName.toLowerCase().includes(filters.name.toLowerCase());
    const matchesSport = (a.sport || '').toLowerCase().includes(filters.sport.toLowerCase());
    const matchesLocation = (a.location || '').toLowerCase().includes(filters.location.toLowerCase());
    
    let matchesWellness = true;
    if (filters.wellness === 'Excellent') matchesWellness = a.wellness >= 80;
    else if (filters.wellness === 'Fair') matchesWellness = a.wellness >= 60 && a.wellness < 80;
    else if (filters.wellness === 'Poor') matchesWellness = a.wellness < 60;

    const matchesAcademic = filters.academic === 'All' || a.academic === filters.academic;
    const matchesGroup = specific ? a.groups.includes(specific) : true;

    return matchesGroup && matchesGlobalSearch && matchesName && matchesSport && matchesLocation && matchesWellness && matchesAcademic;
  });

  const availableAthletes = filteredAthletes.filter(a => !stagedAthletes.includes(a.id));
  const transferringAthletes = filteredAthletes.filter(a => stagedAthletes.includes(a.id));

  const categoriesData = [
    {
      title: "Academics & Students",
      colorClass: "bg-emerald-50 text-emerald-600",
      items: [
        { name: 'All Users', icon: <Users className="w-5 h-5" /> },
        { name: 'Klassen', icon: <GraduationCap className="w-5 h-5" /> },
        { name: 'Vrije leerlingen', icon: <Users className="w-5 h-5" /> },
        { name: 'Stagiairs', icon: <Briefcase className="w-5 h-5" /> }
      ]
    },
    {
      title: "Staff & Management",
      colorClass: "bg-blue-50 text-blue-600",
      items: [
        { name: 'Leerkrachten', icon: <Users className="w-5 h-5" /> },
        { name: 'Directie eerste graad', icon: <Building className="w-5 h-5" /> },
        { name: 'Directie tweede en derde graad', icon: <Building className="w-5 h-5" /> },
        { name: 'Personeel', icon: <Briefcase className="w-5 h-5" /> },
        { name: 'Dienstpersoneel', icon: <Briefcase className="w-5 h-5" /> },
        { name: 'Inkluus-begeleiders', icon: <HeartPulse className="w-5 h-5" /> },
        { name: 'CLB', icon: <Activity className="w-5 h-5" /> }
      ]
    },
    {
      title: "Administration & IT",
      colorClass: "bg-slate-100 text-slate-600",
      items: [
        { name: 'Administratie', icon: <Briefcase className="w-5 h-5" /> },
        { name: 'Beheerders', icon: <Shield className="w-5 h-5" /> },
        { name: 'Ondersteunende accounts', icon: <Shield className="w-5 h-5" /> },
        { name: 'Berichtgroepen', icon: <MessageSquare className="w-5 h-5" /> },
        { name: 'Externen', icon: <Users className="w-5 h-5" /> }
      ]
    },
    {
      title: "Extracurricular & Housing",
      colorClass: "bg-purple-50 text-purple-600",
      items: [
        { name: 'Sports', icon: <Trophy className="w-5 h-5" />, overrideColor: "bg-orange-50 text-orange-600" },
        { name: 'Dorms', icon: <Building className="w-5 h-5" /> }
      ]
    }
  ];

  const classesData = [
    { grade: '1e graad', classes: ['1 A', '1 Ba', '1 Bb', '1 DID', '2 A Eco', '2 A KT', '2 A MW', '2 A SPW', '2 A StemT', '2 A StemW', '2 B StemT', '2 Ba Eco MW', '2 Bb Eco MW', '2 D Eco', '2 D KT', '2 D MW', '2 D SPW', '2 D StemT', '2 D StemW'] },
    { grade: '2e graad', classes: ['3 BO', '3 ECO', '3 HT', '3 HUM', '3 LAT', '3 MW', '3 MWW', '3 OL', '3 SPW', '3 TW', '3 WET', '3 ZW', '4 BO', '4 ECO', '4 HT', '4 HUM', '4 LAT', '4 MW', '4 MWW', '4 OL', '4 SPW', '4 TW', '4 WET', '4 ZW'] },
    { grade: '3e graad', classes: ['5 ADB', '5 BI', '5 BZO', '5 CO', '5 ECMT', '5 ECWI', '5 HUM', '5 ICW', '5 LAMT', '5 LAWI', '5 OOS', '5 OPV', '5 SPW', '5 WEWI', '5 WZW', '6 ADB', '6 BI', '6 BZO', '6 CO', '6 ECMT', '6 ECWI', '6 HUM', '6 ICW', '6 LAMT', '6 LAWI', '6 OOS', '6 OPV', '6 SPW', '6 WEWI', '6 WZW'] },
    { grade: 'Andere', classes: ['dummy', 'ex-OKAN intern', 'OKAN', 'OKAN-leerlingen', 'Ondersteuningsklas', 'Taalbegeleiding', 'Think!'] }
  ];
  const classesList = classesData.flatMap(g => g.classes);
  const sportsList = ['Basketball', 'Swimming', 'Track & Field', 'Gymnastics', 'Soccer', 'Tennis'];
  const dormsList = ['North Dorm', 'South Dorm', 'East Dorm', 'West Dorm'];

  const isClasses = category === 'Klassen';
  const isSports = category === 'Sports';
  const isDorms = category === 'Dorms';
  const hasSubgroups = isClasses || isSports || isDorms;
  const showTable = (hasSubgroups && specific) || (category && !hasSubgroups);

  const currentSubgroupList = isClasses ? classesList : isSports ? sportsList : dormsList;
  const displaySubgroupList = (!expandedSubgroups && currentSubgroupList.length > 8) 
    ? currentSubgroupList.slice(0, 7) 
    : currentSubgroupList;

  const allGroups = [...classesList, ...sportsList, ...dormsList];
  const globalSearchGroupResults = allGroups.filter(g => 
    globalSearchQuery && g.toLowerCase().includes(globalSearchQuery.toLowerCase())
  );

  const globalSearchResults = athletes.filter(a => {
    const fullName = getFullName(a);
    return globalSearchQuery && (
      fullName.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      (a.sport || '').toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      (a.groups || []).some((g: string) => g.toLowerCase().includes(globalSearchQuery.toLowerCase()))
    );
  });

  const handleGroupClick = (groupName: string) => {
    let targetCategory = '';
    if (classesList.includes(groupName)) targetCategory = 'Klassen';
    else if (sportsList.includes(groupName)) targetCategory = 'Sports';
    else if (dormsList.includes(groupName)) targetCategory = 'Dorms';
    
    if (targetCategory) {
      handleNavigationAttempt(() => {
        setCategory(targetCategory);
        setSpecific(groupName);
        setGlobalSearchQuery('');
        setShowGlobalSearchResults(false);
        setIsTransferMode(false);
        setLeftSelected([]);
        setRightSelected([]);
        setStagedAthletes([]);
        setSearchQuery('');
        setFilters({ name: '', sport: '', location: '', wellness: 'All', academic: 'All' });
        setShowFilterPanel(false);
        setSelectedAthleteId(null);
        setIsProfileExpanded(false);
      });
    }
  };

  const handleMemberClick = (athlete: typeof athletes[0]) => {
    const targetGroup = athlete.groups.length > 0 ? athlete.groups[0] : null;
    let targetCategory = '';
    if (targetGroup) {
      if (classesList.includes(targetGroup)) targetCategory = 'Klassen';
      else if (sportsList.includes(targetGroup)) targetCategory = 'Sports';
      else if (dormsList.includes(targetGroup)) targetCategory = 'Dorms';
    }
    
    handleNavigationAttempt(() => {
      if (targetCategory && targetGroup) {
        setCategory(targetCategory);
        setSpecific(targetGroup);
      } else {
        setCategory('All Users');
        setSpecific(null);
      }
      
      setSelectedAthleteId(athlete.id);
      setGlobalSearchQuery('');
      setShowGlobalSearchResults(false);
      setSearchQuery('');
      setFilters({ name: '', sport: '', location: '', wellness: 'All', academic: 'All' });
      setShowFilterPanel(false);
      setIsTransferMode(false);
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 pt-24 md:pt-20 flex flex-col">
      <TopRightPortal>
        <div className="flex items-center gap-3">
          {user && (
            <button 
              onClick={() => navigate('/onboarding')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium h-10 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Member</span>
            </button>
          )}
          <div className="relative w-64">
            <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={globalSearchQuery}
              onChange={(e) => {
                setGlobalSearchQuery(e.target.value);
                setShowGlobalSearchResults(true);
              }}
              onFocus={() => setShowGlobalSearchResults(true)}
              onBlur={() => setTimeout(() => setShowGlobalSearchResults(false), 200)}
              placeholder="Search members globally..." 
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
            />
          </div>
          
          {showGlobalSearchResults && globalSearchQuery && (
            <div className="absolute top-full mt-2 right-0 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-96 flex flex-col">
              <div className="overflow-y-auto">
                {globalSearchGroupResults.length === 0 && globalSearchResults.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No results found matching "{globalSearchQuery}"
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {globalSearchGroupResults.length > 0 && (
                      <div className="p-2">
                        <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Groups</div>
                        {globalSearchGroupResults.map(group => (
                          <button
                            key={group}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleGroupClick(group);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Users className="w-4 h-4 text-gray-400" />
                            {group}
                          </button>
                        ))}
                      </div>
                    )}
                    {globalSearchResults.length > 0 && (
                      <div className="p-2">
                        <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Members</div>
                        {globalSearchResults.map(athlete => (
                          <div 
                            key={athlete.id} 
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleMemberClick(athlete);
                            }}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleMemberClick(athlete);
                              }
                            }}
                            className="p-3 hover:bg-gray-50 transition-colors rounded-lg cursor-pointer outline-none focus:bg-gray-50"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
                                {getInitials(athlete)}
                              </div>
                              <div>
                                <div className="font-medium text-sm text-gray-900">{getFullName(athlete)}</div>
                                <div className="text-xs text-gray-500">{athlete.sport}</div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5 pl-11">
                              {athlete.groups.map(group => (
                                <button 
                                  key={group} 
                                  onMouseDown={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleGroupClick(group);
                                  }}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 cursor-pointer transition-colors"
                                >
                                  {group}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      </TopRightPortal>

      <TopBarPortal>
        {/* Back Button */}
        <button 
          onClick={handleBack}
          disabled={!category}
          className={`p-2 rounded-full border transition-colors flex items-center justify-center h-10 w-10 shrink-0 ${
            !category 
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600 shadow-sm'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-white px-3 py-2 rounded-full border border-gray-200 shadow-sm h-10 shrink-0">
          {!category ? (
            <div className="flex items-center gap-2 text-gray-900 font-semibold px-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Select Group</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5 hover:text-blue-600 cursor-pointer relative group">
                {isClasses ? <GraduationCap className="w-4 h-4" /> : isSports ? <Trophy className="w-4 h-4" /> : isDorms ? <Building className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                <div className="relative flex items-center">
                  <select 
                    value={category}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleNavigationAttempt(() => {
                        setCategory(val);
                        setSpecific(null);
                        setIsTransferMode(false);
                        setLeftSelected([]);
                        setRightSelected([]);
                        setStagedAthletes([]);
                        setExpandedSubgroups(false);
                        setExpandedGrades({});
                      });
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  >
                    {categoriesData.map(cat => (
                      <optgroup key={cat.title} label={cat.title}>
                        {cat.items.map(item => (
                          <option key={item.name} value={item.name}>{item.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <span className="font-medium pr-4 pointer-events-none whitespace-nowrap">
                    {category}
                  </span>
                </div>
              </div>
              
              {hasSubgroups && specific && (
                <>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <div className="flex items-center gap-1.5 text-gray-900">
                    <div className="relative flex items-center">
                      <select 
                        value={specific}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleNavigationAttempt(() => {
                            setSpecific(val);
                            setIsTransferMode(false);
                            setLeftSelected([]);
                            setRightSelected([]);
                            setStagedAthletes([]);
                          });
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      >
                        {isClasses ? (
                          classesData.map(g => (
                            <optgroup key={g.grade} label={g.grade}>
                              {g.classes.map(c => <option key={c} value={c}>{c}</option>)}
                            </optgroup>
                          ))
                        ) : (
                          currentSubgroupList.map(item => (
                            <option key={item} value={item}>{item}</option>
                          ))
                        )}
                      </select>
                      <span className="font-bold pointer-events-none whitespace-nowrap">
                        {specific}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </TopBarPortal>

      <div className="w-full flex-1 flex flex-col">
        {showTable && (
          <div className="flex flex-col md:flex-row justify-end items-start md:items-center mb-4 gap-4 shrink-0">
            {/* Search, Filter & Transfer (Only show when viewing the table) */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${!hasSubgroups ? category : specific}...`} 
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>
              <button 
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors shadow-sm shrink-0 ${
                  showFilterPanel 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50 bg-white'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button 
                onClick={toggleTransferMode}
                disabled={category === 'All Users'}
                title={category === 'All Users' ? "Transfer disabled for All Users" : "Transfer Members"}
                className={`flex items-center justify-center p-2 border rounded-lg transition-colors shadow-sm shrink-0 ${
                  isTransferMode 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : category === 'All Users'
                      ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50 bg-white'
                }`}
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {showTable && showFilterPanel && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 animate-in slide-in-from-top-2 duration-200 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  value={filters.name}
                  onChange={e => setFilters({...filters, name: e.target.value})}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Filter by name..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Sport</label>
                <input 
                  type="text" 
                  value={filters.sport}
                  onChange={e => setFilters({...filters, sport: e.target.value})}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Filter by sport..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text" 
                  value={filters.location}
                  onChange={e => setFilters({...filters, location: e.target.value})}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Filter by location..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Wellness</label>
                <select 
                  value={filters.wellness}
                  onChange={e => setFilters({...filters, wellness: e.target.value})}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="All">All Levels</option>
                  <option value="Excellent">Excellent (80-100)</option>
                  <option value="Fair">Fair (60-79)</option>
                  <option value="Poor">Needs Attention (&lt;60)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Academic</label>
                <select 
                  value={filters.academic}
                  onChange={e => setFilters({...filters, academic: e.target.value})}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Good Standing">Good Standing</option>
                  <option value="Warning">Warning</option>
                  <option value="Excellence">Excellence</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button 
                onClick={() => setFilters({ name: '', sport: '', location: '', wellness: 'All', academic: 'All' })}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="w-full flex-1 flex flex-col">
          {!category && (
            <div className="space-y-8 w-full">
              {categoriesData.map(cat => (
                <div key={cat.title}>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 px-1">{cat.title}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {cat.items.map((item) => (
                      <div 
                        key={item.name}
                        onClick={() => setCategory(item.name)}
                        className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex items-center p-3 gap-3 cursor-pointer"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.overrideColor || cat.colorClass}`}>
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                        </div>
                        {['Klassen', 'Sports', 'Dorms'].includes(item.name) && <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {isClasses && !specific && (
            <div className="space-y-8 w-full">
              {classesData.map(gradeGroup => {
                const isExpanded = expandedGrades[gradeGroup.grade];
                const displayClasses = (!isExpanded && gradeGroup.classes.length > 8)
                  ? gradeGroup.classes.slice(0, 7)
                  : gradeGroup.classes;

                return (
                  <div key={gradeGroup.grade}>
                    <h3 className="text-md font-semibold text-gray-800 mb-3 px-1">{gradeGroup.grade}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {displayClasses.map(item => (
                        <div 
                          key={item}
                          onClick={() => setSpecific(item)}
                          className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-400 transition-all flex items-center p-3 gap-3 cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600">
                            <Users className="w-4 h-4" />
                          </div>
                          <h3 className="text-sm font-semibold text-gray-900">{item}</h3>
                        </div>
                      ))}
                      {!isExpanded && gradeGroup.classes.length > 8 && (
                        <div 
                          onClick={() => setExpandedGrades(prev => ({ ...prev, [gradeGroup.grade]: true }))}
                          className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-400 transition-all flex items-center p-3 gap-3 cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gray-50 text-gray-600">
                            <ChevronRight className="w-4 h-4 rotate-90" />
                          </div>
                          <h3 className="text-sm font-semibold text-gray-900">Show {gradeGroup.classes.length - 7} More</h3>
                        </div>
                      )}
                      {isExpanded && gradeGroup.classes.length > 8 && (
                        <div 
                          onClick={() => setExpandedGrades(prev => ({ ...prev, [gradeGroup.grade]: false }))}
                          className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-400 transition-all flex items-center p-3 gap-3 cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gray-50 text-gray-600">
                            <ChevronRight className="w-4 h-4 -rotate-90" />
                          </div>
                          <h3 className="text-sm font-semibold text-gray-900">Show Less</h3>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {hasSubgroups && !isClasses && !specific && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full">
              {displaySubgroupList.map((item) => (
                <div 
                  key={item}
                  onClick={() => setSpecific(item)}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex items-center p-3 gap-3 cursor-pointer"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSports ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'}`}>
                    {isSports ? <Activity className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{item}</h3>
                </div>
              ))}
              {!expandedSubgroups && currentSubgroupList.length > 8 && (
                <div 
                  onClick={() => setExpandedSubgroups(true)}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex items-center p-3 gap-3 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gray-50 text-gray-600">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Show {currentSubgroupList.length - 7} More</h3>
                </div>
              )}
              {expandedSubgroups && currentSubgroupList.length > 8 && (
                <div 
                  onClick={() => setExpandedSubgroups(false)}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex items-center p-3 gap-3 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gray-50 text-gray-600">
                    <ChevronRight className="w-4 h-4 -rotate-90" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Show Less</h3>
                </div>
              )}
            </div>
          )}

          {showTable && (
            <>
              <div className="relative flex-1 flex flex-col">
                {/* Main Table View */}
                <div className={`absolute inset-0 flex items-stretch transition-all duration-500 ease-in-out ${isProfileExpanded || !selectedAthleteId ? 'gap-0' : 'gap-6'} ${isTransferMode ? 'opacity-0 pointer-events-none translate-x-[-20px]' : 'opacity-100 pointer-events-auto translate-x-0'}`}>
                  {/* Left Side: Main Table */}
                  <div className={`bg-white border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col transition-all duration-500 ease-in-out flex-1 ${isProfileExpanded ? 'max-w-0 opacity-0 border-0' : 'max-w-full opacity-100 border'}`}>
                    <div className="overflow-auto flex-1">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                          <tr>
                            <th className="px-4 py-3 font-medium">Athlete</th>
                            <th className="px-4 py-3 font-medium">Sport</th>
                            <th className="px-4 py-3 font-medium">Current Location</th>
                            <th className="px-4 py-3 font-medium">Wellness Score</th>
                            <th className="px-4 py-3 font-medium">Academic Status</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredAthletes.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-4 py-8 text-center text-gray-500 text-sm">
                                No members found matching your search or filter.
                              </td>
                            </tr>
                          ) : (
                            filteredAthletes.map((athlete) => (
                              <tr 
                                key={athlete.id} 
                                className={`transition-colors group hover:bg-gray-50 ${selectedAthleteId === athlete.id ? 'bg-blue-50/50' : ''}`}
                              >
                              <td className="px-4 py-2.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 shrink-0">
                                    {getInitials(athlete)}
                                  </div>
                                  <span className="font-medium text-gray-900">{getFullName(athlete)}</span>
                                </div>
                              </td>
                              <td className="px-4 py-2.5 text-gray-600">{athlete.sport}</td>
                              <td className="px-4 py-2.5">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                  {athlete.location}
                                </span>
                              </td>
                              <td className="px-4 py-2.5">
                                <div className="flex items-center gap-2">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium ${getWellnessColor(athlete.wellness)}`}>
                                    {athlete.wellness}
                                    {getTrendIcon(athlete.trend)}
                                  </span>
                                  {/* Mini sparkline representation */}
                                  <div className="flex items-end gap-0.5 h-4 w-12 opacity-50">
                                    {[...Array(5)].map((_, i) => (
                                      <div key={i} className="w-1.5 bg-gray-400 rounded-t-sm" style={{ height: `${Math.max(20, Math.random() * 100)}%` }}></div>
                                    ))}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-2.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs text-gray-500 w-8">{athlete.gpa}</span>
                                  <span className={`text-xs ${athlete.academic === 'Warning' ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                                    {athlete.academic}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-2.5 text-right">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (selectedAthleteId === athlete.id) {
                                      setSelectedAthleteId(null);
                                      setIsProfileExpanded(false);
                                    } else {
                                      setSelectedAthleteId(athlete.id);
                                    }
                                  }}
                                  className={`p-1 rounded transition-opacity ${selectedAthleteId === athlete.id ? 'text-blue-600 bg-blue-100 opacity-100' : 'text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100'}`}
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          )))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Side: Student Details Panel */}
                  <div className={`bg-white border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden transition-all duration-500 ease-in-out shrink-0 ${selectedAthleteId ? (isProfileExpanded ? 'w-full max-w-full border opacity-100' : 'w-full max-w-[400px] lg:max-w-[500px] border opacity-100') : 'w-0 max-w-0 border-0 opacity-0'}`}>
                    {(() => {
                      const athlete = athletes.find(a => a.id === (selectedAthleteId || displayAthleteId));
                      if (!athlete) return null;
                      
                      return (
                        <div className={`flex flex-col h-full transition-all duration-500 ${isProfileExpanded ? 'w-full' : 'w-[100vw] sm:w-[400px] lg:w-[500px]'}`}>
                          <div className="p-6 border-b border-gray-200 flex items-start justify-between bg-gray-50/50">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700 shrink-0 shadow-sm border border-blue-200">
                                {getInitials(athlete)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h2 className="text-xl font-bold text-gray-900">{getFullName(athlete)}</h2>
                                  <button 
                                    onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                                    className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                                    title={isProfileExpanded ? "Collapse" : "Expand"}
                                  >
                                    {isProfileExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                  </button>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm text-gray-500 font-medium">{athlete.sport}</span>
                                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                  <span className="text-sm text-gray-500">{athlete.location}</span>
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                setSelectedAthleteId(null);
                                setIsProfileExpanded(false);
                              }}
                              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          
                          <div className="p-6 overflow-y-auto flex-1 space-y-8">
                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Wellness Score</div>
                                <div className="flex items-end gap-2">
                                  <span className={`text-2xl font-bold ${getWellnessColor(athlete.wellness).split(' ')[0]}`}>
                                    {athlete.wellness}
                                  </span>
                                  <span className={`flex items-center text-sm mb-1 ${athlete.trend === 'up' ? 'text-green-600' : athlete.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
                                    {getTrendIcon(athlete.trend)}
                                  </span>
                                </div>
                              </div>
                              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Academic GPA</div>
                                <div className="flex items-end gap-2">
                                  <span className="text-2xl font-bold text-gray-900">{athlete.gpa}</span>
                                  <span className={`text-sm font-medium mb-1 ${athlete.academic === 'Warning' ? 'text-red-600' : 'text-gray-500'}`}>
                                    {athlete.academic}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Groups */}
                            <div>
                              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                Associated Groups
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {athlete.groups.map(group => (
                                  <button 
                                    key={group} 
                                    onClick={() => handleGroupClick(group)}
                                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 cursor-pointer transition-colors shadow-sm"
                                  >
                                    {group}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Quick Actions */}
                            <div>
                              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-gray-400" />
                                Quick Actions
                              </h3>
                              <div className="space-y-2">
                                <button className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all text-left">
                                  <span className="text-sm font-medium text-gray-700">Send Message</span>
                                  <MessageSquare className="w-4 h-4 text-gray-400" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all text-left">
                                  <span className="text-sm font-medium text-gray-700">Log Medical Incident</span>
                                  <HeartPulse className="w-4 h-4 text-gray-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Transfer Mode View */}
                <div className={`absolute inset-0 flex gap-4 items-stretch transition-all duration-500 ease-in-out ${isTransferMode ? 'opacity-100 pointer-events-auto translate-x-0' : 'opacity-0 pointer-events-none translate-x-[20px]'}`}>
                  {/* Left List (Available) */}
                  <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-700 text-sm">Current Roster</h3>
                      <span className="text-xs font-medium bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{availableAthletes.length}</span>
                    </div>
                    <div className="overflow-auto flex-1">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 sticky top-0 z-10">
                          <tr>
                            <th className="px-4 py-2 w-12">
                              <input 
                                type="checkbox" 
                                checked={leftSelected.length === availableAthletes.length && availableAthletes.length > 0} 
                                onChange={(e) => setLeftSelected(e.target.checked ? availableAthletes.map(a => a.id) : [])} 
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                              />
                            </th>
                            <th className="px-4 py-2 font-medium">Athlete</th>
                            <th className="px-4 py-2 font-medium">Groups</th>
                            <th className="px-4 py-2 font-medium">Wellness</th>
                            <th className="px-4 py-2 font-medium">Academic</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {availableAthletes.map(athlete => (
                            <tr 
                              key={athlete.id} 
                              onClick={() => setLeftSelected(prev => prev.includes(athlete.id) ? prev.filter(id => id !== athlete.id) : [...prev, athlete.id])} 
                              className={`cursor-pointer transition-colors ${leftSelected.includes(athlete.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                            >
                              <td className="px-4 py-2 w-12" onClick={e => e.stopPropagation()}>
                                <input 
                                  type="checkbox" 
                                  checked={leftSelected.includes(athlete.id)} 
                                  onChange={() => setLeftSelected(prev => prev.includes(athlete.id) ? prev.filter(id => id !== athlete.id) : [...prev, athlete.id])} 
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                                />
                              </td>
                              <td className="px-4 py-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 shrink-0">
                                    {getInitials(athlete)}
                                  </div>
                                  <span className="font-medium text-gray-900">{getFullName(athlete)}</span>
                                </div>
                              </td>
                              <td className="px-4 py-2">
                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                  {athlete.groups.map(g => (
                                    <span key={g} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] border border-gray-200">
                                      {g}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-4 py-2">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium ${getWellnessColor(athlete.wellness)}`}>
                                  {athlete.wellness}
                                </span>
                              </td>
                              <td className="px-4 py-2">
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-gray-900">{athlete.gpa}</span>
                                  <span className={`text-[10px] ${athlete.academic === 'Warning' ? 'text-red-600' : 'text-gray-500'}`}>{athlete.academic}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Middle Controls */}
                  <div className="flex flex-col justify-center gap-4 shrink-0 px-2">
                    <button 
                      onClick={moveRight} 
                      disabled={leftSelected.length === 0} 
                      className={`p-3 rounded-xl border shadow-sm transition-all flex items-center justify-center ${leftSelected.length > 0 ? 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100 hover:scale-105' : 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'}`}
                    >
                      <ArrowRight className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={moveLeft} 
                      disabled={rightSelected.length === 0} 
                      className={`p-3 rounded-xl border shadow-sm transition-all flex items-center justify-center ${rightSelected.length > 0 ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:scale-105' : 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'}`}
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Right List (Transferring) */}
                  <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-3 border-b border-gray-200 bg-gray-50 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700 text-sm">Transfer Selection</h3>
                        <span className="text-xs font-medium bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{stagedAthletes.length}</span>
                      </div>
                      <div className="flex gap-2">
                        <select 
                          value={targetCategory} 
                          onChange={e => {
                            const val = e.target.value;
                            setTargetCategory(val);
                            if (val === 'Klassen') setTargetSpecific(classesList[0]);
                            else if (val === 'Sports') setTargetSpecific(sportsList[0]);
                            else if (val === 'Dorms') setTargetSpecific(dormsList[0]);
                            else setTargetSpecific('');
                          }} 
                          className="flex-1 border border-gray-200 rounded-md p-1.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                          {categoriesData.map(cat => (
                            <optgroup key={cat.title} label={cat.title}>
                              {cat.items.map(item => (
                                <option key={item.name} value={item.name}>{item.name}</option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        {['Klassen', 'Sports', 'Dorms'].includes(targetCategory) && (
                          <select 
                            value={targetSpecific} 
                            onChange={e => setTargetSpecific(e.target.value)} 
                            className="flex-1 border border-gray-200 rounded-md p-1.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                          >
                            {targetCategory === 'Klassen' ? (
                              classesData.map(g => (
                                <optgroup key={g.grade} label={g.grade}>
                                  {g.classes.map(c => <option key={c} value={c}>{c}</option>)}
                                </optgroup>
                              ))
                            ) : (
                              (targetCategory === 'Sports' ? sportsList : dormsList).map(item => <option key={item} value={item}>{item}</option>)
                            )}
                          </select>
                        )}
                      </div>
                    </div>
                    <div className="overflow-auto flex-1">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 sticky top-0 z-10">
                          <tr>
                            <th className="px-4 py-2 w-12">
                              <input 
                                type="checkbox" 
                                checked={rightSelected.length === transferringAthletes.length && transferringAthletes.length > 0} 
                                onChange={(e) => setRightSelected(e.target.checked ? transferringAthletes.map(a => a.id) : [])} 
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                              />
                            </th>
                            <th className="px-4 py-2 font-medium">Athlete</th>
                            <th className="px-4 py-2 font-medium">Wellness</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {transferringAthletes.length === 0 ? (
                            <tr>
                              <td colSpan={3} className="px-4 py-8 text-center text-gray-400 text-sm">
                                No athletes selected for transfer.<br/>Select athletes from the left and click the arrow.
                              </td>
                            </tr>
                          ) : (
                            transferringAthletes.map(athlete => (
                              <tr 
                                key={athlete.id} 
                                onClick={() => setRightSelected(prev => prev.includes(athlete.id) ? prev.filter(id => id !== athlete.id) : [...prev, athlete.id])} 
                                className={`cursor-pointer transition-colors ${rightSelected.includes(athlete.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                              >
                                <td className="px-4 py-2 w-12" onClick={e => e.stopPropagation()}>
                                  <input 
                                    type="checkbox" 
                                    checked={rightSelected.includes(athlete.id)} 
                                    onChange={() => setRightSelected(prev => prev.includes(athlete.id) ? prev.filter(id => id !== athlete.id) : [...prev, athlete.id])} 
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 shrink-0">
                                      {getInitials(athlete)}
                                    </div>
                                    <span className="font-medium text-gray-900">{getFullName(athlete)}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-2">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium ${getWellnessColor(athlete.wellness)}`}>
                                    {athlete.wellness}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end">
                      <button 
                        disabled={stagedAthletes.length === 0} 
                        onClick={() => { 
                          alert(`Transferred ${stagedAthletes.length} students to ${targetCategory}${targetSpecific ? ` > ${targetSpecific}` : ''}`); 
                          setIsTransferMode(false); 
                          setStagedAthletes([]); 
                          setLeftSelected([]); 
                          setRightSelected([]); 
                        }} 
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${stagedAthletes.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                      >
                        <Save className="w-4 h-4" />
                        Save Transfer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Unsaved Changes Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4 text-amber-600">
              <div className="p-2 bg-amber-50 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Unsaved Transfer</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              You have {stagedAthletes.length} student(s) staged for transfer. Do you want to save these changes before leaving?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowConfirmDialog(false);
                  setPendingAction(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowConfirmDialog(false);
                  if (pendingAction) pendingAction();
                }}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent"
              >
                Discard
              </button>
              <button 
                onClick={() => {
                  alert(`Transferred ${stagedAthletes.length} students to ${targetCategory}${targetSpecific ? ` > ${targetSpecific}` : ''}`);
                  setShowConfirmDialog(false);
                  if (pendingAction) pendingAction();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
