/*
  Warnings:

  - You are about to drop the `Initial` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Initial";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "picture" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
