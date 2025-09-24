/*
  Warnings:

  - The values [custom] on the enum `ReminderType` will be removed. If these variants are still used in the database, this will fail.

*/
-- حذف جميع التذكيرات المخصصة أولاً
DELETE FROM "public"."payment_reminders" WHERE "reminder_type" = 'custom';

-- AlterEnum
BEGIN;
CREATE TYPE "public"."ReminderType_new" AS ENUM ('first_reminder', 'second_reminder', 'final_reminder');
ALTER TABLE "public"."payment_reminders" ALTER COLUMN "reminder_type" DROP DEFAULT;
ALTER TABLE "public"."payment_reminders" ALTER COLUMN "reminder_type" TYPE "public"."ReminderType_new" USING ("reminder_type"::text::"public"."ReminderType_new");
ALTER TYPE "public"."ReminderType" RENAME TO "ReminderType_old";
ALTER TYPE "public"."ReminderType_new" RENAME TO "ReminderType";
DROP TYPE "public"."ReminderType_old";
ALTER TABLE "public"."payment_reminders" ALTER COLUMN "reminder_type" SET DEFAULT 'first_reminder';
COMMIT;
