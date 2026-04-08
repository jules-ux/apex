import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../AuthContext';
import { LogIn, Shield, Sparkles, School } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export const LoginPage = () => {
  const { user, loading, login } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/50 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-blue-200"
          >
            <School className="w-10 h-10 text-white" />
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">APEX</h1>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
              <Shield className="w-3 h-3" />
              Secure Admin Portal
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-sm text-gray-500">Sign in to manage your school's performance, logistics, and medical data.</p>
          </div>

          <button 
            onClick={login}
            className="w-full group relative flex items-center justify-center gap-3 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Sign in with Google
            <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <div className="pt-4 flex items-center justify-center gap-6 text-gray-400">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Real-time</span>
            </div>
            <div className="w-1 h-1 bg-gray-200 rounded-full" />
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Encrypted</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400">
          By signing in, you agree to our Terms of Service and Privacy Policy.
          <br />
          © 2026 APEX Education Systems
        </p>
      </motion.div>
    </div>
  );
};
