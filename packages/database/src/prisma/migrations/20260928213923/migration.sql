/*
  Warnings:

  - You are about to drop the column `dateCreated` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdated` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `dateCreated` on the `CommentVote` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdated` on the `CommentVote` table. All the data in the column will be lost.
  - You are about to drop the column `dateCreated` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdated` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `dateCreated` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdated` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `dateCreated` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdated` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `dateCreated` on the `PostVote` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdated` on the `PostVote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CommentVote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PostVote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "dateCreated",
DROP COLUMN "lastUpdated",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CommentVote" DROP COLUMN "dateCreated",
DROP COLUMN "lastUpdated",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "dateCreated",
DROP COLUMN "lastUpdated",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "dateCreated",
DROP COLUMN "lastUpdated",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "dateCreated",
DROP COLUMN "lastUpdated",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PostVote" DROP COLUMN "dateCreated",
DROP COLUMN "lastUpdated",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
