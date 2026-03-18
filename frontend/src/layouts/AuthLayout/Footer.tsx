export const Footer = () => {
  return (
    <footer className="absolute bottom-8 left-0 right-0 text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-bold flex justify-center gap-8 px-4">
        <span className="hover:text-zinc-400 cursor-pointer transition-colors">Privacy</span>
        <span className="hover:text-zinc-400 cursor-pointer transition-colors">Terms</span>
        <span className="hover:text-zinc-400 cursor-pointer transition-colors">Help</span>
        <span className="hidden md:inline">© { new Date().getFullYear() } INSTAGRAM FROM META</span>
    </footer>
  );
};
