import { 
  Users, UserMinus, AlertCircle, Calendar, Trophy, 
  CheckSquare, Bell, TrendingUp, ChevronRight, Activity, BookOpen, Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSchool } from '../SchoolContext';
import { db, collection, query, where, onSnapshot } from '../firebase';

export const AdminDashboard = () => {
  const { selectedSchool } = useSchool();
  const [stats, setStats] = useState({
    totalEnrollment: 0,
    loading: true
  });

  useEffect(() => {
    const q = query(
      collection(db, 'members'),
      where('schoolId', '==', selectedSchool.id)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStats({
        totalEnrollment: snapshot.size > 0 ? snapshot.size : 300, // Fallback to 300 if empty for demo
        loading: false
      });
    });

    return () => unsubscribe();
  }, [selectedSchool.id]);
  
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 pt-28 md:pt-24">
      <div className="w-full max-w-[1600px] mx-auto space-y-6">
        
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{selectedSchool.name} Overview</h1>
          <p className="text-sm text-gray-500">Real-time performance and attendance tracking.</p>
        </div>
        
        {/* 1. Daily Attendance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Enrollment</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.loading ? <Loader2 className="w-5 h-5 animate-spin text-blue-600" /> : stats.totalEnrollment}
                </h3>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">100% Present</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Absences Today</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900">12</h3>
                <span className="text-xs font-medium text-gray-500">Across 4 Years</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
              <UserMinus className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-red-200 shadow-sm flex items-center justify-between relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Flagged Concerns</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-red-600">3</h3>
                <span className="text-xs font-medium text-red-600">require action</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Span 2): Tasks & Notifications */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Task List */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                  Action Required (Tasks)
                </h2>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-800">View All</button>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { title: 'Approve Field Trip Leave', desc: '14 pending requests from Year 10 Biology (Class 10B)', type: 'Approval', urgent: true },
                  { title: 'Review Medical Clearance Forms', desc: '5 athletes awaiting clearance for Varsity Soccer', type: 'Form', urgent: true },
                  { title: 'Update Academic Probation List', desc: 'Review mid-term grades for Year 11 student athletes', type: 'Report', urgent: false },
                  { title: 'Schedule Bus Transport', desc: 'Away games for Basketball (Year 9) and Track (Year 12)', type: 'Logistics', urgent: false },
                ].map((task, i) => (
                  <div key={i} className="p-4 hover:bg-gray-50 transition-colors flex items-start justify-between group cursor-pointer">
                    <div className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                          {task.urgent && <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[9px] font-bold uppercase tracking-wider rounded">Urgent</span>}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{task.desc}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">{task.type}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Notifications Panel */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-500" />
                  System Notifications
                </h2>
              </div>
              <div className="p-2">
                <div className="p-3 mb-2 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-900">Compliance Reminder</h4>
                    <p className="text-xs text-amber-700 mt-0.5">Annual safeguarding certifications for 3 Track & Field coaches expire in 14 days.</p>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
                  <BookOpen className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Policy Update</h4>
                    <p className="text-xs text-blue-700 mt-0.5">The new away-game travel policy for Junior Years (9 & 10) has been published.</p>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column: Calendar Widget */}
          <div className="space-y-6">
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Upcoming Schedule
                </h2>
                <button className="p-1 hover:bg-gray-200 rounded text-gray-500"><ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 pb-4">
                  {[
                    { time: '14:00', title: 'AP Physics Midterm', type: 'Academic - Year 12', color: 'bg-blue-500' },
                    { time: '15:30', title: 'Varsity Soccer Practice', type: 'Athletic - All Years', color: 'bg-emerald-500' },
                    { time: '16:00', title: 'Biology Field Trip Return', type: 'Academic - Class 10B', color: 'bg-blue-500' },
                    { time: '17:00', title: 'Regional Swim Meet', type: 'Athletic - Year 11/12', color: 'bg-emerald-500' },
                    { time: '19:00', title: 'All-Staff Meeting', type: 'Admin', color: 'bg-purple-500' },
                  ].map((event, i) => (
                    <div key={i} className="relative pl-6">
                      <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${event.color} ring-4 ring-white`}></div>
                      <div className="text-xs font-bold text-gray-400 mb-0.5">{event.time}</div>
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      <div className="text-xs text-gray-500">{event.type}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
