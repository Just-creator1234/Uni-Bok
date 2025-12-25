-- DropForeignKey
ALTER TABLE "AdminInvite" DROP CONSTRAINT "AdminInvite_email_fkey";

-- AddForeignKey
ALTER TABLE "AdminInvite" ADD CONSTRAINT "AdminInvite_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
