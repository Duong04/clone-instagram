import React, { useState, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "motion/react";
import { 
  X, 
  Image as ImageIcon, 
  ArrowLeft, 
  MapPin, 
  ChevronDown, 
  Smile,
  Plus,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Trash2,
  Music,
  Search as SearchIcon,
  Play,
  Pause
} from "lucide-react";
import { cn } from "~/lib/utils";

interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  previewUrl?: string;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FILTERS = [
  { name: "Normal", class: "" },
  { name: "Clarendon", class: "contrast-[1.2] saturate-[1.35]" },
  { name: "Gingham", class: "sepia-[0.2] contrast-[0.9]" },
  { name: "Moon", class: "grayscale-[1] contrast-[1.1] brightness-[1.1]" },
  { name: "Lark", class: "contrast-[0.9]" },
  { name: "Reyes", class: "sepia-[0.22] brightness-[1.1] contrast-[0.85] saturate-[0.75]" },
  { name: "Juno", class: "sepia-[0.35] contrast-[1.15] brightness-[1.15] saturate-[1.8]" },
  { name: "Slumber", class: "sepia-[0.35] contrast-[1.25] saturate-[1.25]" },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [selectedMusic, setSelectedMusic] = useState<Song | null>(null);
  const [isMusicPickerOpen, setIsMusicPickerOpen] = useState(false);
  const [musicSearch, setMusicSearch] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [isMusicLoading, setIsMusicLoading] = useState(false);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle audio playback
  const togglePlay = (song: Song, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the song when clicking play
    
    if (playingSongId === song.id) {
      audioRef.current?.pause();
      setPlayingSongId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      if (song.previewUrl) {
        const audio = new Audio(song.previewUrl);
        audioRef.current = audio;
        audio.play().catch(err => console.error("Audio play error:", err));
        setPlayingSongId(song.id);
        
        audio.onended = () => {
          setPlayingSongId(null);
          audioRef.current = null;
        };
      }
    }
  };

  // Stop music when picker closes, UNLESS it's the selected song
  React.useEffect(() => {
    if (!isMusicPickerOpen && audioRef.current && playingSongId !== selectedMusic?.id) {
      audioRef.current.pause();
      setPlayingSongId(null);
    }
  }, [isMusicPickerOpen, selectedMusic, playingSongId]);

  // Auto-play selected music when reaching Step 3
  React.useEffect(() => {
    if (step === 3 && selectedMusic && playingSongId !== selectedMusic.id) {
      if (selectedMusic.previewUrl) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(selectedMusic.previewUrl);
        audioRef.current = audio;
        audio.play().catch(err => console.error("Autoplay error:", err));
        setPlayingSongId(selectedMusic.id);
        
        audio.onended = () => {
          setPlayingSongId(null);
          audioRef.current = null;
        };
      }
    }
  }, [step, selectedMusic]);

  // Cleanup audio on unmount
  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Fetch music from iTunes API
  const fetchMusic = async (query: string) => {
    if (!query) {
      setSongs([]);
      return;
    }

    setIsMusicLoading(true);
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=20`);
      const data = await response.json();
      const formattedSongs: Song[] = data.results.map((item: any) => ({
        id: item.trackId.toString(),
        title: item.trackName,
        artist: item.artistName,
        cover: item.artworkUrl100.replace("100x100", "400x400"),
        previewUrl: item.previewUrl
      }));
      setSongs(formattedSongs);
    } catch (error) {
      console.error("Error fetching music:", error);
    } finally {
      setIsMusicLoading(false);
    }
  };

  // Debounced search
  React.useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    if (musicSearch.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        fetchMusic(musicSearch);
      }, 500);
    } else {
      // Show some default songs if search is empty
      fetchMusic("trending");
    }

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [musicSearch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length > 0) {
      const newImages: string[] = [];
      let processed = 0;

      files.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          processed++;
          if (processed === files.length) {
            setSelectedImages((prev) => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    if (currentImageIndex >= selectedImages.length - 1) {
      setCurrentImageIndex(Math.max(0, selectedImages.length - 2));
    }
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setStep(1);
    setSelectedImages([]);
    setCurrentImageIndex(0);
    setSelectedFilter(FILTERS[0]);
    setCaption("");
    setLocation("");
    setHashtags("");
    setSelectedMusic(null);
    setIsMusicPickerOpen(false);
    setPlayingSongId(null);
    onClose();
  };

  const handleShare = () => {
    console.log("Sharing post:", { selectedImages, selectedFilter, caption, location, hashtags, selectedMusic });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      <button 
        onClick={handleClose}
        className="absolute top-4 right-4 text-white hover:text-zinc-300 transition-colors z-[110]"
      >
        <X className="w-8 h-8" />
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative z-[110] bg-white dark:bg-zinc-900 rounded-xl overflow-hidden w-full max-w-[900px] shadow-2xl flex flex-col"
        style={{ maxHeight: "calc(100vh - 80px)" }}
      >
        {/* Header */}
        <div className="h-12 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 shrink-0">
          <div className="w-10">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="hover:text-zinc-500 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
          </div>
          <h2 className="font-semibold text-sm md:text-base">
            {step === 1 && "Select photos"}
            {step === 2 && "Edit"}
            {step === 3 && "Create new post"}
          </h2>
          <div className="w-10 flex justify-end">
            {step === 1 && selectedImages.length > 0 && (
              <button 
                onClick={() => setStep(2)}
                className="text-sky-500 font-semibold text-sm hover:text-sky-600 transition-colors"
              >
                Next
              </button>
            )}
            {step === 2 && (
              <button 
                onClick={() => setStep(3)}
                className="text-sky-500 font-semibold text-sm hover:text-sky-600 transition-colors"
              >
                Next
              </button>
            )}
            {step === 3 && (
              <button 
                onClick={handleShare}
                className="text-sky-500 font-semibold text-sm hover:text-sky-600 transition-colors"
              >
                Share
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Main Preview Area */}
          <div className={cn(
            "flex-1 bg-zinc-50 dark:bg-black flex items-center justify-center relative overflow-hidden",
            step === 1 && selectedImages.length === 0 ? "aspect-square" : ""
          )}>
            {step === 1 && selectedImages.length === 0 ? (
              <div className="flex flex-col items-center gap-4 p-8 text-center">
                <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-2">
                  <ImageIcon className="w-12 h-12 text-zinc-400" />
                </div>
                <p className="text-xl font-light">Drag photos and videos here</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-1.5 rounded-lg text-sm transition-colors mt-2"
                >
                  Select from computer
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                  multiple
                />
              </div>
            ) : step === 1 ? (
              <div className="w-full h-full p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Selected ({selectedImages.length})</h3>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-sky-500 text-xs font-semibold hover:text-sky-600"
                  >
                    <Plus className="w-4 h-4" />
                    Add more
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" multiple />
                </div>
                
                <Reorder.Group 
                  axis="y" 
                  values={selectedImages} 
                  onReorder={setSelectedImages}
                  className="space-y-3"
                >
                  {selectedImages.map((img, index) => (
                    <Reorder.Item 
                      key={img} 
                      value={img}
                      className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 flex items-center gap-4 group cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical className="w-5 h-5 text-zinc-400 shrink-0" />
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <img src={img} alt={`Selected ${index}`} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-zinc-500 truncate">Image {index + 1}</p>
                      </div>
                      <button 
                        onClick={() => removeImage(index)}
                        className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center p-0 md:p-4 group">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentImageIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    src={selectedImages[currentImageIndex]} 
                    alt="Preview" 
                    className={cn("max-w-full max-h-full object-contain transition-all duration-300", selectedFilter.class)}
                  />
                </AnimatePresence>

                {selectedImages.length > 1 && (
                  <>
                    <button 
                      onClick={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
                      className={cn(
                        "absolute left-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center transition-opacity",
                        currentImageIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-0 group-hover:opacity-100"
                      )}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setCurrentImageIndex(prev => Math.min(selectedImages.length - 1, prev + 1))}
                      className={cn(
                        "absolute right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center transition-opacity",
                        currentImageIndex === selectedImages.length - 1 ? "opacity-0 pointer-events-none" : "opacity-0 group-hover:opacity-100"
                      )}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    
                    {/* Dots indicator */}
                    <div className="absolute bottom-6 flex gap-1.5">
                      {selectedImages.map((_, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all",
                            i === currentImageIndex ? "bg-sky-500 scale-125" : "bg-white/50"
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Music Badge */}
                {selectedMusic && (
                  <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-white text-xs font-medium">
                    <button 
                      onClick={(e) => togglePlay(selectedMusic, e)}
                      className="hover:text-sky-400 transition-colors"
                    >
                      {playingSongId === selectedMusic.id ? (
                        <Pause className="w-3 h-3 fill-current" />
                      ) : (
                        <Play className="w-3 h-3 fill-current" />
                      )}
                    </button>
                    <span>{selectedMusic.title} • {selectedMusic.artist}</span>
                    <button onClick={() => setSelectedMusic(null)} className="ml-1 hover:text-zinc-300">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Area (Steps 2 & 3) */}
          <AnimatePresence mode="wait">
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full md:w-80 border-l border-zinc-200 dark:border-zinc-800 flex flex-col bg-white dark:bg-zinc-900"
              >
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {FILTERS.map((filter) => (
                      <button
                        key={filter.name}
                        onClick={() => setSelectedFilter(filter)}
                        className="flex flex-col items-center gap-2 group"
                      >
                        <div className={cn(
                          "w-full aspect-square rounded-md overflow-hidden border-2 transition-all",
                          selectedFilter.name === filter.name ? "border-sky-500" : "border-transparent group-hover:border-zinc-300"
                        )}>
                          <img 
                            src={selectedImages[currentImageIndex]} 
                            alt={filter.name} 
                            className={cn("w-full h-full object-cover", filter.class)}
                          />
                        </div>
                        <span className={cn(
                          "text-xs font-medium",
                          selectedFilter.name === filter.name ? "text-sky-500" : "text-zinc-500"
                        )}>
                          {filter.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
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
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        className="absolute inset-0 bg-white dark:bg-zinc-900 z-20 flex flex-col"
                      >
                        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                          <button onClick={() => setIsMusicPickerOpen(false)}>
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
                          {isMusicLoading ? (
                            <div className="flex flex-col items-center justify-center h-40 gap-3">
                              <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                              <p className="text-xs text-zinc-500">Searching music...</p>
                            </div>
                          ) : songs.length > 0 ? (
                            songs.map(song => (
                              <div
                                key={song.id}
                                onClick={() => {
                                  setSelectedMusic(song);
                                  setIsMusicPickerOpen(false);
                                  // Trigger playback if not already playing
                                  if (playingSongId !== song.id && song.previewUrl) {
                                    if (audioRef.current) {
                                      audioRef.current.pause();
                                    }
                                    const audio = new Audio(song.previewUrl);
                                    audioRef.current = audio;
                                    audio.play().catch(err => console.error("Autoplay error:", err));
                                    setPlayingSongId(song.id);
                                    audio.onended = () => {
                                      setPlayingSongId(null);
                                      audioRef.current = null;
                                    };
                                  }
                                }}
                                className="w-full p-4 flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    e.currentTarget.click();
                                  }
                                }}
                              >
                                <img src={song.cover} alt={song.title} className="w-12 h-12 rounded-md object-cover bg-zinc-100" />
                                <div className="flex-1 text-left min-w-0">
                                  <p className="text-sm font-semibold truncate">{song.title}</p>
                                  <p className="text-xs text-zinc-500 truncate">{song.artist}</p>
                                </div>
                                <button 
                                  onClick={(e) => togglePlay(song, e)}
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
                    )}
                  </AnimatePresence>

                  {/* User Info */}
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[1.5px]">
                      <div className="w-full h-full rounded-full border-2 border-white dark:border-zinc-900 overflow-hidden">
                        <img src="https://picsum.photos/seed/user/100/100" alt="User" className="w-full h-full object-cover" />
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
                      onChange={(e) => setCaption(e.target.value)}
                    />
                    <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <Smile className="w-5 h-5 text-zinc-400 cursor-pointer" />
                      <span className="text-xs text-zinc-400">{caption.length}/2,200</span>
                    </div>
                  </div>

                  {/* Music Selection */}
                  <div 
                    className="p-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div 
                      onClick={() => setIsMusicPickerOpen(true)}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <Music className="w-5 h-5 text-zinc-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">Add music</p>
                        {selectedMusic && (
                          <p className="text-xs text-sky-500 font-medium truncate">{selectedMusic.title} • {selectedMusic.artist}</p>
                        )}
                      </div>
                    </div>
                    {selectedMusic ? (
                      <button 
                        onClick={(e) => togglePlay(selectedMusic, e)}
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
                      >
                        {playingSongId === selectedMusic.id ? (
                          <Pause className="w-5 h-5 text-sky-500 fill-sky-500" />
                        ) : (
                          <Play className="w-5 h-5 text-zinc-400 fill-zinc-400" />
                        )}
                      </button>
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
                      onChange={(e) => setHashtags(e.target.value)}
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
                        onChange={(e) => setLocation(e.target.value)}
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
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
