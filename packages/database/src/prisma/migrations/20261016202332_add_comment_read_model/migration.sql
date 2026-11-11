-- CreateTable
CREATE TABLE "CommentReadModel" (
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

    CONSTRAINT "CommentReadModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommentReadModel_postId_postedAt_idx" ON "CommentReadModel"("postId", "postedAt");

-- CreateIndex
CREATE INDEX "CommentReadModel_parentCommentId_idx" ON "CommentReadModel"("parentCommentId");

-- CreateIndex
CREATE INDEX "CommentReadModel_authorId_idx" ON "CommentReadModel"("authorId");
