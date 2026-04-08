import { User, LogOut, Shield, Bell, Globe, Lock, Mail, UserCircle } from 'lucide-react';
import { useAuth } from '../AuthContext';

export const AdminSettings = () => {
  const { user, login, logout } = useAuth();

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 pt-28 md:pt-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
          <p className="text-sm text-gray-500">Manage your account and application preferences.</p>
        </div>

        {/* Account Section */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <UserCircle className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Account Profile</h2>
          </div>
          <div className="p-6">
            {user ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-16 h-16 rounded-full border-2 border-gray-100" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-xl font-bold text-blue-600">
                      {user.displayName?.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <div className="text-lg font-bold text-gray-900">{user.displayName}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      {user.email}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-4">You are not signed in.</p>
                <button 
                  onClick={login}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Sign In with Google
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Other Settings Placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex items-start gap-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Notifications</h3>
              <p className="text-xs text-gray-500 mb-4">Configure how you receive alerts and updates.</p>
              <button className="text-xs font-medium text-blue-600 hover:underline">Manage preferences</button>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex items-start gap-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Security</h3>
              <p className="text-xs text-gray-500 mb-4">Review your security settings and permissions.</p>
              <button className="text-xs font-medium text-blue-600 hover:underline">View security log</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

