/*
  Warnings:

  - The primary key for the `Ticket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `code` on the `Ticket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_pkey",
DROP COLUMN "code",
ADD COLUMN     "code" UUID NOT NULL,
ADD CONSTRAINT "Ticket_pkey" PRIMARY KEY ("code");
