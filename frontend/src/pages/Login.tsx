import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Instagram, Facebook, Mail, Lock, ArrowRight } from "lucide-react";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#0a0a0a]">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px] relative z-10"
      >
        <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-16 h-16 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20"
            >
              <Instagram className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome back</h1>
            <p className="text-zinc-400 text-sm">Enter your details to access your account</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 ml-1">Email or Username</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="name@example.com"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-11 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-medium text-zinc-400">Password</label>
                <a href="#" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-11 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="group w-full bg-white text-black font-bold py-4 rounded-2xl text-sm transition-all hover:bg-zinc-200 active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
            >
              Sign In
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#121212] px-4 text-zinc-500 font-medium">Or continue with</span>
            </div>
          </div>

          <button className="w-full bg-white/[0.05] border border-white/10 text-white font-semibold py-3.5 rounded-2xl text-sm transition-all hover:bg-white/[0.1] active:scale-[0.98] flex items-center justify-center gap-3">
            <Facebook className="w-5 h-5 text-[#1877F2] fill-[#1877F2]" />
            Facebook
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-zinc-400 text-sm">
            Don't have an account?{" "}
            <NavLink to="/register" className="text-white font-bold hover:underline underline-offset-4">
              Create one now
            </NavLink>
          </p>
        </motion.div>
      </motion.div>

    </div>
  );
};
