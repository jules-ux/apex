import { Calendar, Clock, AlertTriangle, MapPin } from 'lucide-react';

export const AdminLogistics = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 pt-28 md:pt-24">
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Logistics & Scheduling</h1>
            <p className="text-sm text-gray-500 mt-1">Dual-track conflict resolution</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Today, Apr 6
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Conflicts List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Active Conflicts (2)
            </h2>
            
            {/* Conflict Card 1 (Active) */}
            <div className="bg-white border-2 border-blue-500 rounded-xl p-4 shadow-sm cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-gray-900">Sarah Jenkins</div>
                <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded uppercase tracking-wider">Overlap</span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                Physics Midterm vs. Pre-Match Briefing
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                14:00 - 15:30
              </div>
            </div>

            {/* Conflict Card 2 */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm cursor-pointer hover:border-gray-300 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-gray-900">Swim Team (4)</div>
                <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded uppercase tracking-wider">Travel</span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                Bus departure conflicts with late lab sessions.
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                16:00 - 16:45
              </div>
            </div>
          </div>

          {/* Right Column: Dual-Track Visualizer */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="font-medium text-gray-900">Schedule Analysis: Sarah Jenkins</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Basketball • Junior Year</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50">Email Professor</button>
                  <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700">Excuse from Briefing</button>
                </div>
              </div>
              
              {/* Timeline Grid */}
              <div className="flex-1 p-6 relative overflow-y-auto">
                {/* Track Headers */}
                <div className="flex ml-16 mb-4">
                  <div className="flex-1 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Academic Track</div>
                  <div className="flex-1 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Athletic Track</div>
                </div>

                <div className="relative">
                  {/* Time markers */}
                  {['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
                    <div key={time} className="flex items-center mb-12 last:mb-0">
                      <div className="w-16 text-xs font-mono text-gray-400 shrink-0">{time}</div>
                      <div className="flex-1 border-t border-gray-100"></div>
                    </div>
                  ))}

                  {/* Blocks Container (Absolute positioning overlay) */}
                  <div className="absolute top-0 left-16 right-0 bottom-0 flex gap-4">
                    {/* Academic Column */}
                    <div className="flex-1 relative">
                      {/* 13:00 - 14:00 Block (48px = 1 hour, top 48px = 13:00) */}
                      <div className="absolute top-[48px] h-[48px] left-0 right-0 bg-blue-50 border border-blue-200 rounded-lg p-2 overflow-hidden">
                        <div className="text-xs font-bold text-blue-900">Study Hall</div>
                        <div className="text-[10px] text-blue-700 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/> Library</div>
                      </div>
                      {/* 14:00 - 15:30 Block (Conflict) */}
                      <div className="absolute top-[96px] h-[72px] left-0 right-0 bg-red-50 border-2 border-red-400 rounded-lg p-2 overflow-hidden shadow-[0_0_0_3px_rgba(248,113,113,0.2)] z-10">
                        <div className="text-xs font-bold text-red-900">Physics Midterm</div>
                        <div className="text-[10px] text-red-700 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/> Science Center 301</div>
                        <div className="text-[10px] font-bold text-red-600 mt-1 uppercase tracking-wider">Mandatory</div>
                      </div>
                    </div>

                    {/* Athletic Column */}
                    <div className="flex-1 relative">
                      {/* 14:30 - 15:30 Block (Conflict) */}
                      <div className="absolute top-[120px] h-[48px] left-0 right-0 bg-red-50 border-2 border-red-400 rounded-lg p-2 overflow-hidden shadow-[0_0_0_3px_rgba(248,113,113,0.2)] z-10">
                        <div className="text-xs font-bold text-red-900">Pre-Match Briefing</div>
                        <div className="text-[10px] text-red-700 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/> Locker Room A</div>
                      </div>
                      {/* 15:30 - 17:00 Block */}
                      <div className="absolute top-[168px] h-[72px] left-0 right-0 bg-emerald-50 border border-emerald-200 rounded-lg p-2 overflow-hidden">
                        <div className="text-xs font-bold text-emerald-900">Championship Match</div>
                        <div className="text-[10px] text-emerald-700 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/> Main Arena</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
