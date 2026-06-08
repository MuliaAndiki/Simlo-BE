-- DropForeignKey
ALTER TABLE "BoundingBox" DROP CONSTRAINT "BoundingBox_mlResultID_fkey";

-- DropForeignKey
ALTER TABLE "MlResult" DROP CONSTRAINT "MlResult_reportID_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_userID_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userID_fkey";

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MlResult" ADD CONSTRAINT "MlResult_reportID_fkey" FOREIGN KEY ("reportID") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoundingBox" ADD CONSTRAINT "BoundingBox_mlResultID_fkey" FOREIGN KEY ("mlResultID") REFERENCES "MlResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
