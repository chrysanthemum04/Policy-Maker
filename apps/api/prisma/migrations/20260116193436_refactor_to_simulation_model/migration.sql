/*
  Warnings:

  - You are about to drop the column `availability_calendar` on the `expert_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `consultation_count` on the `expert_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `expertise_areas` on the `expert_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `hourly_rate` on the `expert_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `expert_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `review_count` on the `expert_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `total_earnings` on the `expert_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `comment_count` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `featured_image_url` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `policy_id` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `published_at` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `upvote_count` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `view_count` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `avatar_url` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profession` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `comment_likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `expert_consultations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `expert_reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hub_moderators` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hub_posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hub_subscribers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hubs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `policies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `policy_evaluations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post_comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post_likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `saved_posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `saved_scenarios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_follows` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `thread_id` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('government', 'citizen', 'expert');

-- CreateEnum
CREATE TYPE "ConfidenceLevel" AS ENUM ('high', 'medium', 'low');

-- DropForeignKey
ALTER TABLE "comment_likes" DROP CONSTRAINT "comment_likes_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "comment_likes" DROP CONSTRAINT "comment_likes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "expert_consultations" DROP CONSTRAINT "expert_consultations_expert_id_fkey";

-- DropForeignKey
ALTER TABLE "expert_consultations" DROP CONSTRAINT "expert_consultations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "expert_reviews" DROP CONSTRAINT "expert_reviews_consultation_id_fkey";

-- DropForeignKey
ALTER TABLE "hub_moderators" DROP CONSTRAINT "hub_moderators_hub_id_fkey";

-- DropForeignKey
ALTER TABLE "hub_moderators" DROP CONSTRAINT "hub_moderators_user_id_fkey";

-- DropForeignKey
ALTER TABLE "hub_posts" DROP CONSTRAINT "hub_posts_hub_id_fkey";

-- DropForeignKey
ALTER TABLE "hub_posts" DROP CONSTRAINT "hub_posts_post_id_fkey";

-- DropForeignKey
ALTER TABLE "hub_subscribers" DROP CONSTRAINT "hub_subscribers_hub_id_fkey";

-- DropForeignKey
ALTER TABLE "hub_subscribers" DROP CONSTRAINT "hub_subscribers_user_id_fkey";

-- DropForeignKey
ALTER TABLE "hubs" DROP CONSTRAINT "hubs_policy_id_fkey";

-- DropForeignKey
ALTER TABLE "policies" DROP CONSTRAINT "policies_created_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "policy_evaluations" DROP CONSTRAINT "policy_evaluations_policy_id_fkey";

-- DropForeignKey
ALTER TABLE "policy_evaluations" DROP CONSTRAINT "policy_evaluations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "post_comments" DROP CONSTRAINT "post_comments_parent_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "post_comments" DROP CONSTRAINT "post_comments_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_comments" DROP CONSTRAINT "post_comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "post_likes" DROP CONSTRAINT "post_likes_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_likes" DROP CONSTRAINT "post_likes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_policy_id_fkey";

-- DropForeignKey
ALTER TABLE "saved_posts" DROP CONSTRAINT "saved_posts_post_id_fkey";

-- DropForeignKey
ALTER TABLE "saved_posts" DROP CONSTRAINT "saved_posts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "saved_scenarios" DROP CONSTRAINT "saved_scenarios_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_follows" DROP CONSTRAINT "user_follows_followed_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_follows" DROP CONSTRAINT "user_follows_user_id_fkey";

-- DropIndex
DROP INDEX "posts_policy_id_idx";

-- DropIndex
DROP INDEX "posts_published_at_idx";

-- AlterTable
ALTER TABLE "expert_profiles" DROP COLUMN "availability_calendar",
DROP COLUMN "consultation_count",
DROP COLUMN "expertise_areas",
DROP COLUMN "hourly_rate",
DROP COLUMN "rating",
DROP COLUMN "review_count",
DROP COLUMN "total_earnings",
ADD COLUMN     "expertise_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "verification_status" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "comment_count",
DROP COLUMN "featured_image_url",
DROP COLUMN "policy_id",
DROP COLUMN "published_at",
DROP COLUMN "upvote_count",
DROP COLUMN "view_count",
ADD COLUMN     "thread_id" TEXT NOT NULL,
ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatar_url",
DROP COLUMN "bio",
DROP COLUMN "profession",
ADD COLUMN     "last_login_at" TIMESTAMP(3),
ADD COLUMN     "role" "UserRole" NOT NULL;

-- DropTable
DROP TABLE "comment_likes";

-- DropTable
DROP TABLE "expert_consultations";

-- DropTable
DROP TABLE "expert_reviews";

-- DropTable
DROP TABLE "hub_moderators";

-- DropTable
DROP TABLE "hub_posts";

-- DropTable
DROP TABLE "hub_subscribers";

-- DropTable
DROP TABLE "hubs";

-- DropTable
DROP TABLE "policies";

-- DropTable
DROP TABLE "policy_evaluations";

-- DropTable
DROP TABLE "post_comments";

-- DropTable
DROP TABLE "post_likes";

-- DropTable
DROP TABLE "saved_posts";

-- DropTable
DROP TABLE "saved_scenarios";

-- DropTable
DROP TABLE "user_follows";

-- DropEnum
DROP TYPE "ConsultationStatus";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "PolicyStatus";

-- CreateTable
CREATE TABLE "citizen_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "location_region" TEXT,
    "occupation_category" TEXT,
    "income_bracket" TEXT,
    "policy_interest_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "citizen_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy_domains" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policy_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role_context" "UserRole" NOT NULL,
    "policy_domain_id" TEXT NOT NULL,
    "input_parameters" JSONB NOT NULL,
    "assumptions" JSONB NOT NULL,
    "ai_output" JSONB NOT NULL,
    "confidence_level" "ConfidenceLevel" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussion_threads" (
    "id" TEXT NOT NULL,
    "policy_domain_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discussion_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webinars" (
    "id" TEXT NOT NULL,
    "expert_user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "external_link" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webinars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "citizen_profiles_user_id_key" ON "citizen_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "policy_domains_name_key" ON "policy_domains"("name");

-- CreateIndex
CREATE UNIQUE INDEX "policy_domains_slug_key" ON "policy_domains"("slug");

-- CreateIndex
CREATE INDEX "simulations_user_id_idx" ON "simulations"("user_id");

-- CreateIndex
CREATE INDEX "simulations_policy_domain_id_idx" ON "simulations"("policy_domain_id");

-- CreateIndex
CREATE INDEX "simulations_created_at_idx" ON "simulations"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "discussion_threads_policy_domain_id_key" ON "discussion_threads"("policy_domain_id");

-- CreateIndex
CREATE INDEX "comments_post_id_idx" ON "comments"("post_id");

-- CreateIndex
CREATE INDEX "comments_user_id_idx" ON "comments"("user_id");

-- CreateIndex
CREATE INDEX "webinars_expert_user_id_idx" ON "webinars"("expert_user_id");

-- CreateIndex
CREATE INDEX "webinars_scheduled_at_idx" ON "webinars"("scheduled_at");

-- CreateIndex
CREATE INDEX "posts_thread_id_idx" ON "posts"("thread_id");

-- CreateIndex
CREATE INDEX "posts_created_at_idx" ON "posts"("created_at");

-- AddForeignKey
ALTER TABLE "citizen_profiles" ADD CONSTRAINT "citizen_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_policy_domain_id_fkey" FOREIGN KEY ("policy_domain_id") REFERENCES "policy_domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_threads" ADD CONSTRAINT "discussion_threads_policy_domain_id_fkey" FOREIGN KEY ("policy_domain_id") REFERENCES "policy_domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "discussion_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webinars" ADD CONSTRAINT "webinars_expert_user_id_fkey" FOREIGN KEY ("expert_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
