/*
  Warnings:

  - You are about to drop the `Settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Settings" DROP CONSTRAINT "Settings_userName_fkey";

-- DropIndex
DROP INDEX "Token_token_key";

-- DropTable
DROP TABLE "Settings";
