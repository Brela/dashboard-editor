-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "inventory-copilot";

-- CreateTable
CREATE TABLE "inventory-copilot"."Dashboard" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory-copilot"."DashboardWidget" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "criteria" TEXT NOT NULL,
    "displayType" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "navigationUrl" TEXT NOT NULL,
    "i" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "w" DOUBLE PRECISION NOT NULL,
    "h" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "dashboardId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DashboardWidget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory-copilot"."CustomWidget" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "criteria" TEXT NOT NULL,
    "displayType" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomWidget_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inventory-copilot"."Dashboard" ADD CONSTRAINT "Dashboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory-copilot"."DashboardWidget" ADD CONSTRAINT "DashboardWidget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory-copilot"."DashboardWidget" ADD CONSTRAINT "DashboardWidget_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "inventory-copilot"."Dashboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory-copilot"."CustomWidget" ADD CONSTRAINT "CustomWidget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
