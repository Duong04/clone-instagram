/*
  Warnings:

  - You are about to drop the column `post_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `post_id` on the `feeds` table. All the data in the column will be lost.
  - You are about to drop the `comment_likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post_likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post_mentions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post_saves` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post_views` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reel_likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reel_views` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `story_views` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,target_type,target_id]` on the table `feeds` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `target_id` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_type` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_id` to the `feeds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_type` to the `feeds` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('post', 'reel', 'story');

-- DropForeignKey
ALTER TABLE "comment_likes" DROP CONSTRAINT "comment_likes_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "comment_likes" DROP CONSTRAINT "comment_likes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_post_id_fkey";

-- DropForeignKey
ALTER TABLE "feeds" DROP CONSTRAINT "feeds_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_likes" DROP CONSTRAINT "post_likes_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_likes" DROP CONSTRAINT "post_likes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "post_mentions" DROP CONSTRAINT "post_mentions_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_mentions" DROP CONSTRAINT "post_mentions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "post_saves" DROP CONSTRAINT "post_saves_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_saves" DROP CONSTRAINT "post_saves_user_id_fkey";

-- DropForeignKey
ALTER TABLE "post_views" DROP CONSTRAINT "post_views_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_views" DROP CONSTRAINT "post_views_user_id_fkey";

-- DropForeignKey
ALTER TABLE "reel_likes" DROP CONSTRAINT "reel_likes_reel_id_fkey";

-- DropForeignKey
ALTER TABLE "reel_likes" DROP CONSTRAINT "reel_likes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "reel_views" DROP CONSTRAINT "reel_views_reel_id_fkey";

-- DropForeignKey
ALTER TABLE "reel_views" DROP CONSTRAINT "reel_views_user_id_fkey";

-- DropForeignKey
ALTER TABLE "story_views" DROP CONSTRAINT "story_views_story_id_fkey";

-- DropForeignKey
ALTER TABLE "story_views" DROP CONSTRAINT "story_views_user_id_fkey";

-- DropIndex
DROP INDEX "feeds_user_id_post_id_key";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "post_id",
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "target_id" TEXT NOT NULL,
ADD COLUMN     "target_type" "ContentType" NOT NULL;

-- AlterTable
ALTER TABLE "feeds" DROP COLUMN "post_id",
ADD COLUMN     "target_id" TEXT NOT NULL,
ADD COLUMN     "target_type" "ContentType" NOT NULL;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "reels" ADD COLUMN     "comments_disabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "stories" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- DropTable
DROP TABLE "comment_likes";

-- DropTable
DROP TABLE "post_likes";

-- DropTable
DROP TABLE "post_mentions";

-- DropTable
DROP TABLE "post_saves";

-- DropTable
DROP TABLE "post_views";

-- DropTable
DROP TABLE "reel_likes";

-- DropTable
DROP TABLE "reel_views";

-- DropTable
DROP TABLE "story_views";

-- CreateTable
CREATE TABLE "likes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "target_type" "ContentType" NOT NULL,
    "target_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "views" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "target_type" "ContentType" NOT NULL,
    "target_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saves" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "target_type" "ContentType" NOT NULL,
    "target_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saves_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "likes_target_type_target_id_idx" ON "likes"("target_type", "target_id");

-- CreateIndex
CREATE INDEX "likes_user_id_idx" ON "likes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_target_type_target_id_key" ON "likes"("user_id", "target_type", "target_id");

-- CreateIndex
CREATE INDEX "views_target_type_target_id_idx" ON "views"("target_type", "target_id");

-- CreateIndex
CREATE UNIQUE INDEX "views_user_id_target_type_target_id_key" ON "views"("user_id", "target_type", "target_id");

-- CreateIndex
CREATE INDEX "saves_target_type_target_id_idx" ON "saves"("target_type", "target_id");

-- CreateIndex
CREATE UNIQUE INDEX "saves_user_id_target_type_target_id_key" ON "saves"("user_id", "target_type", "target_id");

-- CreateIndex
CREATE INDEX "comments_target_type_target_id_idx" ON "comments"("target_type", "target_id");

-- CreateIndex
CREATE INDEX "comments_user_id_idx" ON "comments"("user_id");

-- CreateIndex
CREATE INDEX "feeds_user_id_score_created_at_idx" ON "feeds"("user_id", "score", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "feeds_user_id_target_type_target_id_key" ON "feeds"("user_id", "target_type", "target_id");

-- CreateIndex
CREATE INDEX "follows_follower_id_idx" ON "follows"("follower_id");

-- CreateIndex
CREATE INDEX "follows_following_id_idx" ON "follows"("following_id");

-- CreateIndex
CREATE INDEX "messages_conversation_id_created_at_idx" ON "messages"("conversation_id", "created_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_idx" ON "notifications"("user_id", "is_read");

-- CreateIndex
CREATE INDEX "notifications_user_id_created_at_idx" ON "notifications"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "posts_user_id_idx" ON "posts"("user_id");

-- CreateIndex
CREATE INDEX "reels_user_id_idx" ON "reels"("user_id");

-- CreateIndex
CREATE INDEX "reports_reporter_id_idx" ON "reports"("reporter_id");

-- CreateIndex
CREATE INDEX "search_history_user_id_idx" ON "search_history"("user_id");

-- CreateIndex
CREATE INDEX "stories_user_id_idx" ON "stories"("user_id");

-- CreateIndex
CREATE INDEX "user_blocks_user_id_idx" ON "user_blocks"("user_id");

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "views" ADD CONSTRAINT "views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saves" ADD CONSTRAINT "saves_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
