import { NavLink } from "react-router-dom";
import {
  Home,
  Search,
  Compass,
  PlaySquare,
  MessageCircle,
  Heart,
  PlusSquare,
  Menu,
  Instagram,
} from "lucide-react";
import { cn } from "~/shared/utils/cn.ts";
import { motion } from "motion/react";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Search", path: "/explore" },
  { icon: Compass, label: "Explore", path: "/explore" },
  { icon: PlaySquare, label: "Reels", path: "/reels" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
  { icon: Heart, label: "Notifications", path: "#" },
  { icon: PlusSquare, label: "Create", path: "#" },
];

export const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-full w-[72px] xl:w-60 border-r border-zinc-200 bg-white px-3 py-8 hidden md:flex flex-col z-50 transition-all duration-500 ease-in-out">
      <div className="mb-10 px-3">
        <NavLink to="/" className="block">
          <Instagram className="xl:hidden w-7 h-7" />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden xl:block font-serif italic text-2xl font-bold tracking-tight"
          >
            Instagram
          </motion.span>
        </NavLink>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-zinc-100 group relative",
                isActive && item.path !== "#" ? "font-bold" : "font-normal",
              )
            }
          >
            {({ isActive }) => {
              const isActuallyActive = isActive && item.path !== "#";
              return (
                <>
                  <item.icon
                    className={cn(
                      "w-7 h-7 transition-transform duration-300 group-hover:scale-110",
                      isActuallyActive && "scale-110",
                    )}
                  />
                  <span className="hidden xl:block text-base">
                    {item.label}
                  </span>
                  {isActuallyActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 w-1 h-6 bg-black rounded-r-full"
                    />
                  )}
                </>
              );
            }}
          </NavLink>
        ))}

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-zinc-100 group",
              isActive ? "font-bold" : "font-normal",
            )
          }
        >
          {({ isActive }) => (
            <>
              <img
                src="https://i.pinimg.com/736x/7a/30/f4/7a30f422e3692265d6e2f4a331b59514.jpg"
                alt="Profile"
                className={cn(
                  "w-7 h-7 rounded-full border border-zinc-200 transition-all duration-300 group-hover:scale-110",
                  isActive && "ring-2 ring-black ring-offset-2",
                )}
                referrerPolicy="no-referrer"
              />
              <span className="hidden xl:block text-base">Profile</span>
            </>
          )}
        </NavLink>
      </nav>

      <div className="mt-auto">
        <button className="flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-zinc-100 w-full group">
          <Menu className="w-7 h-7 group-hover:scale-110 transition-transform" />
          <span className="hidden xl:block text-base">More</span>
        </button>
      </div>
    </div>
  );
};
