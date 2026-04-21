import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Search as SearchIcon, Play, Pause } from "lucide-react";
import type { Song } from "~/shared/types/post";

interface MusicPickerProps {
  onClose: () => void;
  onSelect: (song: Song) => void;
  playingSongId: string | null;
  onTogglePlay: (song: Song, e: React.MouseEvent) => void;
}

interface ItunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl?: string;
}

interface ItunesResponse {
  results: ItunesTrack[];
}

const fetchMusic = async (query: string): Promise<Song[]> => {
  const response = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=20`,
  );
  const data: ItunesResponse = await response.json();
  return data.results.map((item) => ({
    id: item.trackId.toString(),
    title: item.trackName,
    artist: item.artistName,
    cover: item.artworkUrl100.replace("100x100", "400x400"),
    previewUrl: item.previewUrl,
  }));
};

export const MusicPicker = (props: MusicPickerProps) => {
  const { onClose, onSelect, playingSongId, onTogglePlay } = props;
  const [musicSearch, setMusicSearch] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    const query = musicSearch.trim() || "trending";
    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await fetchMusic(query);
        setSongs(results);
      } catch (error) {
        console.error("Error fetching music:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [musicSearch]);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      className="absolute inset-0 bg-white dark:bg-zinc-900 z-20 flex flex-col"
    >
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
        <button onClick={onClose}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center px-3 py-1.5 gap-2">
          <SearchIcon className="w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search music"
            className="bg-transparent text-sm w-full focus:outline-none"
            value={musicSearch}
            onChange={(e) => setMusicSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-zinc-500">Searching music...</p>
          </div>
        ) : songs.length > 0 ? (
          songs.map((song) => (
            <div
              key={song.id}
              onClick={() => onSelect(song)}
              className="w-full p-4 flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(song);
                }
              }}
            >
              <img
                src={song.cover}
                alt={song.title}
                className="w-12 h-12 rounded-md object-cover bg-zinc-100"
              />
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold truncate">{song.title}</p>
                <p className="text-xs text-zinc-500 truncate">{song.artist}</p>
              </div>
              <button
                onClick={(e) => onTogglePlay(song, e)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
              >
                {playingSongId === song.id ? (
                  <Pause className="w-5 h-5 text-sky-500 fill-sky-500" />
                ) : (
                  <Play className="w-5 h-5 text-zinc-400 fill-zinc-400" />
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-zinc-500">
            <p className="text-sm">No songs found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
