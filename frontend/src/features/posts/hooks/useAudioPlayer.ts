import { useRef, useState, useEffect } from "react";
import type { Song } from "~/shared/types/post";

export const useAudioPlayer = (selectedMusic: Song | null, step: number) => {
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = (song: Song, e: React.MouseEvent) => {
    e.stopPropagation();

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
        audio.play().catch((err) => console.error("Audio play error:", err));
        setPlayingSongId(song.id);

        audio.onended = () => {
          setPlayingSongId(null);
          audioRef.current = null;
        };
      }
    }
  };

  const playAudio = (song: Song) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (song.previewUrl) {
      const audio = new Audio(song.previewUrl);
      audioRef.current = audio;
      audio.play().catch((err) => console.error("Autoplay error:", err));
      setPlayingSongId(song.id);

      audio.onended = () => {
        setPlayingSongId(null);
        audioRef.current = null;
      };
    }
  };

  const stopAudio = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlayingSongId(null);
  };

  useEffect(() => {
    if (step !== 3 || !selectedMusic) return;
    if (playingSongId === selectedMusic.id) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (!selectedMusic.previewUrl) return;

    const audio = new Audio(selectedMusic.previewUrl);
    audioRef.current = audio;

    audio.play().catch((err) => console.error("Autoplay error:", err));

    audio.onended = () => {
      setPlayingSongId(null);
      audioRef.current = null;
    };

    Promise.resolve().then(() => setPlayingSongId(selectedMusic.id));
  }, [step, selectedMusic]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return { playingSongId, setPlayingSongId, togglePlay, playAudio, stopAudio };
};
