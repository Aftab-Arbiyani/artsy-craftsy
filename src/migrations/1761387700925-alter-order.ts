import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterOrder1761387700925 implements MigrationInterface {
  name = 'AlterOrder1761387700925';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "discount_amount" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "tax_amount" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "cancelled_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "completed_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "custom_request_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "UQ_9d3f1eb968f699c558030bf0f25" UNIQUE ("custom_request_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9d3f1eb968f699c558030bf0f2" ON "orders" ("custom_request_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_9d3f1eb968f699c558030bf0f25" FOREIGN KEY ("custom_request_id") REFERENCES "custom_art"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_9d3f1eb968f699c558030bf0f25"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9d3f1eb968f699c558030bf0f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "UQ_9d3f1eb968f699c558030bf0f25"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "custom_request_id"`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "completed_at"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "cancelled_at"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "tax_amount"`);
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "discount_amount"`,
    );
  }
}
