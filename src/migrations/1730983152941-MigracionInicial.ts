import { MigrationInterface, QueryRunner } from "typeorm";

export class MigracionInicial1730983152941 implements MigrationInterface {
    name = 'MigracionInicial1730983152941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "review" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "rating" integer NOT NULL, "comments" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar, "restaurantId" varchar)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`);
        await queryRunner.query(`CREATE TABLE "favorite" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar, "restaurantId" varchar)`);
        await queryRunner.query(`CREATE TABLE "restaurant" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "neighborhood" varchar NOT NULL, "photograph" varchar NOT NULL, "address" varchar NOT NULL, "latlng" text NOT NULL, "image" varchar NOT NULL, "cuisine_type" varchar NOT NULL, "operating_hours" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "temporary_review" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "rating" integer NOT NULL, "comments" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar, "restaurantId" varchar, CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_209aeb49a7aebc856b84b940a41" FOREIGN KEY ("restaurantId") REFERENCES "restaurant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_review"("id", "name", "rating", "comments", "createdAt", "userId", "restaurantId") SELECT "id", "name", "rating", "comments", "createdAt", "userId", "restaurantId" FROM "review"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`ALTER TABLE "temporary_review" RENAME TO "review"`);
        await queryRunner.query(`CREATE TABLE "temporary_favorite" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar, "restaurantId" varchar, CONSTRAINT "FK_83b775fdebbe24c29b2b5831f2d" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_1148919a07d319dc2565324a6ef" FOREIGN KEY ("restaurantId") REFERENCES "restaurant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_favorite"("id", "createdAt", "userId", "restaurantId") SELECT "id", "createdAt", "userId", "restaurantId" FROM "favorite"`);
        await queryRunner.query(`DROP TABLE "favorite"`);
        await queryRunner.query(`ALTER TABLE "temporary_favorite" RENAME TO "favorite"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorite" RENAME TO "temporary_favorite"`);
        await queryRunner.query(`CREATE TABLE "favorite" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar, "restaurantId" varchar)`);
        await queryRunner.query(`INSERT INTO "favorite"("id", "createdAt", "userId", "restaurantId") SELECT "id", "createdAt", "userId", "restaurantId" FROM "temporary_favorite"`);
        await queryRunner.query(`DROP TABLE "temporary_favorite"`);
        await queryRunner.query(`ALTER TABLE "review" RENAME TO "temporary_review"`);
        await queryRunner.query(`CREATE TABLE "review" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "rating" integer NOT NULL, "comments" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar, "restaurantId" varchar)`);
        await queryRunner.query(`INSERT INTO "review"("id", "name", "rating", "comments", "createdAt", "userId", "restaurantId") SELECT "id", "name", "rating", "comments", "createdAt", "userId", "restaurantId" FROM "temporary_review"`);
        await queryRunner.query(`DROP TABLE "temporary_review"`);
        await queryRunner.query(`DROP TABLE "restaurant"`);
        await queryRunner.query(`DROP TABLE "favorite"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "review"`);
    }

}
