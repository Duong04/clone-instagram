/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `media` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `public_id` to the `media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "media" ADD COLUMN     "public_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "media_public_id_key" ON "media"("public_id");
