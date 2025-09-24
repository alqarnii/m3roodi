-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('pending', 'in_progress', 'completed', 'delivered', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('bank_transfer', 'electronic');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "ModificationStatus" AS ENUM ('pending', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "FollowUpStatus" AS ENUM ('active', 'completed', 'suspended');

-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('admin', 'manager', 'staff', 'agent');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "id_number" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "id_number" VARCHAR(20) NOT NULL,
    "position" VARCHAR(100) NOT NULL,
    "department" VARCHAR(100) NOT NULL,
    "role" "EmployeeRole" NOT NULL DEFAULT 'staff',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "hire_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "salary" DECIMAL(10,2),
    "username" VARCHAR(100),
    "password" VARCHAR(255),
    "can_access_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "assigned_to_id" INTEGER,
    "purpose" VARCHAR(255) NOT NULL,
    "recipient" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "applicant_name" VARCHAR(200) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "id_number" VARCHAR(20),
    "attachments" TEXT,
    "voice_recording_url" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'pending',
    "price" DECIMAL(10,2) NOT NULL,
    "delivery_date" TIMESTAMP(3),
    "priority" "Priority" NOT NULL DEFAULT 'medium',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "request_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "transaction_id" VARCHAR(255),
    "bank_reference" VARCHAR(255),
    "payment_date" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modifications" (
    "id" SERIAL NOT NULL,
    "request_id" INTEGER NOT NULL,
    "employee_id" INTEGER,
    "modification_type" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ModificationStatus" NOT NULL DEFAULT 'pending',
    "is_free" BOOLEAN NOT NULL DEFAULT true,
    "modification_cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "modifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follow_ups" (
    "id" SERIAL NOT NULL,
    "request_id" INTEGER NOT NULL,
    "employee_id" INTEGER,
    "agent_name" VARCHAR(100),
    "visit_count" INTEGER NOT NULL DEFAULT 0,
    "max_visits" INTEGER NOT NULL DEFAULT 10,
    "notes" TEXT,
    "next_visit_date" TIMESTAMP(3),
    "status" "FollowUpStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "follow_ups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employees_id_number_key" ON "employees"("id_number");

-- CreateIndex
CREATE UNIQUE INDEX "employees_username_key" ON "employees"("username");

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifications" ADD CONSTRAINT "modifications_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifications" ADD CONSTRAINT "modifications_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
