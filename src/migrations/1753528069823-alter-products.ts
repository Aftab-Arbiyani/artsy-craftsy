import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterProducts1753528069823 implements MigrationInterface {
  name = 'AlterProducts1753528069823';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."product_status_enum" AS ENUM('active', 'in_active', 'sold', 'archived')`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD "status" "public"."product_status_enum" NOT NULL DEFAULT 'active'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0dce9bc93c2d2c399982d04bef" ON "product" ("category_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0dce9bc93c2d2c399982d04bef"`,
    );
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."product_status_enum"`);
  }
}
