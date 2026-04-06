import { Search, Filter, MoreHorizontal, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const athletes = [
  { id: '1', name: 'Thomas Vermeersch', sport: 'Swimming', location: 'Main Pool', wellness: 85, trend: 'up', academic: 'Good Standing', gpa: '3.8' },
  { id: '2', name: 'Sarah Jenkins', sport: 'Basketball', location: 'Class (B204)', wellness: 62, trend: 'down', academic: 'Warning', gpa: '2.4' },
  { id: '3', name: 'Marcus Johnson', sport: 'Track & Field', location: 'Physio', wellness: 45, trend: 'down', academic: 'Good Standing', gpa: '3.2' },
  { id: '4', name: 'Emma Wilson', sport: 'Gymnastics', location: 'Dormitory', wellness: 92, trend: 'stable', academic: 'Excellence', gpa: '4.0' },
  { id: '5', name: 'David Chen', sport: 'Swimming', location: 'Main Pool', wellness: 78, trend: 'up', academic: 'Good Standing', gpa: '3.5' },
  { id: '6', name: 'Lucas Peeters', sport: 'Basketball', location: 'Weight Room', wellness: 88, trend: 'stable', academic: 'Good Standing', gpa: '3.1' },
  { id: '7', name: 'Mia Rodriguez', sport: 'Track & Field', location: 'Class (A101)', wellness: 71, trend: 'down', academic: 'Good Standing', gpa: '3.6' },
  { id: '8', name: 'Noah Kim', sport: 'Gymnastics', location: 'Training Hall', wellness: 95, trend: 'up', academic: 'Excellence', gpa: '3.9' },
  { id: '9', name: 'Liam O\'Connor', sport: 'Soccer', location: 'Field 2', wellness: 82, trend: 'up', academic: 'Good Standing', gpa: '3.4' },
  { id: '10', name: 'Chloe Dubois', sport: 'Tennis', location: 'Court 4', wellness: 58, trend: 'down', academic: 'Warning', gpa: '2.8' },
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

export const AdminRoster = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 pt-28 md:pt-24">
      <div className="w-full">
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search athletes..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white shrink-0">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
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
                {athletes.map((athlete) => (
                  <tr key={athlete.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 shrink-0">
                          {athlete.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium text-gray-900">{athlete.name}</span>
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
                      <button className="p-1 text-gray-400 hover:text-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
