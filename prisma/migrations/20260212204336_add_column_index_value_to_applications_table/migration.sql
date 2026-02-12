/*
  Warnings:

  - Added the required column `column_index` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "column_index" INTEGER NOT NULL;
