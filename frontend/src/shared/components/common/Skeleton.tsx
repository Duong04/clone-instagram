import React from "react";
import { motion } from "motion/react";
import { cn } from "~/shared/utils/cn";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn("relative overflow-hidden bg-zinc-100 rounded-md", className)}>
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
      />
    </div>
  );
};

export const PostSkeleton = () => {
  return (
    <div className="bg-white border-b border-zinc-200 md:border md:rounded-lg mb-4 max-w-full mx-auto overflow-hidden w-full">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="w-24 h-3" />
            <Skeleton className="w-16 h-2" />
          </div>
        </div>
        <Skeleton className="w-5 h-5 rounded-full" />
      </div>

      {/* Image Skeleton */}
      <Skeleton className="aspect-square w-full rounded-none" />

      {/* Actions Skeleton */}
      <div className="p-3 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-7 h-7 rounded-full" />
            <Skeleton className="w-7 h-7 rounded-full" />
            <Skeleton className="w-7 h-7 rounded-full" />
          </div>
          <Skeleton className="w-7 h-7 rounded-full" />
        </div>

        {/* Likes Skeleton */}
        <Skeleton className="w-20 h-3" />

        {/* Caption Skeleton */}
        <div className="space-y-2">
          <Skeleton className="w-full h-3" />
          <Skeleton className="w-2/3 h-3" />
        </div>

        {/* Comments Link Skeleton */}
        <Skeleton className="w-32 h-3" />
      </div>
    </div>
  );
};

export const StorySkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-1 flex-shrink-0">
      <Skeleton className="w-16 h-16 rounded-full" />
      <Skeleton className="w-12 h-2" />
    </div>
  );
};
