/*
  Warnings:

  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "employees_email_key";

-- AlterTable
ALTER TABLE "employees" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "id_number" DROP NOT NULL,
ALTER COLUMN "position" DROP NOT NULL,
ALTER COLUMN "department" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password" VARCHAR(255) NOT NULL;
