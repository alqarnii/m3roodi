-- CreateEnum
CREATE TYPE "public"."ReminderType" AS ENUM ('first_reminder', 'second_reminder', 'final_reminder', 'custom');

-- CreateEnum
CREATE TYPE "public"."ReminderStatus" AS ENUM ('sent', 'delivered', 'failed', 'cancelled');

-- CreateTable
CREATE TABLE "public"."password_reset_tokens" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payment_reminders" (
    "id" SERIAL NOT NULL,
    "request_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "user_name" VARCHAR(200) NOT NULL,
    "reminder_type" "public"."ReminderType" NOT NULL DEFAULT 'first_reminder',
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."ReminderStatus" NOT NULL DEFAULT 'sent',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_reminders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "public"."password_reset_tokens"("token");

-- AddForeignKey
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_email_fkey" FOREIGN KEY ("email") REFERENCES "public"."users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment_reminders" ADD CONSTRAINT "payment_reminders_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment_reminders" ADD CONSTRAINT "payment_reminders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
