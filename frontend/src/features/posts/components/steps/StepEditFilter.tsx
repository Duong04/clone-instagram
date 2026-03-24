import React from "react";
import { motion } from "motion/react";
import { cn } from "~/shared/libs/utils";
import { FILTERS } from "../../constants";

interface Filter {
  name: string;
  class: string;
}

interface StepEditFilterProps {
  selectedImages: string[];
  currentImageIndex: number;
  selectedFilter: Filter;
  onFilterChange: (filter: Filter) => void;
}

export const StepEditFilter: React.FC<StepEditFilterProps> = ({
  selectedImages,
  currentImageIndex,
  selectedFilter,
  onFilterChange,
}) => {
  return (
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
              onClick={() => onFilterChange(filter)}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={cn(
                  "w-full aspect-square rounded-md overflow-hidden border-2 transition-all",
                  selectedFilter.name === filter.name
                    ? "border-sky-500"
                    : "border-transparent group-hover:border-zinc-300"
                )}
              >
                <img
                  src={selectedImages[currentImageIndex]}
                  alt={filter.name}
                  className={cn("w-full h-full object-cover", filter.class)}
                />
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  selectedFilter.name === filter.name ? "text-sky-500" : "text-zinc-500"
                )}
              >
                {filter.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
