-- CreateEnum
CREATE TYPE "CrisisStatus" AS ENUM ('PENDING', 'ESCALATED', 'RESOLVED', 'FALSE_POSITIVE', 'IGNORED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('SESSION_COMPLETED', 'SESSION_SCHEDULED', 'MESSAGE_SENT', 'NOTES_ADDED', 'APPOINTMENT_APPROVED', 'APPOINTMENT_REJECTED', 'PATIENT_ADDED');

-- AlterTable
ALTER TABLE "anonymous_sessions" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '7 days';

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "amountINR" DECIMAL(10,2),
ALTER COLUMN "currency" SET DEFAULT 'INR';

-- AlterTable
ALTER TABLE "therapists" ADD COLUMN     "certifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "feeStructure" JSONB,
ADD COLUMN     "hourlyRateINR" DECIMAL(10,2),
ALTER COLUMN "currency" SET DEFAULT 'INR';

-- CreateTable
CREATE TABLE "crisis_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT,
    "crisisLevel" INTEGER NOT NULL,
    "sentimentScore" DOUBLE PRECISION,
    "keywordsDetected" TEXT[],
    "urgency" TEXT NOT NULL,
    "requiresEscalation" BOOLEAN NOT NULL DEFAULT false,
    "status" "CrisisStatus" NOT NULL DEFAULT 'PENDING',
    "actionTaken" TEXT,
    "resolutionNotes" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crisis_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "therapistId" TEXT NOT NULL,
    "actionType" "ActivityType" NOT NULL,
    "relatedEntityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "crisis_events_userId_status_idx" ON "crisis_events"("userId", "status");

-- CreateIndex
CREATE INDEX "crisis_events_crisisLevel_idx" ON "crisis_events"("crisisLevel");

-- CreateIndex
CREATE INDEX "activity_logs_therapistId_createdAt_idx" ON "activity_logs"("therapistId", "createdAt");

-- AddForeignKey
ALTER TABLE "crisis_events" ADD CONSTRAINT "crisis_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "therapists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
