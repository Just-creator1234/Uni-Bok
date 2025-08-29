/*
  Warnings:

  - You are about to drop the column `editedAt` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `isEdited` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "editedAt",
DROP COLUMN "isEdited",
DROP COLUMN "status";
