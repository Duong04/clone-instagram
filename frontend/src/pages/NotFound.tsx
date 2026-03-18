import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import { Home, ArrowLeft, Search } from "lucide-react";

export const NotFound = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#0a0a0a]">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-red-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-orange-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative inline-block mb-8"
        >
          <h1 className="text-[150px] md:text-[200px] font-black text-white/5 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-[32px] flex items-center justify-center shadow-2xl shadow-purple-500/20"
            >
              <Search className="w-12 h-12 md:w-16 md:h-16 text-white" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Page not found</h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-md mx-auto">
            Sorry, the page you are looking for doesn't exist or has been moved to another universe.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NavLink
              to="/"
              className="group flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-2xl transition-all hover:bg-zinc-200 active:scale-95"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </NavLink>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:bg-white/10 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping" />
      <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-white/10 rounded-full animate-bounce" />
      <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse" />
    </div>
  );
};
