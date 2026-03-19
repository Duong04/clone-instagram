import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import {
  Instagram,
  Facebook,
  Mail,
  Lock,
  User,
  UserCircle,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useRegister } from "../hooks/useRegister";

export const RegisterPage = () => {
  const { form, serverError, isLoading, handleSubmit } = useRegister();
  const { register, formState: { errors } } = form

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#0a0a0a]">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] right-[20%] w-[40%] h-[40%] rounded-full bg-orange-600/20 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[450px] relative z-10"
      >
        <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-14 h-14 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-2xl flex items-center justify-center mb-5 shadow-lg"
            >
              <Instagram className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
              Create an account
            </h1>
            <p className="text-zinc-400 text-sm text-center">
              Join our community of creators and share your story
            </p>
          </div>

          <button className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-3.5 rounded-2xl text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-3 mb-6">
            <Facebook className="w-5 h-5 fill-white" />
            Continue with Facebook
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
              <span className="bg-[#121212] px-4 text-zinc-500 font-bold">
                Or sign up with email
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="space-y-1.5 md:col-span-2">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  {...register('email')}
                  type="text"
                  placeholder="Email address"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-11 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
               {errors.email && (
                <p className="text-red-400 text-xs ml-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Full name"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-11 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs ml-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="relative">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  {...register('username')}
                  type="text"
                  placeholder="Username"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-11 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
              {errors.username && (
                <p className="text-red-400 text-xs ml-1">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  {...register('password')}
                  type="password"
                  placeholder="Create password"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-11 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs ml-1">{errors.password.message}</p>
              )}
            </div>

            {/* Error */}
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full md:col-span-2 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-red-400 text-xs">{serverError}</p>
              </motion.div>
            )}
            <div className="md:col-span-2 py-2">
              <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
                By signing up, you agree to our{" "}
                <a href="#" className="text-white hover:underline">
                  Terms
                </a>
                ,{" "}
                <a href="#" className="text-white hover:underline">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="#" className="text-white hover:underline">
                  Cookies Policy
                </a>
                .
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group md:col-span-2 w-full bg-white text-black font-bold py-4 rounded-2xl text-sm transition-all hover:bg-zinc-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Creating an account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-zinc-400 text-sm">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="text-white font-bold hover:underline underline-offset-4"
            >
              Sign in
            </NavLink>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
