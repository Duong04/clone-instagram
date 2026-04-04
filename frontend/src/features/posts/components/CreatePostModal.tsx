import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import { cn } from "~/shared/utils/cn";
import { FILTERS } from "../constants";
import type { Song, CreatePostModalProps } from "../types";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { StepSelectPhotos } from "./steps/StepSelectPhotos";
import { StepEditFilter } from "./steps/StepEditFilter";
import { StepPostDetails } from "./steps/StepPostDetails";
import { usePost } from "../hooks/usePost";
import { toast } from "sonner";

export const CreatePostModal = ({
  isOpen,
  onClose,
}: CreatePostModalProps) => {
  const [step, setStep] = useState(1);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [selectedMusic, setSelectedMusic] = useState<Song | null>(null);
  const [isMusicPickerOpen, setIsMusicPickerOpen] = useState(false);
  const { createPost, isLoading, serverError } = usePost();

  const { playingSongId, togglePlay, playAudio, stopAudio } = useAudioPlayer(
    selectedMusic,
    step,
  );

  const handleMusicSelect = (song: Song) => {
    setSelectedMusic(song);
    setIsMusicPickerOpen(false);
    playAudio(song);
  };

  const handleMusicRemove = () => {
    if (selectedMusic) stopAudio();
    setSelectedMusic(null);
  };

  const handleClose = () => {
    stopAudio();
    setStep(1);
    setSelectedImages([]);
    setCurrentImageIndex(0);
    setSelectedFilter(FILTERS[0]);
    setCaption("");
    setLocation("");
    setHashtags("");
    setSelectedMusic(null);
    setIsMusicPickerOpen(false);
    onClose();
  };

  const handleShare = async () => {
    const success = await createPost({
      images: selectedImages,
      caption,
      location,
      hashtags,
      musicId: selectedMusic?.id,
    });
    if (success) {
      toast.success("Post shared successfully!");
      handleClose();
    } else {
      toast.error(serverError || "Failed to share post");
    }
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
        <div className="h-12 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 shrink-0">
          <div className="w-10">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="hover:text-zinc-500 transition-colors"
              >
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
                disabled={isLoading}
                className="text-sky-500 font-semibold text-sm hover:text-sky-600 disabled:opacity-50"
              >
                {isLoading ? "Sharing..." : "Share"}
              </button>
            )}
          </div>
          {serverError && (
            <p className="text-red-500 text-xs text-center py-2">
              {serverError}
            </p>
          )}
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div
            className={cn(
              "flex-1 bg-zinc-50 dark:bg-black flex items-center justify-center relative overflow-hidden",
              step === 1 && selectedImages.length === 0 ? "aspect-square" : "",
            )}
          >
            {step === 1 ? (
              <StepSelectPhotos
                selectedImages={selectedImages}
                onImagesChange={setSelectedImages}
              />
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
                    className={cn(
                      "max-w-full max-h-full object-contain transition-all duration-300",
                      selectedFilter.class,
                    )}
                  />
                </AnimatePresence>

                {selectedImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) => Math.max(0, prev - 1))
                      }
                      className={cn(
                        "absolute left-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center transition-opacity",
                        currentImageIndex === 0
                          ? "opacity-0 pointer-events-none"
                          : "opacity-0 group-hover:opacity-100",
                      )}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          Math.min(selectedImages.length - 1, prev + 1),
                        )
                      }
                      className={cn(
                        "absolute right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center transition-opacity",
                        currentImageIndex === selectedImages.length - 1
                          ? "opacity-0 pointer-events-none"
                          : "opacity-0 group-hover:opacity-100",
                      )}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="absolute bottom-6 flex gap-1.5">
                      {selectedImages.map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all",
                            i === currentImageIndex
                              ? "bg-sky-500 scale-125"
                              : "bg-white/50",
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}

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
                    <span>
                      {selectedMusic.title} • {selectedMusic.artist}
                    </span>
                    <button
                      onClick={handleMusicRemove}
                      className="ml-1 hover:text-zinc-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {step === 2 && (
              <StepEditFilter
                selectedImages={selectedImages}
                currentImageIndex={currentImageIndex}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
              />
            )}
            {step === 3 && (
              <StepPostDetails
                caption={caption}
                onCaptionChange={setCaption}
                location={location}
                onLocationChange={setLocation}
                hashtags={hashtags}
                onHashtagsChange={setHashtags}
                selectedMusic={selectedMusic}
                onMusicSelect={handleMusicSelect}
                onMusicRemove={handleMusicRemove}
                isMusicPickerOpen={isMusicPickerOpen}
                onMusicPickerOpen={() => setIsMusicPickerOpen(true)}
                onMusicPickerClose={() => setIsMusicPickerOpen(false)}
                playingSongId={playingSongId}
                onTogglePlay={togglePlay}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
