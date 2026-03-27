-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "music_id" TEXT;

-- AlterTable
ALTER TABLE "reels" ADD COLUMN     "music_id" TEXT;

-- AlterTable
ALTER TABLE "stories" ADD COLUMN     "music_id" TEXT;

-- CreateTable
CREATE TABLE "music" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT,
    "url" TEXT NOT NULL,
    "duration" INTEGER,
    "cover_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "music_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_music_id_fkey" FOREIGN KEY ("music_id") REFERENCES "music"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reels" ADD CONSTRAINT "reels_music_id_fkey" FOREIGN KEY ("music_id") REFERENCES "music"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_music_id_fkey" FOREIGN KEY ("music_id") REFERENCES "music"("id") ON DELETE SET NULL ON UPDATE CASCADE;
