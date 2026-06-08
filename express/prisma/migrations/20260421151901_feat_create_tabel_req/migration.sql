/*
  Warnings:

  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "reportType" AS ENUM ('isPending', 'inProgress', 'done', 'rejected');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "city" TEXT NOT NULL,
    "address_detail" TEXT NOT NULL,
    "reportStatus" "reportType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MlResult" (
    "id" TEXT NOT NULL,
    "reportID" TEXT NOT NULL,
    "is_Detected" BOOLEAN NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "model_version" TEXT NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MlResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoundingBox" (
    "id" TEXT NOT NULL,
    "mlResultID" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "BoundingBox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Session_userID_idx" ON "Session"("userID");

-- CreateIndex
CREATE INDEX "Report_userID_idx" ON "Report"("userID");

-- CreateIndex
CREATE INDEX "MlResult_reportID_idx" ON "MlResult"("reportID");

-- CreateIndex
CREATE INDEX "BoundingBox_mlResultID_idx" ON "BoundingBox"("mlResultID");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MlResult" ADD CONSTRAINT "MlResult_reportID_fkey" FOREIGN KEY ("reportID") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoundingBox" ADD CONSTRAINT "BoundingBox_mlResultID_fkey" FOREIGN KEY ("mlResultID") REFERENCES "MlResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
