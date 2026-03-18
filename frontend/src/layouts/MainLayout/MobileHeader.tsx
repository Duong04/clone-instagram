import { Heart, MessageCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

export const MobileHeader = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-12 bg-white border-b border-zinc-200 flex md:hidden items-center justify-between px-4 z-50">
      <NavLink to="/" className="font-serif italic text-xl font-bold tracking-tight">
        Instagram
      </NavLink>
      <div className="flex items-center gap-4">
        <button className="hover:opacity-60 transition-opacity">
          <Heart className="w-6 h-6" />
        </button>
        <NavLink to="/messages" className="hover:opacity-60 transition-opacity">
          <MessageCircle className="w-6 h-6" />
        </NavLink>
      </div>
    </div>
  );
};
