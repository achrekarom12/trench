-- CreateTable
CREATE TABLE "public"."students" (
    "id" TEXT NOT NULL,
    "roll_number" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "division" TEXT,
    "academic_year" TEXT,
    "prn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."faculty" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "designation" TEXT,
    "specialization" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."admins" (
    "id" TEXT NOT NULL,
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_roll_number_key" ON "public"."students"("roll_number");

-- CreateIndex
CREATE UNIQUE INDEX "students_prn_key" ON "public"."students"("prn");

-- CreateIndex
CREATE INDEX "students_roll_number_idx" ON "public"."students"("roll_number");

-- CreateIndex
CREATE INDEX "students_department_idx" ON "public"."students"("department");

-- CreateIndex
CREATE INDEX "students_year_idx" ON "public"."students"("year");

-- CreateIndex
CREATE INDEX "students_prn_idx" ON "public"."students"("prn");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_employee_id_key" ON "public"."faculty"("employee_id");

-- CreateIndex
CREATE INDEX "faculty_employee_id_idx" ON "public"."faculty"("employee_id");

-- CreateIndex
CREATE INDEX "faculty_department_idx" ON "public"."faculty"("department");

-- CreateIndex
CREATE INDEX "faculty_designation_idx" ON "public"."faculty"("designation");

-- CreateIndex
CREATE INDEX "admins_department_idx" ON "public"."admins"("department");

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."faculty" ADD CONSTRAINT "faculty_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."admins" ADD CONSTRAINT "admins_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
