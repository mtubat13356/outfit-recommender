-- CreateEnum
CREATE TYPE "Category" AS ENUM ('top', 'bottom', 'shoes');

-- CreateTable
CREATE TABLE "ClothingItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "color" TEXT NOT NULL,
    "occasions" TEXT[],
    "minTemp" INTEGER NOT NULL,
    "maxTemp" INTEGER NOT NULL,

    CONSTRAINT "ClothingItem_pkey" PRIMARY KEY ("id")
);
