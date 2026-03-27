import React, { useRef } from "react";
import { Reorder } from "motion/react";
import { Image as ImageIcon, Plus, GripVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface StepSelectPhotosProps {
  selectedImages: string[];
  onImagesChange: (images: string[]) => void;
}

export const StepSelectPhotos: React.FC<StepSelectPhotosProps> = ({
  selectedImages,
  onImagesChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];

    const oversized = files.filter((f) => f.size > 10 * 1024 * 1024);
    if (oversized.length > 0) {
      toast.error("Each image must be under 10MB");
      return;
    }

    if (selectedImages.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }
    if (files.length === 0) return;

    const newImages: string[] = [];
    let processed = 0;

    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        processed++;
        if (processed === files.length) {
          onImagesChange([...selectedImages, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    onImagesChange(selectedImages.filter((_, i) => i !== index));
  };

  if (selectedImages.length === 0) {
    return (
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
    );
  }

  return (
    <div className="w-full h-full p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">
          Selected ({selectedImages.length})
        </h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1 text-sky-500 text-xs font-semibold hover:text-sky-600"
        >
          <Plus className="w-4 h-4" />
          Add more
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

      <Reorder.Group
        axis="y"
        values={selectedImages}
        onReorder={onImagesChange}
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
              <img
                src={img}
                alt={`Selected ${index}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-500 truncate">
                Image {index + 1}
              </p>
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
  );
};
