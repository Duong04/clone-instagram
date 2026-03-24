import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  ChevronDown,
  Smile,
  ChevronRight,
  Music,
  Play,
  Pause,
  X,
} from "lucide-react";
import type { Song } from "~/shared/types/music";
import { MusicPicker } from "../components/MusicPicker";

interface StepPostDetailsProps {
  caption: string;
  onCaptionChange: (val: string) => void;
  location: string;
  onLocationChange: (val: string) => void;
  hashtags: string;
  onHashtagsChange: (val: string) => void;
  selectedMusic: Song | null;
  onMusicSelect: (song: Song) => void;
  onMusicRemove: () => void;
  isMusicPickerOpen: boolean;
  onMusicPickerOpen: () => void;
  onMusicPickerClose: () => void;
  playingSongId: string | null;
  onTogglePlay: (song: Song, e: React.MouseEvent) => void;
}

export const StepPostDetails: React.FC<StepPostDetailsProps> = ({
  caption,
  onCaptionChange,
  location,
  onLocationChange,
  hashtags,
  onHashtagsChange,
  selectedMusic,
  onMusicSelect,
  onMusicRemove,
  isMusicPickerOpen,
  onMusicPickerOpen,
  onMusicPickerClose,
  playingSongId,
  onTogglePlay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-full md:w-80 border-l border-zinc-200 dark:border-zinc-800 flex flex-col bg-white dark:bg-zinc-900 overflow-hidden"
    >
      <div className="flex-1 overflow-y-auto relative">
        {/* Music Picker Overlay */}
        <AnimatePresence>
          {isMusicPickerOpen && (
            <MusicPicker
              onClose={onMusicPickerClose}
              onSelect={onMusicSelect}
              playingSongId={playingSongId}
              onTogglePlay={onTogglePlay}
            />
          )}
        </AnimatePresence>

        {/* User Info */}
        <div className="p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[1.5px]">
            <div className="w-full h-full rounded-full border-2 border-white dark:border-zinc-900 overflow-hidden">
              <img
                src="https://picsum.photos/seed/user/100/100"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <span className="font-semibold text-sm">johndoe_official</span>
        </div>

        {/* Caption */}
        <div className="px-4">
          <textarea
            placeholder="Write a caption..."
            className="w-full h-32 resize-none text-sm focus:outline-none bg-transparent"
            value={caption}
            onChange={(e) => onCaptionChange(e.target.value)}
          />
          <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
            <Smile className="w-5 h-5 text-zinc-400 cursor-pointer" />
            <span className="text-xs text-zinc-400">
              {caption.length}/2,200
            </span>
          </div>
        </div>

        {/* Music */}
        <div className="p-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
          <div
            onClick={onMusicPickerOpen}
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            <Music className="w-5 h-5 text-zinc-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm">Add music</p>
              {selectedMusic && (
                <p className="text-xs text-sky-500 font-medium truncate">
                  {selectedMusic.title} • {selectedMusic.artist}
                </p>
              )}
            </div>
          </div>
          {selectedMusic ? (
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => onTogglePlay(selectedMusic, e)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
              >
                {playingSongId === selectedMusic.id ? (
                  <Pause className="w-5 h-5 text-sky-500 fill-sky-500" />
                ) : (
                  <Play className="w-5 h-5 text-zinc-400 fill-zinc-400" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMusicRemove();
                }}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          ) : (
            <ChevronRight className="w-5 h-5 text-zinc-500" />
          )}
        </div>

        {/* Hashtags */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
          <input
            type="text"
            placeholder="Add hashtags (e.g. #nature #photography)"
            className="w-full text-sm focus:outline-none bg-transparent"
            value={hashtags}
            onChange={(e) => onHashtagsChange(e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="p-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
          <div className="flex items-center gap-2 flex-1">
            <MapPin className="w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Add location"
              className="w-full text-sm focus:outline-none bg-transparent"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
            />
          </div>
        </div>

        {/* Accessibility & Advanced */}
        <div className="p-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
          <span className="text-sm">Accessibility</span>
          <ChevronDown className="w-5 h-5 text-zinc-500" />
        </div>
        <div className="p-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
          <span className="text-sm">Advanced settings</span>
          <ChevronDown className="w-5 h-5 text-zinc-500" />
        </div>
      </div>
    </motion.div>
  );
};
