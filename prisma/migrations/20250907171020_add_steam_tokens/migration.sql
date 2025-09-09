-- CreateTable
CREATE TABLE "User" (
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "SteamToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SteamToken_username_key" ON "SteamToken"("username");
