-- CreateTable
CREATE TABLE "Measurement" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "cloth_Owner_name" TEXT NOT NULL,
    "chest" INTEGER,
    "Waist" INTEGER,
    "Hips" INTEGER,
    "neck_to_waist" INTEGER,
    "waist_down_to_desired_lenght" INTEGER,
    "laps" INTEGER,
    "wrist" INTEGER,
    "ankle" INTEGER,
    "shoulders" INTEGER,
    "neck" INTEGER,
    "dress_design" TEXT,

    CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id")
);
