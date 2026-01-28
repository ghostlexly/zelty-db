-- CreateTable
CREATE TABLE "ZeltyRestaurant" (
    "id" TEXT NOT NULL,
    "zeltyId" INTEGER NOT NULL,
    "remoteId" TEXT,
    "disable" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "countryCode" TEXT NOT NULL DEFAULT 'FR',
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "image" TEXT,
    "defaultLang" TEXT NOT NULL DEFAULT 'fr',
    "productionDelay" INTEGER NOT NULL DEFAULT 0,
    "deliveryTime" INTEGER NOT NULL DEFAULT 0,
    "orderingAvailable" BOOLEAN NOT NULL DEFAULT true,
    "deliveryCharge" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "deliveryChargeTva" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "deliveryMinimum" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "deliveryNoChargeMin" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "deliveryHours" JSONB,
    "openingHours" JSONB,
    "openingHoursTxt" TEXT,
    "happyHours" JSONB,
    "closures" JSONB NOT NULL DEFAULT '[]',
    "address" TEXT,
    "phone" TEXT,
    "publicName" TEXT,
    "onlineOrderingHidden" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "takeawayDelay" INTEGER NOT NULL DEFAULT 0,
    "orderingDelay" BOOLEAN NOT NULL DEFAULT false,
    "delay" INTEGER NOT NULL DEFAULT 0,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZeltyRestaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZeltyOrder" (
    "id" TEXT NOT NULL,
    "zeltyId" INTEGER NOT NULL,
    "zeltyUuid" TEXT NOT NULL,
    "comment" TEXT,
    "deviceId" INTEGER,
    "closedByDeviceId" INTEGER,
    "remoteId" TEXT,
    "ref" TEXT,
    "loyalty" INTEGER NOT NULL DEFAULT 0,
    "seats" INTEGER NOT NULL DEFAULT 1,
    "tableNumber" INTEGER,
    "zeltyRestaurantId" INTEGER NOT NULL,
    "zeltyCreatedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "mode" TEXT,
    "fulfillmentType" TEXT,
    "source" TEXT,
    "originName" TEXT,
    "status" TEXT NOT NULL,
    "amountIncTax" INTEGER NOT NULL DEFAULT 0,
    "amountExcTax" INTEGER NOT NULL DEFAULT 0,
    "virtualBrandName" TEXT,
    "firstName" TEXT,
    "phone" TEXT,
    "buzzerRef" TEXT,
    "displayId" TEXT,
    "channel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZeltyOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ZeltyRestaurant_zeltyId_key" ON "ZeltyRestaurant"("zeltyId");

-- CreateIndex
CREATE UNIQUE INDEX "ZeltyOrder_zeltyId_key" ON "ZeltyOrder"("zeltyId");

-- CreateIndex
CREATE UNIQUE INDEX "ZeltyOrder_zeltyUuid_key" ON "ZeltyOrder"("zeltyUuid");

-- CreateIndex
CREATE INDEX "ZeltyOrder_zeltyRestaurantId_idx" ON "ZeltyOrder"("zeltyRestaurantId");

-- CreateIndex
CREATE INDEX "ZeltyOrder_status_idx" ON "ZeltyOrder"("status");

-- CreateIndex
CREATE INDEX "ZeltyOrder_zeltyCreatedAt_idx" ON "ZeltyOrder"("zeltyCreatedAt");

-- AddForeignKey
ALTER TABLE "ZeltyOrder" ADD CONSTRAINT "ZeltyOrder_zeltyRestaurantId_fkey" FOREIGN KEY ("zeltyRestaurantId") REFERENCES "ZeltyRestaurant"("zeltyId") ON DELETE RESTRICT ON UPDATE CASCADE;
