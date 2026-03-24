export interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  previewUrl?: string;
}

export interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}