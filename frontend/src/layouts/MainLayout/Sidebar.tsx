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
import { cn } from "~/shared/utils/cn";
import { motion } from "motion/react";
import { useAuthStore } from "~/features/auth/store/useAuthStore";
import { Avatar, AvatarImage } from "~/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/shared/components/ui/dropdown-menu";
import { Settings, ShieldUser, LogOut } from "lucide-react";
import { useModal } from "~/shared/context/modal/modalContext";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Search", path: "/explore" },
  { icon: Compass, label: "Explore", path: "/explore" },
  { icon: PlaySquare, label: "Reels", path: "/reels" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
  { icon: Heart, label: "Notifications", path: "#" },
  { icon: PlusSquare, label: "Create", path: "#", isCreate: true },
];

export const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const { openCreatePost } = useModal();

  return (
    <div className="fixed left-0 top-0 h-full w-[72px] xl:w-60 border-r border-zinc-200 bg-white px-3 py-8 hidden md:flex flex-col z-50 transition-all duration-500 ease-in-out">
      <div className="mb-10 px-3">
        <NavLink to="/" className="block">
          <motion.div
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Instagram className="xl:hidden w-7 h-7" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02, x: 2 }}
            className="hidden xl:block font-serif italic text-2xl font-bold tracking-tight origin-left"
          >
            Instagram
          </motion.span>
        </NavLink>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          if (item.isCreate) {
            return (
              <motion.button
                key={item.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openCreatePost}
                className="flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-zinc-100 group relative w-full text-left"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <item.icon className="w-7 h-7 transition-transform duration-300" />
                </motion.div>
                <span className="hidden xl:block text-base">{item.label}</span>
              </motion.button>
            );
          }
          return (
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
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <item.icon
                        className={cn(
                          "w-7 h-7 transition-transform duration-300",
                          isActuallyActive && "scale-110",
                        )}
                      />
                    </motion.div>
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
          );
        })}

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
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Avatar
                  className={
                    isActive ? "ring-2 ring-black ring-offset-2" : undefined
                  }
                >
                  <AvatarImage src={user?.avatar?.url} />
                </Avatar>
              </motion.div>

              <span className="hidden xl:block text-base">Profile</span>
            </>
          )}
        </NavLink>
      </nav>

      <div className="mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-zinc-100 w-full group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Menu className="w-7 h-7 transition-transform" />
            </motion.div>
              <span className="hidden xl:block text-base">More</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <ShieldUser />
                Account center
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={logout} variant="destructive">
                <LogOut />
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
