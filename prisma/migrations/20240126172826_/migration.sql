/*
  Warnings:

  - You are about to drop the `_posttags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `experience` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `herosection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `skill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `skillexp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_posttags` DROP FOREIGN KEY `_PostTags_A_fkey`;

-- DropForeignKey
ALTER TABLE `_posttags` DROP FOREIGN KEY `_PostTags_B_fkey`;

-- DropForeignKey
ALTER TABLE `experience` DROP FOREIGN KEY `Experience_experienceId_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `skill` DROP FOREIGN KEY `Skill_skillId_fkey`;

-- DropTable
DROP TABLE `_posttags`;

-- DropTable
DROP TABLE `experience`;

-- DropTable
DROP TABLE `herosection`;

-- DropTable
DROP TABLE `post`;

-- DropTable
DROP TABLE `services`;

-- DropTable
DROP TABLE `skill`;

-- DropTable
DROP TABLE `skillexp`;

-- DropTable
DROP TABLE `tags`;

-- CreateTable
CREATE TABLE `SiteConfiguration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `homeConfig` JSON NOT NULL,
    `aboutConfig` JSON NOT NULL,
    `serviceConfig` JSON NOT NULL,
    `portfolioConfig` JSON NOT NULL,
    `contactConfig` JSON NOT NULL,
    `experienceConfig` JSON NOT NULL,
    `educationConfig` JSON NOT NULL,
    `projectsConfig` JSON NOT NULL,
    `socialConfig` JSON NOT NULL,

    UNIQUE INDEX `SiteConfiguration_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SiteConfiguration` ADD CONSTRAINT `SiteConfiguration_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
