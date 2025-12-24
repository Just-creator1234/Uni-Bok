-- DropForeignKey
ALTER TABLE "AdminInvite" DROP CONSTRAINT "AdminInvite_email_fkey";

-- AddForeignKey
ALTER TABLE "AdminInvite" ADD CONSTRAINT "AdminInvite_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE;
