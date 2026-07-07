-- AlterTable
ALTER TABLE "category" ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "nameEn" TEXT;

-- AlterTable
ALTER TABLE "collection" ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "nameEn" TEXT;

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "careInstructionsEn" TEXT,
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "materialsEn" TEXT,
ADD COLUMN     "metaDescriptionEn" TEXT,
ADD COLUMN     "metaTitleEn" TEXT,
ADD COLUMN     "nameEn" TEXT,
ADD COLUMN     "shortDescriptionEn" TEXT;
