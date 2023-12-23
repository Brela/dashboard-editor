/*
  Warnings:

  - You are about to drop the column `companyID` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `companyID` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_companyID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_companyID_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "companyID";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "companyID";

-- DropTable
DROP TABLE "Company";
