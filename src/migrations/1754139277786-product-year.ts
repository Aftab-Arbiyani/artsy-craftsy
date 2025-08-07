import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductYear1754139277786 implements MigrationInterface {
  name = 'ProductYear1754139277786';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD "year_of_artwork" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "custom_art" ADD "artist_id" uuid`);
    await queryRunner.query(
      `CREATE INDEX "IDX_669dc785b18384b946ebab52e3" ON "custom_art" ("artist_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" ADD CONSTRAINT "FK_669dc785b18384b946ebab52e39" FOREIGN KEY ("artist_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "custom_art" DROP CONSTRAINT "FK_669dc785b18384b946ebab52e39"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_669dc785b18384b946ebab52e3"`,
    );
    await queryRunner.query(`ALTER TABLE "custom_art" DROP COLUMN "artist_id"`);
    await queryRunner.query(
      `ALTER TABLE "product" DROP COLUMN "year_of_artwork"`,
    );
  }
}
