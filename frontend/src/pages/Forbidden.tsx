import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import { ShieldAlert, Lock, Home, ArrowLeft } from "lucide-react";

export const Forbidden = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#0a0a0a]">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative inline-block mb-8"
        >
          <h1 className="text-[150px] md:text-[200px] font-black text-white/5 leading-none select-none">
            403
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -10, 10, 0]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-24 h-24 md:w-32 md:h-32 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] flex items-center justify-center shadow-2xl"
            >
              <Lock className="w-12 h-12 md:w-16 md:h-16 text-red-500" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Access Denied</h2>
          </div>
          <p className="text-zinc-400 text-lg mb-10 max-w-md mx-auto">
            You don't have permission to access this area. Please contact an administrator if you think this is a mistake.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NavLink
              to="/"
              className="group flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-2xl transition-all hover:bg-zinc-200 active:scale-95"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </NavLink>
            <NavLink
              to="/login"
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:bg-white/10 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
              Sign in as Admin
            </NavLink>
          </div>
        </motion.div>
      </div>

      {/* Security scan effect */}
      <motion.div 
        animate={{ 
          top: ["0%", "100%", "0%"] 
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute left-0 right-0 h-[1px] bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.5)] z-0"
      />
    </div>
  );
};
