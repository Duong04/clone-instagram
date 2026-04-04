import { NavLink } from "react-router-dom";
import { Home, Search, PlaySquare, PlusSquare } from "lucide-react";
import { cn } from "~/shared/utils/cn";
import { motion } from "motion/react";
import { useModal } from "~/shared/context/modal/modalContext";

const bottomNavItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Explore", path: "/explore" },
  { icon: PlusSquare, label: "Create", path: "#", isCreate: true },
  { icon: PlaySquare, label: "Reels", path: "/reels" },
];

export const BottomNav = () => {
  const { openCreatePost } = useModal();
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-white border-t border-zinc-200 flex md:hidden items-center justify-around z-50">
      {bottomNavItems.map((item) => {
        if (item.isCreate) {
          return (
            <button
              key={item.label}
              onClick={openCreatePost}
              className="flex flex-col items-center justify-center w-full h-full text-zinc-500 transition-all duration-300"
            >
              <item.icon className="w-6 h-6 transition-transform duration-300" />
            </button>
          );
        }
        return (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full transition-all duration-300",
                isActive && item.path !== "#" ? "text-black" : "text-zinc-500",
              )
            }
          >
            {({ isActive }) => {
              const isActuallyActive = isActive && item.path !== "#";
              return (
                <div className="relative flex items-center justify-center w-full h-full">
                  <item.icon
                    className={cn(
                      "w-6 h-6 transition-transform duration-300",
                      isActuallyActive && "scale-110 stroke-[2.5px]",
                    )}
                  />
                  {isActuallyActive && (
                    <motion.div
                      layoutId="activeBottomNav"
                      className="absolute -top-[1px] w-12 h-[2px] bg-black rounded-full"
                    />
                  )}
                </div>
              );
            }}
          </NavLink>
        );
      })}

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          cn(
            "flex items-center justify-center w-full h-full transition-all duration-300",
            isActive ? "text-black" : "text-zinc-500",
          )
        }
      >
        {({ isActive }) => (
          <img
            src="https://i.pinimg.com/736x/7a/30/f4/7a30f422e3692265d6e2f4a331b59514.jpg"
            alt="Profile"
            className={cn(
              "w-6 h-6 rounded-full border border-zinc-200 transition-all duration-300",
              isActive && "ring-2 ring-black ring-offset-1",
            )}
            referrerPolicy="no-referrer"
          />
        )}
      </NavLink>
    </div>
  );
};
