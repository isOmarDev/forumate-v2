/*
  Warnings:

  - You are about to drop the `CommentReadModel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "CommentReadModel";

-- CreateTable
CREATE TABLE "CommentRead" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "parentCommentId" TEXT,
    "body" TEXT NOT NULL,
    "voteScore" INTEGER NOT NULL DEFAULT 0,
    "replyCount" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT NOT NULL,
    "authorUsername" TEXT NOT NULL,
    "authorReputationLevel" "MemberReputationLevel" NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL,
    "projectedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommentRead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommentRead_postId_postedAt_idx" ON "CommentRead"("postId", "postedAt");

-- CreateIndex
CREATE INDEX "CommentRead_parentCommentId_idx" ON "CommentRead"("parentCommentId");

-- CreateIndex
CREATE INDEX "CommentRead_authorId_idx" ON "CommentRead"("authorId");
