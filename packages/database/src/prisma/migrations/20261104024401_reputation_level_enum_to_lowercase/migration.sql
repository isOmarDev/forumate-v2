/*
  Warnings:

  - The values [Level 1,Level 2,Level 3] on the enum `MemberReputationLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MemberReputationLevel_new" AS ENUM ('level1', 'level2', 'level3');
ALTER TABLE "public"."Member" ALTER COLUMN "reputationLevel" DROP DEFAULT;
ALTER TABLE "Member" ALTER COLUMN "reputationLevel" TYPE "MemberReputationLevel_new" USING ("reputationLevel"::text::"MemberReputationLevel_new");
ALTER TABLE "CommentRead" ALTER COLUMN "authorReputationLevel" TYPE "MemberReputationLevel_new" USING ("authorReputationLevel"::text::"MemberReputationLevel_new");
ALTER TYPE "MemberReputationLevel" RENAME TO "MemberReputationLevel_old";
ALTER TYPE "MemberReputationLevel_new" RENAME TO "MemberReputationLevel";
DROP TYPE "public"."MemberReputationLevel_old";
ALTER TABLE "Member" ALTER COLUMN "reputationLevel" SET DEFAULT 'level1';
COMMIT;

-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "reputationLevel" SET DEFAULT 'level1';
