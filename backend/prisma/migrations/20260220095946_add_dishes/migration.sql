-- CreateTable
CREATE TABLE "ZeltyDish" (
    "id" TEXT NOT NULL,
    "zeltyId" INTEGER NOT NULL,
    "zeltyRestaurantId" INTEGER NOT NULL,
    "remoteId" TEXT,
    "sku" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "thumb" TEXT,
    "price" INTEGER NOT NULL DEFAULT 0,
    "priceTogo" INTEGER,
    "priceDelivery" INTEGER,
    "happyPrice" INTEGER,
    "costPrice" INTEGER,
    "tax" INTEGER NOT NULL DEFAULT 0,
    "taxTakeaway" INTEGER,
    "taxDelivery" INTEGER,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "options" JSONB NOT NULL DEFAULT '[]',
    "fabricationPlaceId" INTEGER,
    "color" TEXT,
    "loyaltyPoints" INTEGER NOT NULL DEFAULT 0,
    "earnLoyalty" INTEGER NOT NULL DEFAULT 0,
    "priceToDefine" BOOLEAN NOT NULL DEFAULT false,
    "disable" BOOLEAN NOT NULL DEFAULT false,
    "disableTakeaway" BOOLEAN NOT NULL DEFAULT false,
    "disableDelivery" BOOLEAN NOT NULL DEFAULT false,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZeltyDish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZeltyOrderItem" (
    "id" TEXT NOT NULL,
    "zeltyId" INTEGER NOT NULL,
    "zeltyOrderId" INTEGER NOT NULL,
    "zeltyDishId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "course" INTEGER NOT NULL DEFAULT 0,
    "comment" TEXT,
    "baseOriginalAmountIncTax" INTEGER NOT NULL DEFAULT 0,
    "originalAmountIncTax" INTEGER NOT NULL DEFAULT 0,
    "discountedAmountIncTax" INTEGER NOT NULL DEFAULT 0,
    "finalAmountIncTax" INTEGER NOT NULL DEFAULT 0,
    "taxAmount" INTEGER NOT NULL DEFAULT 0,
    "taxRate" INTEGER,
    "modifiers" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZeltyOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ZeltyDish_zeltyId_key" ON "ZeltyDish"("zeltyId");

-- CreateIndex
CREATE INDEX "ZeltyDish_zeltyRestaurantId_idx" ON "ZeltyDish"("zeltyRestaurantId");

-- CreateIndex
CREATE INDEX "ZeltyDish_disable_idx" ON "ZeltyDish"("disable");

-- CreateIndex
CREATE UNIQUE INDEX "ZeltyOrderItem_zeltyId_key" ON "ZeltyOrderItem"("zeltyId");

-- CreateIndex
CREATE INDEX "ZeltyOrderItem_zeltyOrderId_idx" ON "ZeltyOrderItem"("zeltyOrderId");

-- CreateIndex
CREATE INDEX "ZeltyOrderItem_zeltyDishId_idx" ON "ZeltyOrderItem"("zeltyDishId");

-- AddForeignKey
ALTER TABLE "ZeltyDish" ADD CONSTRAINT "ZeltyDish_zeltyRestaurantId_fkey" FOREIGN KEY ("zeltyRestaurantId") REFERENCES "ZeltyRestaurant"("zeltyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZeltyOrderItem" ADD CONSTRAINT "ZeltyOrderItem_zeltyOrderId_fkey" FOREIGN KEY ("zeltyOrderId") REFERENCES "ZeltyOrder"("zeltyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZeltyOrderItem" ADD CONSTRAINT "ZeltyOrderItem_zeltyDishId_fkey" FOREIGN KEY ("zeltyDishId") REFERENCES "ZeltyDish"("zeltyId") ON DELETE RESTRICT ON UPDATE CASCADE;
