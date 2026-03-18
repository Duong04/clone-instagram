/*
  Warnings:

  - The `status` column on the `follows` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `message_type` column on the `messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `entity_type` column on the `notifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `notifications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `target_type` on the `reports` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FollowStatus" AS ENUM ('accepted', 'pending');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('text', 'image', 'video');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('like', 'comment', 'follow', 'mention', 'tag');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('post', 'comment', 'reel', 'story');

-- CreateEnum
CREATE TYPE "ReportTargetType" AS ENUM ('post', 'comment', 'user', 'reel');

-- AlterTable
ALTER TABLE "follows" DROP COLUMN "status",
ADD COLUMN     "status" "FollowStatus" NOT NULL DEFAULT 'accepted';

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "message_type",
ADD COLUMN     "message_type" "MessageType" NOT NULL DEFAULT 'text';

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL,
DROP COLUMN "entity_type",
ADD COLUMN     "entity_type" "EntityType";

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "target_type",
ADD COLUMN     "target_type" "ReportTargetType" NOT NULL;
