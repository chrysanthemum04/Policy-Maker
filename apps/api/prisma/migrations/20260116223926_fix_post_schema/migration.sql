-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "hub_id" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "thread_id" DROP NOT NULL;
